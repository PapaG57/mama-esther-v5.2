import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faArrowLeft, faSave, faEye, faEyeSlash, 
  faImage, faVideo, faPlusCircle, faTrash, faTimes,
  faTextHeight, faPalette, faFillDrip, faCheckCircle,
  faPaperPlane, faGlobe, faDesktop
} from '@fortawesome/free-solid-svg-icons';
import { newsletterService } from '../api/services';
import { toast } from 'react-toastify';
import Navbar from '../components/Navbar';
import HandSpinner from '../components/HandSpinner';
import '../styles/AdminNewsletterEditor.css';
import { fetchPixabayMedia } from '../api/pixabayService';

const AdminNewsletterEditor = () => {
  const { i18n } = useTranslation();
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [isPreview, setIsPreview] = useState(false);
  const currentLang = i18n.language.split('-')[0] === 'en' ? 'en' : 'fr';
  
  const [activeBlockId, setActiveBlockId] = useState(null);
  const [showMobileTools, setShowMobileTools] = useState(false);
  const fileInputRef = useRef(null);
  const [uploadTarget, setUploadTarget] = useState(null);

  // Édition locale - Textes
  const [isEditingEdito, setIsEditingEdito] = useState(false);
  const [editingBlockId, setEditingBlockId] = useState(null);

  // Édition locale - Médias (Images / Vidéos)
  const [editingImageTarget, setEditingImageTarget] = useState(null);
  const [tempImageUrl, setTempImageUrl] = useState(null);
  const [tempMediaType, setTempMediaType] = useState('image'); // 'image' ou 'video'

  // Modales
  const [showSourceImageModal, setShowSourceImageModal] = useState(false);
  const [showGeminiModal, setShowGeminiModal] = useState(false);
  const [geminiPrompt, setGeminiPrompt] = useState('');
  const [geminiGeneratedText, setGeminiGeneratedText] = useState('');
  const [geminiLoading, setGeminiLoading] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

  // Recherche d'images/vidéos Pixabay
  const [showSearchImageModal, setShowSearchImageModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchType, setSearchType] = useState('photo'); // 'photo' ou 'video'
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [selectedMedia, setSelectedMedia] = useState(null); // { url, type }

  const GeminiLogo = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2L14.85 9.15L22 12L14.85 14.85L12 22L9.15 14.85L2 12L9.15 9.15L12 2Z" fill="currentColor"/>
      <path d="M19 3L19.71 4.71L21.42 5.42L19.71 6.13L19 7.84L18.29 6.13L16.58 5.42L18.29 4.71L19 3Z" fill="currentColor"/>
    </svg>
  );

  const [data, setData] = useState({
    title: { fr: "NEWSLETTER #", en: "NEWSLETTER #" },
    date: new Date().toISOString().split('T')[0],
    bannerImage: '/assets/covers/banner-news.webp',
    presidentImage: '/assets/mentions/president-mama.webp',
    edito: { fr: "Votre édito ici...", en: "Your editorial here..." },
    blocks: [
      {
        id: Date.now(),
        type: 'article',
        image: '',
        mediaType: 'image',
        text: { fr: 'Votre texte d\'article ici...', en: 'Your article text here...' },
        styles: { fontSize: '1.25rem', color: '#222222' }
      }
    ],
    tags: { fr: [], en: [] },
    pdfPath: '',
    isPublished: false
  });

  const execCommand = (command, value = null) => {
    document.execCommand(command, false, value);
  };

  useEffect(() => {
    if (id) fetchNewsletter();
  }, [id]);

  const fetchNewsletter = async () => {
    try {
      setLoading(true);
      const res = await newsletterService.getById(id);
      const nl = res.data;

      const editoBlockFr = nl.content?.fr?.find(b => b.type === 'edito');
      const articleBlocksFr = nl.content?.fr?.filter(b => b.type !== 'edito') || [];
      const articleBlocksEn = nl.content?.en?.filter(b => b.type !== 'edito') || [];

      const reconstructedBlocks = articleBlocksFr.map((b, idx) => ({
        id: b.id || idx,
        type: b.type,
        image: b.image,
        mediaType: b.mediaType || 'image',
        text: {
          fr: b.text,
          en: articleBlocksEn[idx]?.text || ""
        },
        styles: b.styles || { fontSize: '1.25rem', color: '#222222' }
      }));

      setData({
        title: nl.title || { fr: "NEWSLETTER #", en: "NEWSLETTER #" },
        date: nl.date ? new Date(nl.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
        bannerImage: nl.coverImage || '/assets/covers/banner-news.webp',
        presidentImage: editoBlockFr?.image || nl.presidentImage || '/assets/mentions/president-mama.webp',
        edito: {
          fr: editoBlockFr?.content || nl.edito?.fr || "",
          en: nl.content?.en?.find(b => b.type === 'edito')?.content || nl.edito?.en || ""
        },
        blocks: reconstructedBlocks.length > 0 ? reconstructedBlocks : data.blocks,
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

  const handleValidateLocalText = (target) => {
    let contentToCheck = "";
    const placeholders = ["votre édito ici...", "your editorial here...", "votre texte d'article ici...", "your article text here..."];

    if (target === 'edito') {
      contentToCheck = data.edito[currentLang]?.trim().toLowerCase() || "";
    } else {
      const block = data.blocks.find(b => b.id === target);
      contentToCheck = block?.text[currentLang]?.trim().toLowerCase() || "";
    }

    const isEmptyOrPlaceholder = !contentToCheck || placeholders.includes(contentToCheck);

    if (isEmptyOrPlaceholder) {
      const confirmSave = window.confirm("⚠️ Oups ! Le texte semble vide ou contient encore le texte par défaut. Es-tu sûr(e) de vouloir valider ?");
      if (!confirmSave) return;
    }

    if (target === 'edito') {
      setIsEditingEdito(false);
    } else {
      setEditingBlockId(null);
    }
    toast.success("Texte ajouté avec succès ! 🎉");
  };

  const handleCancelLocalText = (target) => {
    if (target === 'edito') {
      setIsEditingEdito(false);
    } else {
      setEditingBlockId(null);
    }
    toast.info("Saisie annulée ❌");
  };

  const openImageSourceModal = (target) => {
    setUploadTarget(target);
    setShowSourceImageModal(true);
  };

  const handleMediaSelectedTemp = async (mediaUrl, type = 'image', file = null) => {
    let finalUrl = mediaUrl;
    if (file) {
      try {
        const formData = new FormData();
        formData.append('image', file);
        const res = await newsletterService.uploadImage(formData);
        finalUrl = res.data.url;
      } catch (err) {
        finalUrl = URL.createObjectURL(file);
      }
    }

    setTempImageUrl(finalUrl);
    setTempMediaType(type);
    setEditingImageTarget(uploadTarget);
    setShowSourceImageModal(false);
    setShowSearchImageModal(false);
  };

  const handleValidateLocalImage = () => {
    if (!tempImageUrl) return;

    if (editingImageTarget === 'banner') {
      setData(prev => ({ ...prev, bannerImage: tempImageUrl }));
    } else if (editingImageTarget === 'president') {
      setData(prev => ({ ...prev, presidentImage: tempImageUrl }));
    } else {
      setData(prev => ({
        ...prev,
        blocks: prev.blocks.map(b => b.id === editingImageTarget ? { ...b, image: tempImageUrl, mediaType: tempMediaType } : b)
      }));
    }

    toast.success("Média ajouté avec succès ! 🖼️");
    setEditingImageTarget(null);
    setTempImageUrl(null);
  };

  const handleCancelLocalImage = () => {
    setEditingImageTarget(null);
    setTempImageUrl(null);
    toast.info("Saisie annulée ❌");
  };

  const handleDeleteImage = (target) => {
    if (target === 'banner') {
      setData(prev => ({ ...prev, bannerImage: '' }));
    } else if (target === 'president') {
      setData(prev => ({ ...prev, presidentImage: '' }));
    } else {
      setData(prev => ({
        ...prev,
        blocks: prev.blocks.map(b => b.id === target ? { ...b, image: '', mediaType: 'image' } : b)
      }));
    }
    setEditingImageTarget(null);
    setTempImageUrl(null);
    toast.info("Média supprimé 🗑️");
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
      mediaType: 'image',
      text: { fr: 'Votre texte d\'article ici...', en: 'Your article text here...' },
      styles: { fontSize: '1.25rem', color: '#222222' }
    };
    setData(prev => ({ ...prev, blocks: [...prev.blocks, newBlock] }));
  };

  const deleteBlock = (blockId) => {
    setData(prev => ({ ...prev, blocks: prev.blocks.filter(b => b.id !== blockId) }));
    if (editingBlockId === blockId) setEditingBlockId(null);
  };

  // API Pixabay dynamique (Photos + Vidéos) via le service dédié
const handleSearchPhotos = async () => {
  const query = searchQuery.trim();
  if (!query) {
    toast.warning("Veuillez saisir un mot-clé pour la recherche.");
    setSearchResults([]);
    setIsSearching(false);
    return;
  }

  setIsSearching(true);
  setSearchResults([]);
  setSelectedMedia(null);

  try {
    // On appelle notre service propre situé dans src/api/
    const results = await fetchPixabayMedia(query, searchType);

    if (results && results.length > 0) {
      setSearchResults(results);
      toast.success(`Recherche de ${searchType === 'video' ? 'vidéos' : 'photos'} pour "${query}" réussie ! 📸`);
    } else {
      toast.warning("Aucun résultat trouvé pour ce mot-clé.");
      setSearchResults([]);
    }
  } catch (err) {
    console.error(err);
    toast.error("Erreur lors de la recherche Pixabay.");
    setSearchResults([]);
  } finally {
    setIsSearching(false);
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
      } else {
        await newsletterService.create(formatted);
      }
      
      toast.success("Newsletter enregistrée avec succès ! 💾");

      setIsEditingEdito(false);
      setEditingBlockId(null);
      setEditingImageTarget(null);
    } catch (err) {
      toast.error("Erreur d'enregistrement : " + (err.message || "Serveur injoignable"));
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

      <input 
        type="file" 
        ref={fileInputRef} 
        style={{ display: 'none' }} 
        onChange={(e) => {
          const file = e.target.files[0];
          if (file) {
            const isVid = file.type.startsWith('video');
            handleMediaSelectedTemp(null, isVid ? 'video' : 'image', file);
          }
        }} 
        accept="image/*,video/*" 
      />

      {/* BARRE LATÉRALE GAUCHE */}
      {!isPreview && (
        <div className="editor-toolbar">
          <button className="v2-btn-icon" onClick={() => navigate('/admin')} title="Retour">
            <FontAwesomeIcon icon={faArrowLeft} />
          </button>

          <div className="toolbar-separator" style={{ height: '2px', width: '30px', background: '#eee' }}></div>

          <button className="v2-btn-icon" onClick={() => setIsPreview(!isPreview)} title="Aperçu de la newsletter">
            <FontAwesomeIcon icon={faEye} />
          </button>

          <button className="v2-btn-icon save-btn" onClick={handleSave} title="Enregistrer la newsletter (Sauvegarde BDD)">
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

          <button className="v2-btn-icon ai-text-btn" onClick={() => setShowGeminiModal(true)} title="Assistant Rédaction IA">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 14.899A7 7 0 0 1 15.707 5h1.793a5 5 0 0 1 0 10h-1.5M9 20l3-3 3 3"/>
            </svg>
          </button>
          <button className="v2-btn-icon photo-btn" onClick={() => {
            setShowSearchImageModal(true);
            setSearchQuery('');
            setSearchResults([]);
            setSelectedMedia(null);
          }} title="Rechercher une photo ou vidéo sur Internet">
            <FontAwesomeIcon icon={faGlobe} />
          </button>

          <button className="v2-btn-icon btn-mobile-tools" onClick={() => setShowMobileTools(!showMobileTools)} title="Outils de style">
            <FontAwesomeIcon icon={faPalette} />
          </button>
        </div>
      )}

      {/* BOUTON RETOUR PREVIEW */}
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
          <img src={editingImageTarget === 'banner' && tempImageUrl ? tempImageUrl : data.bannerImage} alt="Bannière" />
          {!isPreview && (
            <div style={{ position: 'absolute', top: '20px', right: '20px', zIndex: 10 }}>
              {editingImageTarget !== 'banner' ? (
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button className="mag-action-btn" onClick={() => openImageSourceModal('banner')} title="Changer la bannière">
                    <FontAwesomeIcon icon={faImage} /> Changer la bannière
                  </button>
                  {data.bannerImage && (
                    <button className="mag-action-btn" style={{ background: '#dc3545', color: '#fff' }} onClick={() => handleDeleteImage('banner')} title="Supprimer la bannière">
                      Supprimer 🗑️
                    </button>
                  )}
                </div>
              ) : (
                <div style={{ display: 'flex', gap: '6px', background: 'rgba(0,0,0,0.7)', padding: '6px 12px', borderRadius: '8px' }}>
                  <button className="mag-action-btn" style={{ background: '#007a5e', color: '#fff' }} onClick={handleValidateLocalImage}>
                    Enregistrer 💾
                  </button>
                  <button className="mag-action-btn" style={{ background: '#6c757d', color: '#fff' }} onClick={handleCancelLocalImage}>
                    Annuler ❌
                  </button>
                  <button className="mag-action-btn" style={{ background: '#dc3545', color: '#fff' }} onClick={() => handleDeleteImage('banner')}>
                    Supprimer 🗑️
                  </button>
                </div>
              )}
            </div>
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

          {/* SECTION EDITO */}
          <section className="mag-edito-box">
            <div className="mag-edito-left" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <h3 style={{ color: '#fcd116', marginBottom: '15px', textTransform: 'uppercase', fontSize: '0.95rem', fontWeight: '800', letterSpacing: '1px' }}>
                {currentLang === 'fr' ? "Le mot de la Présidente" : "A word from the President"}
              </h3>
              <div className="president-img-wrapper" title="Image de la Présidente">
                <img src={editingImageTarget === 'president' && tempImageUrl ? tempImageUrl : data.presidentImage} alt="Avatar" className="mag-edito-img" />
              </div>
              {!isPreview && (
                <div style={{ marginTop: '12px', display: 'flex', justifyContent: 'center', width: '100%' }}>
                  {editingImageTarget !== 'president' ? (
                    <div style={{ display: 'flex', gap: '6px' }}>
                      <button className="mag-action-btn" onClick={() => openImageSourceModal('president')} style={{ fontSize: '0.85rem', padding: '6px 12px' }}>
                        <FontAwesomeIcon icon={faImage} /> Changer l'image
                      </button>
                      {data.presidentImage && (
                        <button className="mag-action-btn" style={{ background: '#dc3545', color: '#fff', fontSize: '0.85rem', padding: '6px 10px' }} onClick={() => handleDeleteImage('president')}>
                          Supprimer 🗑️
                        </button>
                      )}
                    </div>
                  ) : (
                    <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap', justifyContent: 'center' }}>
                      <button className="mag-action-btn" style={{ background: '#007a5e', color: '#fff', fontSize: '0.8rem', padding: '5px 8px' }} onClick={handleValidateLocalImage}>
                        Enregistrer 💾
                      </button>
                      <button className="mag-action-btn" style={{ background: '#6c757d', color: '#fff', fontSize: '0.8rem', padding: '5px 8px' }} onClick={handleCancelLocalImage}>
                        Annuler ❌
                      </button>
                      <button className="mag-action-btn" style={{ background: '#dc3545', color: '#fff', fontSize: '0.8rem', padding: '5px 8px' }} onClick={() => handleDeleteImage('president')}>
                        Supprimer 🗑️
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="mag-edito-right">
              <div
                className="editable-area edito-text"
                contentEditable={!isPreview}
                suppressContentEditableWarning={true}
                onFocus={() => setIsEditingEdito(true)}
                onBlur={(e) => handleTextChange('edito', e.target.innerText)}
              >
                {data.edito[currentLang]}
              </div>
              {!isPreview && (
                <div style={{ marginTop: '20px', display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                  {!isEditingEdito ? (
                    <button 
                      className="mag-action-btn" 
                      style={{ background: 'rgba(255,255,255,0.2)', cursor: 'pointer' }} 
                      onClick={() => {
                        setIsEditingEdito(true);
                        const editoArea = document.querySelector('.edito-text');
                        if (editoArea) {
                          editoArea.focus();
                          const range = document.createRange();
                          const sel = window.getSelection();
                          range.selectNodeContents(editoArea);
                          range.collapse(false);
                          sel.removeAllRanges();
                          sel.addRange(range);
                        }
                      }} 
                      title="Ajouter du texte"
                    >
                      <FontAwesomeIcon icon={faPlusCircle} /> Ajouter du texte
                    </button>
                  ) : (
                    <>
                      <button 
                        className="mag-action-btn" 
                        style={{ background: '#007a5e', color: '#ffffff', border: '1px solid #fcd116', cursor: 'pointer' }} 
                        onClick={() => handleValidateLocalText('edito')}
                        title="Valider la saisie"
                      >
                        <FontAwesomeIcon icon={faSave} /> Enregistrer 💾
                      </button>
                      <button 
                        className="mag-action-btn" 
                        style={{ background: 'rgba(220, 53, 69, 0.8)', color: '#ffffff', cursor: 'pointer' }} 
                        onClick={() => handleCancelLocalText('edito')}
                        title="Annuler la saisie"
                      >
                        <FontAwesomeIcon icon={faTimes} /> Annuler ❌
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>
          </section>

          {/* BLOCS ARTICLES */}
          <div className="mag-articles-list">
            {data.blocks.map((block) => {
              const isEditingThisBlock = editingBlockId === block.id;
              const isEditingThisBlockImage = editingImageTarget === block.id;
              const activeMedia = isEditingThisBlockImage && tempImageUrl ? tempImageUrl : block.image;
              const currentType = isEditingThisBlockImage ? tempMediaType : (block.mediaType || 'image');

              return (
                <div key={block.id} className="mag-article-row">
                  <div className="mag-article-img-box" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: '280px' }}>
                    {activeMedia ? (
                      currentType === 'video' ? (
                        <video 
                          src={activeMedia} 
                          controls 
                          autoPlay 
                          muted 
                          loop 
                          style={{ width: '100%', maxHeight: '250px', objectFit: 'cover', borderRadius: '12px' }} 
                        />
                      ) : (
                        <img src={activeMedia} alt="Article" style={{ width: '100%', maxHeight: '250px', objectFit: 'cover', borderRadius: '12px' }} />
                      )
                    ) : (
                      <div className="add-img-placeholder" style={{ width: '100%', height: '180px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', border: '2px dashed rgba(255,255,255,0.2)', borderRadius: '12px' }}>
                        <FontAwesomeIcon icon={faImage} size="3x" color="rgba(255,255,255,0.3)" />
                        <span style={{ marginTop: '8px', color: 'rgba(255,255,255,0.5)' }}>Aucun média</span>
                      </div>
                    )}

                    {!isPreview && (
                      <div style={{ marginTop: '12px', width: '100%', display: 'flex', justifyContent: 'center' }}>
                        {editingImageTarget !== block.id ? (
                          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', justifyContent: 'center' }}>
                            <button className="mag-action-btn" onClick={() => openImageSourceModal(block.id)} style={{ whiteSpace: 'nowrap' }}>
                              <FontAwesomeIcon icon={block.mediaType === 'video' ? faVideo : faImage} /> {block.image ? "Changer le média" : "Ajouter média"}
                            </button>
                            {block.image && (
                              <button className="mag-action-btn" style={{ background: '#dc3545', color: '#fff' }} onClick={() => handleDeleteImage(block.id)} title="Supprimer">
                                Supprimer 🗑️
                              </button>
                            )}
                          </div>
                        ) : (
                          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', justifyContent: 'center' }}>
                            <button className="mag-action-btn" style={{ background: '#007a5e', color: '#fff', fontSize: '0.85rem', padding: '6px 10px' }} onClick={handleValidateLocalImage}>
                              Enregistrer 💾
                            </button>
                            <button className="mag-action-btn" style={{ background: '#6c757d', color: '#fff', fontSize: '0.85rem', padding: '6px 10px' }} onClick={handleCancelLocalImage}>
                              Annuler ❌
                            </button>
                            <button className="mag-action-btn" style={{ background: '#dc3545', color: '#fff', fontSize: '0.85rem', padding: '6px 10px' }} onClick={() => handleDeleteImage(block.id)}>
                              Supprimer 🗑️
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="mag-article-right" style={{ ...block.styles, color: block.styles?.color || '#222222' }}>
                    <div
                      id={`block-text-${block.id}`}
                      className="mag-article-text editable-area"
                      contentEditable={!isPreview}
                      suppressContentEditableWarning={true}
                      onFocus={() => setEditingBlockId(block.id)}
                      onBlur={(e) => handleTextChange('text', e.target.innerText, block.id)}
                      onClick={() => { setActiveBlockId(block.id); setShowMobileTools(true); }}
                      style={{ color: block.styles?.color || '#222222' }}
                    >
                      {block.text[currentLang]}
                    </div>
                    {!isPreview && (
                      <div className="block-actions" style={{ display: 'flex', gap: '10px', alignItems: 'center', marginTop: '15px' }}>
                        {!isEditingThisBlock ? (
                          <button 
                            className="mag-action-btn" 
                            style={{ background: 'rgba(0,0,0,0.1)', color: '#222', margin: 0, cursor: 'pointer' }} 
                            onClick={() => {
                              setEditingBlockId(block.id);
                              const blockTextDiv = document.getElementById(`block-text-${block.id}`);
                              if (blockTextDiv) {
                                blockTextDiv.focus();
                                const range = document.createRange();
                                const sel = window.getSelection();
                                range.selectNodeContents(blockTextDiv);
                                range.collapse(false);
                                sel.removeAllRanges();
                                sel.addRange(range);
                              }
                            }} 
                            title="Ajouter du texte"
                          >
                            <FontAwesomeIcon icon={faPlusCircle} /> Ajouter du texte
                          </button>
                        ) : (
                          <>
                            <button 
                              className="mag-action-btn" 
                              style={{ background: '#007a5e', color: '#ffffff', border: '1px solid #fcd116', margin: 0, cursor: 'pointer' }} 
                              onClick={() => handleValidateLocalText(block.id)}
                              title="Valider la saisie"
                            >
                              <FontAwesomeIcon icon={faSave} /> Enregistrer 💾
                            </button>
                            <button 
                              className="mag-action-btn" 
                              style={{ background: 'rgba(220, 53, 69, 0.8)', color: '#ffffff', margin: 0, cursor: 'pointer' }} 
                              onClick={() => handleCancelLocalText(block.id)}
                              title="Annuler la saisie"
                            >
                              <FontAwesomeIcon icon={faTimes} /> Annuler ❌
                            </button>
                          </>
                        )}
                        <button className="v2-btn-icon btn-delete" onClick={() => deleteBlock(block.id)} title="Supprimer ce bloc d'article">
                          <FontAwesomeIcon icon={faTrash} />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {!isPreview && (
            <div className="add-block-zone" onClick={addBlock} style={{ cursor: 'pointer', padding: '40px', border: '2px dashed rgba(0,0,0,0.2)', borderRadius: '20px', marginTop: '60px', textAlign: 'center', color: '#222' }} title="Ajouter un nouveau bloc article">
              <FontAwesomeIcon icon={faPlusCircle} size="3x" style={{ marginBottom: '15px' }} />
              <h3 style={{ margin: 0 }}>Ajouter un article (Média + Texte alterné)</h3>
            </div>
          )}
        </div>

        {/* FOOTER */}
        <footer className="mag-footer-v2">
          <img src="/assets/logos/logoMama.png" alt="Logo" className="mag-footer-logo" />
          <p>© {new Date().getFullYear()} Association Mama Esther - Tous droits réservés - {data.title[currentLang]}</p>
          <div className="mag-footer-btns">
            <button className="mag-btn-news" title="Contactez-nous">Contact</button>
            <button className="mag-btn-news" title="Voir les mentions légales">Mentions légales</button>
            <button className="mag-btn-news" style={{ opacity: 0.5 }} title="Se désinscrire de la newsletter">Désinscription</button>
          </div>
        </footer>
      </div>

      {/* BOITE A OUTILS (DROITE) */}
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
            <select className="tool-select-v2" defaultValue="4" onChange={(e) => {
              if (activeBlockId && activeBlockId !== 'edito') handleStyleChange(activeBlockId, 'fontSize', e.target.value);
              else execCommand('fontSize', e.target.value);
            }} title="Changer la taille de police">
              <option value="3">Petit</option>
              <option value="4">Normal</option>
              <option value="5">Grand</option>
              <option value="6">Très Grand</option>
            </select>
          </div>

          <div className="tool-group">
            <label><FontAwesomeIcon icon={faFillDrip} /> Couleur de police</label>
            <input type="color" className="tool-color-picker" onChange={(e) => {
               if (activeBlockId && activeBlockId !== 'edito') handleStyleChange(activeBlockId, 'color', e.target.value);
               else execCommand('foreColor', e.target.value);
            }} defaultValue="#222222" title="Changer la couleur du texte" />
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

      {/* MODALE SOURCE MEDIA (PC OU INTERNET) */}
      {showSourceImageModal && (
        <div className="gemini-modal-overlay">
          <div className="gemini-modal" style={{ maxWidth: '450px', textAlign: 'center' }}>
            <div className="gemini-modal-header">
              <h2>Source du média</h2>
              <button className="close-btn" onClick={() => setShowSourceImageModal(false)} title="Fermer">&times;</button>
            </div>
            <div className="gemini-modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '15px', padding: '20px 0' }}>
              <p style={{ margin: 0, fontWeight: '600', color: '#555' }}>D'où souhaitez-vous ajouter votre média ?</p>
              
              <button 
                className="v2-btn v2-btn-green"
                onClick={() => {
                  setShowSourceImageModal(false);
                  fileInputRef.current.click();
                }}
                style={{ padding: '14px', fontSize: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}
              >
                <FontAwesomeIcon icon={faDesktop} /> Depuis mon ordinateur (Photo / Vidéo)
              </button>

              <button 
                className="v2-btn v2-btn-blue"
                onClick={() => {
                  setShowSourceImageModal(false);
                  setShowSearchImageModal(true);
                  setSearchQuery('');
                  setSearchResults([]);
                  setSelectedMedia(null);
                }}
                style={{ padding: '14px', fontSize: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}
              >
                <FontAwesomeIcon icon={faGlobe} /> Rechercher sur Internet (Pixabay)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODALE GEMINI */}
      {showGeminiModal && (
        <div className="gemini-modal-overlay">
          <div className="gemini-modal">
            <div className="gemini-modal-header">
              <h2><GeminiLogo /> Gemini 1.5 Flash</h2>
              <button className="close-btn" onClick={() => {
                setShowGeminiModal(false);
                setGeminiPrompt('');
                setGeminiGeneratedText('');
                setCopySuccess(false);
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
                onClick={() => {
                  if (!geminiPrompt.trim()) return;
                  setGeminiLoading(true);
                  setTimeout(() => {
                    setGeminiGeneratedText(`Exemple de texte généré pour : "${geminiPrompt}"`);
                    setGeminiLoading(false);
                  }, 1000);
                }}
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

      {/* MODALE RECHERCHE PIXABAY (PHOTOS & VIDÉOS) */}
      {showSearchImageModal && (
        <div className="gemini-modal-overlay">
          <div className="gemini-modal" style={{ maxWidth: '700px' }}>
            <div className="gemini-modal-header">
              <h2>Recherche Médias Pixabay</h2>
              <button 
                className="close-btn" 
                onClick={() => {
                  setShowSearchImageModal(false);
                  setSearchQuery('');
                  setSearchResults([]);
                  setSelectedMedia(null);
                }} 
                title="Fermer"
              >
                &times;
              </button>
            </div>
            <div className="gemini-modal-body">
              <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
                <button 
                  className={`v2-btn ${searchType === 'photo' ? 'v2-btn-green' : ''}`}
                  onClick={() => setSearchType('photo')}
                  style={{ flex: 1, padding: '10px' }}
                >
                  <FontAwesomeIcon icon={faImage} /> Photos
                </button>
                <button 
                  className={`v2-btn ${searchType === 'video' ? 'v2-btn-green' : ''}`}
                  onClick={() => setSearchType('video')}
                  style={{ flex: 1, padding: '10px' }}
                >
                  <FontAwesomeIcon icon={faVideo} /> Vidéos
                </button>
              </div>

              <div className="search-input-group" style={{ display: 'flex', gap: '10px' }}>
                <input
                  type="text"
                  className="tool-select-v2"
                  placeholder={searchType === 'video' ? "Ex: enfants jouer, ecole, nature..." : "Ex: enfance, éducation, travaux, école..."}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => { if (e.key === 'Enter') handleSearchPhotos(); }}
                  title="Saisissez votre recherche"
                  style={{ flexGrow: 1 }}
                />
                <button
                  className="v2-btn v2-btn-green"
                  onClick={handleSearchPhotos}
                  disabled={isSearching || searchQuery.trim() === ''}
                  title="Lancer la recherche"
                >
                  {isSearching ? 'Recherche...' : 'Rechercher'}
                </button>
              </div>

              {isSearching && <HandSpinner fullPage={false} small={true} style={{ marginTop: '20px' }} />}

              {!isSearching && searchResults.length === 0 && (
                <p style={{ textAlign: 'center', marginTop: '20px', color: '#666' }}>
                  Tape un mot-clé en français (ex: *école*, *enfance*, *travaux*) puis clique sur RECHERCHER.
                </p>
              )}

              {!isSearching && searchResults.length > 0 && (
                <div className="image-gallery" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', marginTop: '20px' }}>
                  {searchResults.map((item, index) => (
                    <div
                      key={index}
                      className={`image-thumbnail ${selectedMedia?.url === item.url ? 'selected' : ''}`}
                      onClick={() => setSelectedMedia(item)}
                      title="Cliquer pour sélectionner"
                      style={{ 
                        cursor: 'pointer', 
                        border: selectedMedia?.url === item.url ? '3px solid #007a5e' : '1px solid #ccc', 
                        borderRadius: '8px', 
                        overflow: 'hidden',
                        position: 'relative',
                        boxShadow: selectedMedia?.url === item.url ? '0 0 10px rgba(0,122,94,0.5)' : 'none'
                      }}
                    >
                      {item.type === 'video' ? (
                        <video 
                          src={item.url} 
                          style={{ width: '100%', height: '120px', objectFit: 'cover' }} 
                          muted 
                          loop 
                          onMouseOver={(e) => e.target.play()} 
                          onMouseOut={(e) => e.target.pause()} 
                        />
                      ) : (
                        <img
                          src={item.preview}
                          alt={`Résultat ${index + 1}`}
                          style={{ width: '100%', height: '120px', objectFit: 'cover' }}
                        />
                      )}
                      {item.type === 'video' && (
                        <span style={{ position: 'absolute', bottom: '5px', right: '5px', background: 'rgba(0,0,0,0.7)', color: '#fff', padding: '2px 6px', borderRadius: '4px', fontSize: '0.7rem' }}>
                          🎥 Vidéo
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              )}

              <div className="gemini-modal-actions" style={{ marginTop: '30px', display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                <button
                  className="v2-btn v2-btn-green"
                  onClick={() => {
                    if (selectedMedia) {
                      handleMediaSelectedTemp(selectedMedia.url, selectedMedia.type);
                    } else {
                      toast.error("Veuillez sélectionner un média à insérer.");
                    }
                  }}
                  disabled={!selectedMedia}
                  title="Insérer le média sélectionné"
                >
                  Insérer le média
                </button>
                <button
                  className="v2-btn"
                  onClick={() => {
                    setShowSearchImageModal(false);
                    setSearchQuery('');
                    setSearchResults([]);
                    setSelectedMedia(null);
                  }}
                  title="Fermer"
                >
                  Fermer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminNewsletterEditor;