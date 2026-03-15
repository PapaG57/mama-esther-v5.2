import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faArrowLeft, faSave, faEye, faEyeSlash, 
  faImage, faPlusCircle, faRobot, faTrash,
  faTextHeight, faPalette, faFillDrip, faCheckCircle
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
  const fileInputRef = useRef(null);
  const [uploadTarget, setUploadTarget] = useState(null);

  // SVG Gemini Logo
  const GeminiLogo = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ marginRight: '8px' }}>
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
        pdfPath: nl.pdfPath || "",
        isPublished: nl.isPublished
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

  const askAI = async (blockId) => {
    const block = data.blocks.find(b => b.id === blockId);
    const prompt = `Rédige un article pour l'association Mama Esther sur le sujet : ${block.text[currentLang]}. Ton : humain, sérieux, ONG.`;
    try {
      toast.info("L'IA rédige...");
      const res = await newsletterService.aiGenerate(prompt, 'draft');
      // Le simulateur backend renvoie un texte avec un préfixe, on pourrait le nettoyer
      const content = res.data.content.replace(/\[Génération IA pour draft\] : .* \.\.\. /, '');
      handleTextChange('text', content || res.data.content, blockId);
    } catch (err) {
      toast.error("Erreur IA.");
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
        toast.success("Newsletter n°3 publiée avec succès !");
      }
      navigate('/admin');
    } catch (err) {
      toast.error("Erreur lors de l'enregistrement : " + (err.message || "Serveur injoignable"));
    }
  };

  if (loading) return <HandSpinner />;

  return (
    <div className={`newsletter-editor-layout ${isPreview ? 'preview-mode' : ''}`}>
      <Navbar hideDonate={true} />
      
      <input type="file" ref={fileInputRef} style={{ display: 'none' }} onChange={handleImageUpload} />

      {/* BARRE LATÉRALE GAUCHE (ACTIONS PRINCIPALES) */}
      {!isPreview && (
        <div className="editor-toolbar">
          <button className="v2-btn-icon" onClick={() => navigate('/admin')} title="Retour à l'administration">
            <FontAwesomeIcon icon={faArrowLeft} />
          </button>
          
          <div style={{ height: '2px', width: '30px', background: '#eee' }}></div>
          
          <button className="v2-btn-icon" onClick={() => setIsPreview(!isPreview)} title="Aperçu">
            <FontAwesomeIcon icon={faEye} />
          </button>
          
          <button className="v2-btn-icon" style={{ color: 'var(--color-green)' }} onClick={handleSave} title="Enregistrer">
            <FontAwesomeIcon icon={faSave} />
          </button>

          <div style={{ height: '2px', width: '30px', background: '#eee' }}></div>

          <button className="v2-btn-icon" onClick={addBlock} title="Ajouter un article">
            <FontAwesomeIcon icon={faPlusCircle} />
          </button>
        </div>
      )}

      {/* BOUTON ÉDITION (SI PREVIEW) */}
      {isPreview && (
        <button 
          className="v2-btn v2-btn-green" 
          style={{ position: 'fixed', top: '110px', left: '20px', zIndex: 3000 }}
          onClick={() => setIsPreview(false)}
        >
          <FontAwesomeIcon icon={faEyeSlash} /> Retour à l'édition
        </button>
      )}

      <div className="editor-container">
        
        {/* BANNIÈRE HEADER */}
        <div className="mag-header-banner" title="Image de couverture">
          <img src={data.bannerImage} alt="Bannière" />
          {!isPreview && (
            <button className="mag-action-btn" onClick={() => { setUploadTarget('banner'); fileInputRef.current.click(); }}>
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

          {/* EDITO BLEU */}
          <section className="mag-edito-box">
            <div className="mag-edito-left">
              <h3 style={{ color: 'white', marginBottom: '15px', textTransform: 'uppercase', fontSize: '0.9rem' }}>
                {currentLang === 'fr' ? "Le mot de la Présidente" : "A word from the President"}
              </h3>
              <div className="president-img-wrapper" onClick={() => { setUploadTarget('president'); fileInputRef.current.click(); }} title="Changer l'image">
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
                 <button className="mag-action-btn" style={{ marginTop: '20px', background: 'rgba(255,255,255,0.2)' }} onClick={() => execCommand('insertText', ' ')}>
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
                    <button className="mag-action-btn" onClick={() => { setUploadTarget(block.id); fileInputRef.current.click(); }}>
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
                    onClick={() => setActiveBlockId(block.id)}
                  >
                    {block.text[currentLang]}
                  </div>
                  {!isPreview && (
                    <div className="block-actions">
                      <button className="mag-action-btn" style={{ background: 'rgba(255,255,255,0.1)', margin: 0 }} onClick={() => execCommand('insertText', ' ')}>
                        <FontAwesomeIcon icon={faPlusCircle} /> Ajouter du texte
                      </button>
                      <button className="ai-helper-btn" onClick={() => askAI(block.id)}>
                        <GeminiLogo /> Aide Gemini
                      </button>
                      <button className="v2-btn-icon btn-delete" onClick={() => deleteBlock(block.id)}><FontAwesomeIcon icon={faTrash} /></button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {!isPreview && (
            <div className="add-block-zone" onClick={addBlock} style={{ cursor: 'pointer', padding: '40px', border: '2px dashed rgba(255,255,255,0.3)', borderRadius: '20px', marginTop: '60px', textAlign: 'center' }}>
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
            <button className="mag-btn-news">Contact</button>
            <button className="mag-btn-news">Mentions légales</button>
            <button className="mag-btn-news" style={{ opacity: 0.5 }}>Désinscription</button>
          </div>
        </footer>

      </div>

      {/* BOITE A OUTILS (DROITE) - TOUJOURS VISIBLE SI PAS PREVIEW */}
      {!isPreview && (
        <div className="sidebar-toolbox">
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
            }}>
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
            }} defaultValue="#ffffff" />
          </div>

          <div className="tool-group">
            <label>Polices (Style Word)</label>
            <select className="tool-select-v2" onChange={(e) => execCommand('fontName', e.target.value)}>
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

          <button className="tool-btn-close" onClick={() => setActiveBlockId(null)}>Prêt !</button>
        </div>
      )}
    </div>
  );
};

export default AdminNewsletterEditor;
