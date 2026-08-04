import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faArrowLeft, faSave, faEye, faEyeSlash, 
  faImage, faPlusCircle, faRobot, faTrash,
  faTextHeight, faPalette, faFillDrip, faCheckCircle,
  faPaperPlane
} from '@fortawesome/free-solid-svg-icons';
import { newsletterService } from '../api/services';
import { toast } from 'react-toastify';
import Navbar from '../components/Navbar';
import HandSpinner from '../components/HandSpinner';
import '../styles/AdminNewsletterEditor.css';

const AdminNewsletterEditor = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [isPreview, setIsPreview] = useState(false);
  // On utilise la langue de i18next pour déterminer quelle version on édite
  const currentLang = i18n.language.split('-')[0] === 'en' ? 'en' : 'fr';
  
  const [activeBlockId, setActiveBlockId] = useState(null);
  const [showMobileTools, setShowMobileTools] = useState(false);
  const fileInputRef = useRef(null);
  const [uploadTarget, setUploadTarget] = useState(null);

  // Gemini Modal States
  const [showGeminiModal, setShowGeminiModal] = useState(false);
  const [geminiPrompt, setGeminiPrompt] = useState('');
  const [geminiGeneratedText, setGeminiGeneratedText] = useState('');
  const [geminiLoading, setGeminiLoading] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const [currentBlockIdForGemini, setCurrentBlockIdForGemini] = useState(null); // New state to track block context

  // New states for other AI/Media modals
  const [showSearchImageModal, setShowSearchImageModal] = useState(false);
  // SUPPRIMER : on retire setShowGenerateImageModal et tout ce qui s'y rapporte.
  // const [showGenerateImageModal, setShowGenerateImageModal] = useState(false);
  // const [imagePrompt, setImagePrompt] = useState(''); // New state for image generation prompt
  // const [isGeneratingImage, setIsGeneratingImage] = useState(false); // New state for image generation loading
  // const [generatedImageUrl, setGeneratedImageUrl] = useState(null); // New state for generated image URL
  // const [imageGenerationError, setImageGenerationError] = useState(null); // New state for error handling

  // New states for image search
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState([]); // Tableau vide au départ !
  const [selectedPhotoUrl, setSelectedPhotoUrl] = useState(null);

  // SUPPRIMER : Initialisation des résultats de recherche avec un terme par défaut au chargement de la modale
  /*
  useEffect(() => {
    if (showSearchImageModal) {
      const defaultQuery = '';
      // Générer dynamiquement 6 URLs d'images pour le terme par défaut
      const initialResults = Array.from({ length: 6 }, (_, index) =>
        `https://loremflickr.com/500/350/${encodeURIComponent(defaultQuery)}?lock=${index + 1}`
      );
      setSearchResults(initialResults);
      setSelectedPhotoUrl(null); // S'assurer qu'aucune image n'est sélectionnée par défaut
      setSearchQuery(defaultQuery); // Pré-remplir le champ de recherche
    }
  }, [showSearchImageModal]);
  */

  // SVG Gemini Logo
  const GeminiLogo = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" >
      <path d="M12 2L14.85 9.15L22 12L14.85 14.85L12 22L9.15 14.85L2 12L9.15 9.15L12 2Z" fill="currentColor"/>
      <path d="M19 3L19.71 4.71L21.42 5.42L19.71 6.13L19 7.84L18.29 6.13L16.58 5.42L18.29 4.71L19 3Z" fill="currentColor"/>
    </svg>
  );

  // État initial (Outil réutilisable)
  const [data, setData] = useState({
    title: {
      fr: "NEWSLETTER #",
      en: "NEWSLETTER #"
    },
    date: new Date().toISOString().split('T')[0],
    bannerImage: '/assets/covers/banner-news.webp',
    presidentImage: '/assets/mentions/president-mama.webp',
    edito: {
      fr: "Votre édito ici...",
      en: "Your editorial here..."
    },
    blocks: [
      {
        id: Date.now(),
        type: 'article',
        image: '',
        text: { fr: 'Votre texte d\'article ici...', en: 'Your article text here...' },
        styles: { fontSize: '1.25rem', color: 'white' }
      }
    ],
    tags: {
      fr: [],
      en: []
    },
    pdfPath: '',
    isPublished: false
  });

  // Outils Word
  const execCommand = (command, value = null) => {
    document.execCommand(command, false, value);
  };

  useEffect(() => {
    if (id) {
      fetchNewsletter();
    }
  }, [id]);

  const fetchNewsletter = async () => {
    try {
      setLoading(true);
      const res = await newsletterService.getById(id);
      const nl = res.data;

      // Reconstruction de l'état blocks à partir de content
      const editoBlockFr = nl.content.fr.find(b => b.type === 'edito');
      const articleBlocksFr = nl.content.fr.filter(b => b.type !== 'edito');
      const articleBlocksEn = nl.content.en.filter(b => b.type !== 'edito');

      const reconstructedBlocks = articleBlocksFr.map((b, idx) => ({
        id: b.id || idx,
        type: b.type,
        image: b.image,
        text: {
          fr: b.text,
          en: articleBlocksEn[idx]?.text || ""
        },
        styles: b.styles || { fontSize: '1.25rem', color: 'white' }
      }));

      setData({
        title: nl.title,
        date: new Date(nl.date).toISOString().split('T')[0],
        bannerImage: nl.coverImage,
        presidentImage: editoBlockFr?.image || nl.presidentImage || '/assets/mentions/president-mama.webp',
        edito: {
          fr: editoBlockFr?.content || nl.edito?.fr || "",
          en: nl.content.en.find(b => b.type === 'edito')?.content || nl.edito?.en || ""
        },
        blocks: reconstructedBlocks,
        tags: nl.tags || { fr: [], en: [] },
        pdfPath: '',
        isPublished: false
      });
    } catch (err) {
      toast.error("Erreur lors du chargement de la newsletter");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleTextChange = (field, value, blockId = null) => {
    if (blockId) {
      setData(prev => ({
        ...prev,
        blocks: prev.blocks.map(b => b.id === blockId ? { ...b, text: { ...b.text, [currentLang]: value } } : b)
      }));
    } else {
      setData(prev => ({
        ...prev,
        [field]: { ...prev[field], [currentLang]: value }
      }));
    }
  };

  const handleTagChange = (newTagsString) => {
    const tagList = newTagsString.split(',').map(s => s.trim()).filter(s => s !== "");
    setData(prev => ({
      ...prev,
      tags: { ...prev.tags, [currentLang]: tagList }
    }));
  };

  const handleStyleChange = (blockId, styleKey, value) => {
    setData(prev => ({
      ...prev,
      blocks: prev.blocks.map(b => b.id === blockId ? { ...b, styles: { ...b.styles, [styleKey]: value } } : b)
    }));
  };

  const addBlock = () => {
    const newBlock = {
      id: Date.now(),
      type: 'article',
      image: '',
      text: { fr: 'Votre texte d\'article ici...', en: 'Your article text here...' },
      styles: { fontSize: '1.25rem', color: 'white' }
    };
    setData(prev => ({ ...prev, blocks: [...prev.blocks, newBlock] }));
  };

  const deleteBlock = (id) => {
    setData(prev => ({ ...prev, blocks: prev.blocks.filter(b => b.id !== id) }));
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('image', file);

    try {
      toast.info("Upload de l'image...");
      const res = await newsletterService.uploadImage(formData);
      // On utilise l'URL relative retournée par le backend
      const imageUrl = res.data.url;

      if (uploadTarget === 'banner') {
        setData(prev => ({ ...prev, bannerImage: imageUrl }));
      } else if (uploadTarget === 'president') {
        setData(prev => ({ ...prev, presidentImage: imageUrl }));
      } else {
        setData(prev => ({
          ...prev,
          blocks: prev.blocks.map(b => b.id === uploadTarget ? { ...b, image: imageUrl } : b)
        }));
      }
      toast.success("Image mise à jour !");
    } catch (err) {
      toast.error("Échec de l'upload.");
    }
  };

  // Function to generate content via Gemini API, called from within the modal
  const handleGenerateInModal = async () => {
    if (!geminiPrompt.trim()) {
      toast.warning("Veuillez saisir un prompt pour générer du texte.");
      return;
    }

    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    if (!apiKey) {
      toast.error("Clé API Gemini non configurée dans le fichier .env (VITE_GEMINI_API_KEY).");
      return;
    }

    setGeminiLoading(true);
    setGeminiGeneratedText(''); // Clear previous generated text
    try {
      toast.info("L'IA Gemini rédige votre contenu...");

      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{ parts: [{ text: geminiPrompt }] }],
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || "Erreur lors de l'appel à l'API Gemini.");
      }

      const data = await response.json();
      const generatedContent = data.candidates?.[0]?.content?.parts?.[0]?.text;

      if (generatedContent) {
        setGeminiGeneratedText(generatedContent);
        toast.success("Contenu généré par l'IA avec succès !");
      } else {
        toast.warning("L'IA n'a pas généré de contenu. Veuillez réessayer ou ajuster le prompt.");
      }
    } catch (err) {
      console.error("Erreur lors de la génération IA dans la modale:", err);
      toast.error("Erreur IA : " + (err.message || "Connexion impossible"));
    } finally {
      setGeminiLoading(false);
    }
  };

  // Function to open the Gemini modal and pre-fill prompt with block content
  const handleOpenGeminiModalForBlock = (blockId) => {
    const block = data.blocks.find(b => b.id === blockId);
    if (block) {
      setGeminiPrompt(block.text[currentLang] || ''); // Pre-fill with block content
      setCurrentBlockIdForGemini(blockId); // Store the block ID for potential future use (e.e., applying generated text)
    } else {
      setGeminiPrompt(''); // Clear prompt if no block is associated
      setCurrentBlockIdForGemini(null);
    }
    setGeminiGeneratedText(''); // Clear previous generated text
    setShowGeminiModal(true);
    setCopySuccess(false); // Reset copy success state
  };

  // SUPPRIMER : on retire handleGenerateImage et handleInsertGeneratedImage
  /*
  const handleGenerateImage = () => {
    if (!imagePrompt.trim()) {
      toast.warning("Veuillez saisir une description pour générer l'image.");
      return;
    }

    setIsGeneratingImage(true);
    setGeneratedImageUrl(null); // Clear previous image
    setImageGenerationError(null); // Clear previous error

      toast.info("L'IA réfléchit et dessine...");

    const encodedPrompt = encodeURIComponent(imagePrompt.trim() || 'illustration');
    const newUrl = `https://pollinations.ai/p/${encodedPrompt}?width=600&height=400&seed=${Date.now()}`;

      setGeneratedImageUrl(newUrl);
  };

  const handleInsertGeneratedImage = () => {
    if (generatedImageUrl) {
      const newBlock = {
        id: Date.now(),
        type: 'article',
        image: generatedImageUrl,
        text: { fr: 'Image générée par IA.', en: 'AI generated image.' },
        styles: { fontSize: '1.25rem', color: 'white' }
      };
      setData(prev => ({ ...prev, blocks: [...prev.blocks, newBlock] }));
      toast.success("Image insérée dans la newsletter !");
      setShowGenerateImageModal(false); // Close modal after inserting
      setImagePrompt(''); // Reset prompt
      setGeneratedImageUrl(null); // Reset generated image
      setImageGenerationError(null); // Reset error
    } else {
      toast.error("Aucune image générée à insérer.");
    }
  };
  */

  // Modifié pour utiliser LoremFlickr et 6 images dynamiquement et gérer le cas de recherche vide
  const handleSearchPhotos = () => {
    const query = searchQuery.trim();

    if (!query) {
      toast.warning("Veuillez saisir un mot-clé pour rechercher des images.");
      setSearchResults([]); // Assurez-vous que les résultats sont vides si la recherche est vide
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
                setSearchResults([]);
                setSelectedPhotoUrl(null);

    // Formater la requête pour remplacer les espaces par des virgules pour LoremFlickr
    const formattedQuery = query.replace(/\s+/g, ',');

    // Générer un tableau de 6 URLs d'images via LoremFlickr
    const newResults = Array.from({ length: 6 }, (_, i) =>
      `https://loremflickr.com/500/350/${encodeURIComponent(formattedQuery)}?lock=${i + 1}`
  );

    setSearchResults(newResults);
    setIsSearching(false);
    toast.success(`Recherche de photos pour "${query}" terminée !`);
};

  const handleInsertSelectedPhoto = () => {
    if (selectedPhotoUrl) {
      const newBlock = {
        id: Date.now(),
        type: 'article',
        image: selectedPhotoUrl,
        text: { fr: 'Image recherchée.', en: 'Searched image.' },
        styles: { fontSize: '1.25rem', color: 'white' }
      };
      setData(prev => ({ ...prev, blocks: [...prev.blocks, newBlock] }));
      toast.success("Photo insérée dans la newsletter !");
      setShowSearchImageModal(false); // Close modal after inserting
      setSearchQuery('');
      setSearchResults([]);
      setSelectedPhotoUrl(null);
    } else {
      toast.error("Veuillez sélectionner une photo à insérer.");
    }
  };

  const handleSave = async () => {
    try {
      const formatted = {
        ...data,
        summary: {
          fr: data.edito.fr.substring(0, 150) + '...',
          en: data.edito.en.substring(0, 150) + '...'
        },
        coverImage: data.bannerImage,
        content: {
          fr: [
            { type: 'edito', content: data.edito.fr, image: data.presidentImage },
            ...data.blocks.map(b => ({ ...b, text: b.text.fr }))
          ],
          en: [
            { type: 'edito', content: data.edito.en, image: data.presidentImage },
            ...data.blocks.map(b => ({ ...b, text: b.text.en }))
          ],
        }
      };

      if (id) {
        await newsletterService.update(id, formatted);
        toast.success("Newsletter mise à jour avec succès !");
      } else {
        await newsletterService.create(formatted);
        toast.success("Newsletter créée avec succès !");
      }
      navigate('/admin');
    } catch (err) {
      toast.error("Erreur lors de l'enregistrement : " + (err.message || "Serveur injoignable"));
    }
  };

  const handleBroadcast = async () => {
    if (!id) {
      toast.warning("Veuillez d'abord enregistrer la newsletter avant de l'envoyer.");
      return;
    }

    if (!window.confirm("🚀 Voulez-vous vraiment diffuser cette newsletter à TOUS les abonnés ? Cette action est irréversible.")) {
      return;
    }

    try {
      setLoading(true);
      const res = await newsletterService.broadcast(id);
      toast.success(res.data.message || "La diffusion a commencé !");
    } catch (err) {
      toast.error("Erreur lors de la diffusion : " + (err.response?.data?.error || err.message));
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <HandSpinner fullPage={true} />;

  return (
    <div className={`newsletter-editor-layout ${isPreview ? 'preview-mode' : ''}`}>
      <Navbar hideDonate={true} />

      <input type="file" ref={fileInputRef} style={{ display: 'none' }} onChange={handleImageUpload} />

      {/* BARRE LATÉRALE GAUCHE (ACTIONS PRINCIPALES) */}
      {!isPreview && (
        <div className="editor-toolbar">
          <button className="v2-btn-icon" onClick={() => navigate('/admin')} title="Retour">
            <FontAwesomeIcon icon={faArrowLeft} />
          </button>

          <div className="toolbar-separator" style={{ height: '2px', width: '30px', background: '#eee' }}></div>

          <button className="v2-btn-icon" onClick={() => setIsPreview(!isPreview)} title="Aperçu de la newsletter">
            <FontAwesomeIcon icon={faEye} />
          </button>

          <button className="v2-btn-icon save-btn" onClick={handleSave} title="Enregistrer la newsletter">
            <FontAwesomeIcon icon={faSave} />
          </button>

          {id && (
            <button className="v2-btn-icon broadcast-btn" onClick={handleBroadcast} title="Diffuser la newsletter">
              <FontAwesomeIcon icon={faPaperPlane} />
            </button>
          )}

          <div className="toolbar-separator" style={{ height: '2px', width: '30px', background: '#eee' }}></div>

          <button className="v2-btn-icon add-block-btn" onClick={addBlock} title="Ajouter un bloc">
            <FontAwesomeIcon icon={faPlusCircle} />
          </button>

          {/* Nouveaux boutons IA déplacés ici */}
          <button className="v2-btn-icon ai-text-btn" onClick={() => setShowGeminiModal(true)} title="Assistant Rédaction IA">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M4 14.899A7 7 0 0 1 15.707 5h1.793a5 5 0 0 1 0 10h-1.5M9 20l3-3 3 3"/>
                        </svg>
                      </button>
          <button className="v2-btn-icon photo-btn" onClick={() => {
            setShowSearchImageModal(true);
            setSearchQuery('');         // Reset the search query
            setSearchResults([]);       // Clear previous search results
            setSelectedPhotoUrl(null);  // Clear any selected photo
          }} title="Rechercher une photo">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                          <circle cx="8.5" cy="8.5" r="1.5"></circle>
                          <polyline points="21 15 16 10 5 21"></polyline>
                        </svg>
              </button>
          {/* SUPPRIMER : on retire le bouton de génération d'image par IA
          <button className="v2-btn-icon ai-gen-img-btn" onClick={() => setShowGenerateImageModal(true)} title="Générer une image avec l'IA">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <circle cx="12" cy="12" r="10"></circle>
                          <path d="M5.2 14.2c-2.3-2.3-2.3-6.1 0-8.4s6.1-2.3 8.4 0"></path>
                          <circle cx="14" cy="10" r="2"></circle>
                        </svg>
                </button>
          */}

          {/* BOUTON MOBILE POUR OUVRIR LES OUTILS */}
          <button className="v2-btn-icon btn-mobile-tools" onClick={() => setShowMobileTools(!showMobileTools)} title="Outils de style">
            <FontAwesomeIcon icon={faPalette} />
              </button>
              </div>
      )}

      {/* BOUTON ÉDITION (SI PREVIEW) */}
      {isPreview && (
        <button
                className="v2-btn v2-btn-green"
          style={{ position: 'fixed', top: '110px', left: '20px', zIndex: 3000 }}
          onClick={() => setIsPreview(false)}
          title="Retour à l'édition"
              >
          <FontAwesomeIcon icon={faEyeSlash} /> Retour à l'édition
              </button>
              )}

      <div className="editor-container">

        {/* BANNIÈRE HEADER */}
        <div className="mag-header-banner" title="Image de couverture">
          <img src={data.bannerImage} alt="Bannière" />
                  {!isPreview && (
            <button className="mag-action-btn" onClick={() => { setUploadTarget('banner'); fileInputRef.current.click(); }} title="Changer la bannière">
              <FontAwesomeIcon icon={faImage} /> Changer la bannière
                      </button>
                  )}
                </div>

        <div className="mag-content-padding">
          <h1
            className="mag-main-title editable-area"
            contentEditable={!isPreview}
            suppressContentEditableWarning={true}
            onBlur={(e) => handleTextChange('title', e.target.innerText)}
                >
            {data.title[currentLang]}
          </h1>

          {/* EDITO VERT INSTITUTIONNEL & ACCENT D'OR */}
          <section className="mag-edito-box">
            <div className="mag-edito-left">
              <h3 style={{ color: '#fcd116', marginBottom: '15px', textTransform: 'uppercase', fontSize: '0.95rem', fontWeight: '800', letterSpacing: '1px' }}>
                {currentLang === 'fr' ? "Le mot de la Présidente" : "A word from the President"}
              </h3>
              <div className="president-img-wrapper" onClick={() => { setUploadTarget('president'); fileInputRef.current.click(); }} title="Changer l'image de la Présidente">
                <img
                  src={data.presidentImage}
                  alt="Avatar"
                  className="mag-edito-img"
                />
                {!isPreview && <div className="img-mini-btn"><FontAwesomeIcon icon={faPlusCircle} /></div>}
            </div>
    </div>
            <div className="mag-edito-right">
              <div
                className="editable-area edito-text"
                contentEditable={!isPreview}
                suppressContentEditableWarning={true}
                onBlur={(e) => handleTextChange('edito', e.target.innerText)}
              >
                {data.edito[currentLang]}
        </div>
      {!isPreview && (
                 <button className="mag-action-btn" style={{ marginTop: '20px', background: 'rgba(255,255,255,0.2)' }} onClick={() => execCommand('insertText', ' ')} title="Ajouter du texte">
                   <FontAwesomeIcon icon={faPlusCircle} /> Ajouter du texte
                 </button>
      )}
    </div>
          </section>

          {/* BLOCS ARTICLES */}
          <div className="mag-articles-list">
            {data.blocks.map((block, index) => (
              <div key={block.id} className="mag-article-row">
                <div
                  className="mag-article-img-box"
                  title="Image de l'article"
                >
                  {block.image ? (
                    <img src={block.image} alt="Article" />
                  ) : (
                    <div className="add-img-placeholder">
                      <FontAwesomeIcon icon={faImage} size="3x" color="rgba(255,255,255,0.3)" />
                      <span>Aucune image</span>
          </div>
      )}
                  {!isPreview && (
                    <button className="mag-action-btn" onClick={() => { setUploadTarget(block.id); fileInputRef.current.click(); }} title="Ajouter une image">
                      <FontAwesomeIcon icon={faImage} /> Ajouter une image
                    </button>
                  )}
    </div>
                <div className="mag-article-right" style={block.styles}>
                  <div
                    className="mag-article-text editable-area"
                    contentEditable={!isPreview}
                    suppressContentEditableWarning={true}
                    onBlur={(e) => handleTextChange('text', e.target.innerText, block.id)}
                    onClick={() => { setActiveBlockId(block.id); setShowMobileTools(true); }}
                  >
                    {block.text[currentLang]}
                  </div>
                  {!isPreview && (
                    <div className="block-actions">
                      <button className="mag-action-btn" style={{ background: 'rgba(255,255,255,0.1)', margin: 0 }} onClick={() => execCommand('insertText', ' ')} title="Ajouter du texte">
                        <FontAwesomeIcon icon={faPlusCircle} /> Ajouter du texte
                      </button>
                      <button className="v2-btn-icon btn-delete" onClick={() => deleteBlock(block.id)} title="Supprimer ce bloc"><FontAwesomeIcon icon={faTrash} /></button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {!isPreview && (
            <div className="add-block-zone" onClick={addBlock} style={{ cursor: 'pointer', padding: '40px', border: '2px dashed rgba(255,255,255,0.3)', borderRadius: '20px', marginTop: '60px', textAlign: 'center' }} title="Ajouter un nouveau bloc article">
              <FontAwesomeIcon icon={faPlusCircle} size="3x" style={{ marginBottom: '15px' }} />
              <h3 style={{ margin: 0 }}>Ajouter un article (Image + Texte alterné)</h3>
            </div>
          )}
        </div>

        {/* FOOTER */}
        <footer className="mag-footer-v2">
          <img src="/assets/logos/logoMama.png" alt="Logo" className="mag-footer-logo" />
          <p>© {new Date().getFullYear()} - Association Mama Esther - Tous droits réservés - {data.title[currentLang]}</p>
          <div className="mag-footer-btns">
            <button className="mag-btn-news" title="Contactez-nous">Contact</button>
            <button className="mag-btn-news" title="Voir les mentions légales">Mentions légales</button>
            <button className="mag-btn-news" style={{ opacity: 0.5 }} title="Se désinscrire de la newsletter">Désinscription</button>
          </div>
        </footer>

      </div>

      {/* BOITE A OUTILS (DROITE) - TOUJOURS VISIBLE SI PAS PREVIEW */}
      {!isPreview && (
        <div className={`sidebar-toolbox ${showMobileTools ? 'mobile-open' : ''}`}>
          <div className="toolbox-header">
            <FontAwesomeIcon icon={faPalette} /> Outils de Style
          </div>

          <div className="tool-group">
            <label>Mise en forme rapide</label>
            <div className="rich-text-tools">
              <button className="btn-tool-rich" onClick={() => execCommand('bold')} title="Gras" style={{ fontWeight: 'bold' }}>G</button>
              <button className="btn-tool-rich" onClick={() => execCommand('italic')} title="Italique" style={{ fontStyle: 'italic', fontFamily: '"Times New Roman", Times, serif', fontWeight: '500', fontSize: '1.2rem' }}>I</button>
              <button className="btn-tool-rich" onClick={() => execCommand('underline')} title="Souligné" style={{ textDecoration: 'underline' }}>S</button>
            </div>
          </div>

          <div className="tool-group">
            <label><FontAwesomeIcon icon={faTextHeight} /> Taille de police</label>
            <select className="tool-select-v2" onChange={(e) => {
              if (activeBlockId && activeBlockId !== 'edito') handleStyleChange(activeBlockId, 'fontSize', e.target.value);
              else execCommand('fontSize', e.target.value);
            }} title="Changer la taille de police">
              <option value="3">Petit</option>
              <option value="4" selected>Normal</option>
              <option value="5">Grand</option>
              <option value="6">Très Grand</option>
            </select>
          </div>

          <div className="tool-group">
            <label><FontAwesomeIcon icon={faFillDrip} /> Couleur de police</label>
            <input type="color" className="tool-color-picker" onChange={(e) => {
               if (activeBlockId && activeBlockId !== 'edito') handleStyleChange(activeBlockId, 'color', e.target.value);
               else execCommand('foreColor', e.target.value);
            }} defaultValue="#ffffff" title="Changer la couleur du texte" />
          </div>

          <div className="tool-group">
            <label>Polices (Style Word)</label>
            <select className="tool-select-v2" onChange={(e) => execCommand('fontName', e.target.value)} title="Changer la police">
              <option value="Alegreya Sans">Alegreya Sans (Défaut)</option>
              <option value="Arial">Arial</option>
              <option value="Georgia">Georgia</option>
              <option value="Times New Roman">Times New Roman</option>
              <option value="Verdana">Verdana</option>
            </select>
          </div>

          <div style={{ marginTop: '10px', fontSize: '0.8rem', opacity: 0.7, fontStyle: 'italic' }}>
            Sélectionnez du texte pour appliquer les styles Word.
          </div>

          <button className="tool-btn-close" onClick={() => { setActiveBlockId(null); setShowMobileTools(false); }} title="Fermer les outils">Prêt !</button>
        </div>
      )}

      {/* Gemini 2.5 Flash Modal (Texte IA) */}
      {showGeminiModal && (
        <div className="gemini-modal-overlay">
          <div className="gemini-modal">
            <div className="gemini-modal-header">
              <h2><GeminiLogo /> Gemini 2.5 Flash</h2>
              <button className="close-btn" onClick={() => {
                setShowGeminiModal(false);
                setGeminiPrompt('');
                setGeminiGeneratedText('');
                setCopySuccess(false);
                setCurrentBlockIdForGemini(null);
              }} title="Fermer la modale">&times;</button>
            </div>
            <div className="gemini-modal-body">
              <textarea
                className="gemini-textarea-prompt"
                placeholder="Saisissez votre demande ici (ex: 'Rédige un paragraphe sur l'importance des dons pour notre association.')"
                value={geminiPrompt}
                onChange={(e) => setGeminiPrompt(e.target.value)}
                rows="6"
                title="Saisissez votre prompt pour Gemini"
              ></textarea>
              <button
                className="v2-btn v2-btn-green"
                onClick={handleGenerateInModal}
                disabled={geminiLoading || geminiPrompt.trim() === ''}
                style={{ marginTop: '15px' }}
                title="Générer du texte avec Gemini"
              >
                {geminiLoading ? 'Génération...' : 'Générer'}
              </button>
              {geminiLoading && <HandSpinner fullPage={false} small={true} />}
              <textarea
                className="gemini-textarea-generated"
                value={geminiGeneratedText}
                readOnly
                rows="10"
                placeholder="Le texte généré par Gemini apparaîtra ici."
                style={{ marginTop: '20px' }}
                title="Texte généré par Gemini"
              ></textarea>
              <div className="gemini-modal-actions">
                <button
                  className="v2-btn v2-btn-blue"
                  onClick={() => {
                    navigator.clipboard.writeText(geminiGeneratedText);
                    setCopySuccess(true);
                    setTimeout(() => setCopySuccess(false), 2000);
                  }}
                  disabled={!geminiGeneratedText}
                  title="Copier le texte généré"
                >
                  {copySuccess ? <FontAwesomeIcon icon={faCheckCircle} /> : 'Copier'}
                </button>
                <button
                  className="v2-btn"
                  onClick={() => {
                    setShowGeminiModal(false);
                    setGeminiPrompt('');
                    setGeminiGeneratedText('');
                    setCopySuccess(false);
                    setCurrentBlockIdForGemini(null); // Reset on modal close
                  }}
                  title="Fermer la modale Gemini"
                >
                  Fermer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Placeholder for Search Image Modal */}
      {showSearchImageModal && (
        <div className="gemini-modal-overlay">
          <div className="gemini-modal">
            <div className="gemini-modal-header">
              <h2>Recherche d'images</h2>
              <button className="close-btn" onClick={() => {
                setShowSearchImageModal(false);
                setSearchQuery('');
                setSearchResults([]);
                setSelectedPhotoUrl(null);
              }} title="Fermer la modale">&times;</button>
            </div>
            <div className="gemini-modal-body">
              <div className="search-input-group">
                <input
                  type="text"
                  className="tool-select-v2"
                  placeholder="Ex: enfance, éducation, solidarité..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => { if (e.key === 'Enter') handleSearchPhotos(); }}
                  title="Saisissez votre recherche d'images"
                />
                <button
                className="v2-btn v2-btn-green"
                  onClick={handleSearchPhotos}
                  disabled={isSearching || searchQuery.trim() === ''}
                  style={{ marginLeft: '10px' }}
                  title="Lancer la recherche"
              >
                  {isSearching ? 'Recherche...' : 'Rechercher'}
              </button>
                </div>

              {isSearching && <HandSpinner fullPage={false} small={true} style={{ marginTop: '20px' }} />}

              {!isSearching && searchResults.length === 0 && ( // Condition modifiée
                <p style={{ textAlign: 'center', marginTop: '20px', color: '#666' }}>
                  Tape un mot-clé ci-dessus puis clique sur RECHERCHER pour afficher des images.
                </p>
              )}

              {!isSearching && searchResults.length > 0 && ( // Condition pour afficher la grille si résultats
                <div className="image-gallery">
                  {searchResults.map((url, index) => (
                    <div
                      key={index}
                      className={`image-thumbnail ${selectedPhotoUrl === url ? 'selected' : ''}`}
                      onClick={() => setSelectedPhotoUrl(url)}
                      title="Cliquer pour sélectionner"
                    >
                      <img
                        src={url}
                        alt={`Résultat ${index + 1}`}
                        onError={(e) => {
                          e.target.onerror = null; // Empêche la boucle infinie d'erreur
                          e.target.src = 'https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=600&auto=format&fit=crop';
                        }}
                      />
                      {selectedPhotoUrl === url && <FontAwesomeIcon icon={faCheckCircle} className="selection-icon" />}
    </div>
                  ))}
          </div>
      )}
              {/* Le message "Aucun résultat trouvé" n'est plus nécessaire ici car géré par le message initial ou le fait que searchResults.length reste 0 */}
              {/*
              {!isSearching && searchResults.length === 0 && searchQuery.trim() !== '' && (
                <p style={{ textAlign: 'center', marginTop: '20px', color: '#666' }}>Aucun résultat trouvé pour "{searchQuery}".</p>
              )}
              */}

              <div className="gemini-modal-actions" style={{ marginTop: '30px' }}>
                <button
                  className="v2-btn"
                  onClick={() => {
                    setShowSearchImageModal(false);
                    setSearchQuery('');
                    setSearchResults([]);
                    setSelectedPhotoUrl(null);
                  }}
                  title="Annuler la recherche d'image"
                >
                  Annuler
                </button>
                <button
                  className="v2-btn v2-btn-blue"
                  onClick={handleInsertSelectedPhoto}
                  disabled={!selectedPhotoUrl}
                  title="Insérer la photo sélectionnée"
                >
                  Insérer dans la newsletter
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUPPRIMER : on retire la modale de génération d'image par IA
      {showGenerateImageModal && (
        <div className="gemini-modal-overlay">
          <div className="gemini-modal">
            <div className="gemini-modal-header">
              <h2>Génération d'images par IA</h2>
              <button className="close-btn" onClick={() => {
                setShowGenerateImageModal(false);
                setImagePrompt('');
                setIsGeneratingImage(false);
                setGeneratedImageUrl(null);
                setImageGenerationError(null); // Reset error on modal close
              }} title="Fermer la modale">&times;</button>
    </div>
            <div className="gemini-modal-body">
              <textarea
                className="gemini-textarea-prompt"
                placeholder="Décris l'image que tu souhaites générer..."
                value={imagePrompt}
                onChange={(e) => setImagePrompt(e.target.value)}
                rows="4"
                title="Description de l'image à générer"
              ></textarea>
              <button
                className="v2-btn v2-btn-green"
                onClick={handleGenerateImage}
                disabled={isGeneratingImage || imagePrompt.trim() === ''}
                style={{ marginTop: '15px' }}
                title="Lancer la génération d'image"
              >
                {isGeneratingImage ? 'Génération en cours...' : 'Générer l\'image'}
              </button>

              {isGeneratingImage && (
                <div style={{ marginTop: '20px', textAlign: 'center', color: '#fcd116' }}>
                  <HandSpinner fullPage={false} small={true} />
                  <p>L'IA réfléchit et dessine...</p>
                </div>
              )}

              {generatedImageUrl && (
                <div style={{ marginTop: '20px', textAlign: 'center' }}>
                  <img
                    src={generatedImageUrl}
                    alt="Image générée par IA"
                    className="rounded"
                    onLoad={() => {
                    setIsGeneratingImage(false);
                      toast.success("Image générée avec succès !");
                  }}
                    onError={() => {
                      setIsGeneratingImage(false);
                      setImageGenerationError("Impossible de charger l'image. Essayez des mots-clés plus simples.");
                      toast.error("Impossible de générer l'image. Essayez des mots plus simples.");
                    }}
                    style={{
                      display: isGeneratingImage ? 'none' : 'block', // Cache l'image pendant le chargement
                      maxWidth: '100%', // S'assurer que l'image est responsive dans la modale
                      height: 'auto', // Maintenir les proportions
                      borderRadius: '8px',
                      boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
                      border: '1px solid #ddd'
                    }}
                  />
                </div>
              )}

              {!isGeneratingImage && !generatedImageUrl && imageGenerationError && (
                <div style={{ marginTop: '20px', textAlign: 'center', color: 'red' }}>
                  <p>Erreur: {imageGenerationError}</p>
                  <p>Veuillez réessayer ou ajuster votre description.</p>
            </div>
              )}

              {!isGeneratingImage && !generatedImageUrl && !imageGenerationError && (
                <div style={{ marginTop: '20px', textAlign: 'center', color: '#666', fontSize: '0.9rem' }}>
                  Une fois générée, l'image apparaîtra ici.
        </div>
      )}

              <div className="gemini-modal-actions" style={{ marginTop: '30px' }}>
                <button
                  className="v2-btn"
                  onClick={() => {
                    setShowGenerateImageModal(false);
                    setImagePrompt('');
                    setIsGeneratingImage(false);
                    setGeneratedImageUrl(null);
                    setImageGenerationError(null);
                  }}
                  title="Annuler la génération d'image"
                >
                  Annuler
                </button>
                <button
                  className="v2-btn v2-btn-blue"
                  onClick={handleInsertGeneratedImage}
                  disabled={!generatedImageUrl}
                  title="Insérer l'image dans la newsletter"
                >
                  Insérer dans la newsletter
                </button>
    </div>
            </div>
          </div>
        </div>
      )}
      */}
    </div>
  );
};

export default AdminNewsletterEditor;

