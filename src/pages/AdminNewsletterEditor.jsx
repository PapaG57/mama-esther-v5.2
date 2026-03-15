import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faArrowLeft, faSave, faEye, faEyeSlash, 
  faImage, faPlusCircle, faRobot, faTrash,
  faTextHeight, faPalette, faFillDrip
} from '@fortawesome/free-solid-svg-icons';
import { newsletterService } from '../api/services';
import { toast } from 'react-toastify';
import Navbar from '../components/Navbar';
import '../styles/AdminNewsletterEditor.css';

const AdminNewsletterEditor = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
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

  // État initial mis à jour selon tes demandes
  const [data, setData] = useState({
    title: { fr: 'Newsletter #3 - ', en: 'Newsletter #3 - ' },
    date: new Date().toISOString().split('T')[0],
    bannerImage: '/assets/covers/banner-news.webp',
    presidentImage: '/assets/mentions/president-mama.webp',
    edito: { 
      fr: "Votre texte d'édito ici...", 
      en: "Your editorial text here..." 
    },
    blocks: [
      { 
        id: Date.now(), 
        type: 'article', 
        image: '', 
        text: { 
          fr: 'Votre texte d\'article ici...', 
          en: 'Your article text here...' 
        },
        styles: { fontSize: '1.2rem', color: 'white' }
      }
    ],
    pdfPath: '',
    isPublished: false
  });

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
      styles: { fontSize: '1.2rem', color: 'white' }
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
      const imageUrl = `http://localhost:5000${res.data.url}`;
      
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
      handleTextChange('text', res.data.content, blockId);
    } catch (err) {
      toast.error("Erreur IA.");
    }
  };

  const handleSave = async () => {
    try {
      const formatted = {
        ...data,
        summary: { fr: data.edito.fr.substring(0, 150) + '...', en: data.edito.en.substring(0, 150) + '...' },
        coverImage: data.bannerImage,
        content: {
          fr: [{ type: 'edito', content: data.edito.fr, image: data.presidentImage }, ...data.blocks.map(b => ({ ...b, text: b.text.fr }))],
          en: [{ type: 'edito', content: data.edito.en, image: data.presidentImage }, ...data.blocks.map(b => ({ ...b, text: b.text.en }))],
        }
      };
      await newsletterService.create(formatted);
      toast.success("Newsletter publiée !");
      navigate('/admin');
    } catch (err) {
      toast.error("Erreur publication.");
    }
  };

  return (
    <div className={`newsletter-editor-layout ${isPreview ? 'preview-mode' : ''}`}>
      <Navbar hideDonate={true} />
      
      <input type="file" ref={fileInputRef} style={{ display: 'none' }} onChange={handleImageUpload} />

      {/* TOOLBAR */}
      <div className="editor-toolbar">
        <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
          <button className="v2-btn-icon" onClick={() => navigate('/admin')} title="Retour à l'administration"><FontAwesomeIcon icon={faArrowLeft} /></button>
          <h2 style={{ margin: 0, fontSize: '1.1rem' }}>Studio Newsletter v2.5 (Style ONG Moderne)</h2>
        </div>
        <div style={{ display: 'flex', gap: '15px' }}>
          <button className="v2-btn v2-btn-outline-green" onClick={() => setIsPreview(!isPreview)} title="Basculer entre édition et aperçu">
            <FontAwesomeIcon icon={isPreview ? faEyeSlash : faEye} /> {isPreview ? 'Éditer' : 'Aperçu'}
          </button>
          <button className="v2-btn v2-btn-green" onClick={handleSave} title="Enregistrer et publier la newsletter"><FontAwesomeIcon icon={faSave} /> Publier</button>
        </div>
      </div>

      {/* MAQUETTE CLONE NEWS3 */}
      <div className="editor-container">
        
        {/* BANNIÈRE HEADER */}
        <div className="mag-header-banner" onClick={() => { setUploadTarget('banner'); fileInputRef.current.click(); }} title="Cliquer pour changer l'image de couverture">
          <img src={data.bannerImage} alt="Bannière" />
          {!isPreview && <div className="img-overlay-btn"><FontAwesomeIcon icon={faImage} /> Changer la bannière</div>}
        </div>

        <div className="mag-content-padding">
          <h1 
            className="mag-main-title editable-area" 
            contentEditable={!isPreview}
            suppressContentEditableWarning={true}
            onBlur={(e) => handleTextChange('title', e.target.innerText)}
            title="Titre de la newsletter"
          >
            {data.title[currentLang]}
          </h1>

          {/* EDITO BLEU */}
          <section className="mag-edito-box">
            <div className="mag-edito-left">
              <h3 style={{ color: 'white', marginBottom: '15px', textTransform: 'uppercase', fontSize: '0.9rem' }}>Le mot de la présidente</h3>
              <div className="president-img-wrapper" onClick={() => { setUploadTarget('president'); fileInputRef.current.click(); }} title="Changer la photo de la présidente">
                <img 
                  src={data.presidentImage} 
                  alt="Présidente" 
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
                title="Texte de l'édito"
              >
                {data.edito[currentLang]}
              </div>
            </div>
          </section>

          {/* BLOCS ARTICLES */}
          <div className="mag-articles-list">
            {data.blocks.map((block) => (
              <div key={block.id} className="mag-article-row" onClick={() => setActiveBlockId(block.id)}>
                <div 
                  className="mag-article-img-box" 
                  onClick={() => { setUploadTarget(block.id); fileInputRef.current.click(); }}
                  title="Cliquer pour ajouter ou modifier l'image"
                >
                  {block.image ? (
                    <img src={block.image} alt="Article" />
                  ) : (
                    <div className="add-img-placeholder">
                      <FontAwesomeIcon icon={faImage} size="3x" color="rgba(255,255,255,0.3)" />
                      <span>Ajouter une image</span>
                    </div>
                  )}
                </div>
                <div className="mag-article-right" style={block.styles}>
                  <div 
                    className="mag-article-text editable-area"
                    contentEditable={!isPreview}
                    suppressContentEditableWarning={true}
                    onBlur={(e) => handleTextChange('text', e.target.innerText, block.id)}
                    title="Texte de l'article"
                  >
                    {block.text[currentLang]}
                  </div>
                  {!isPreview && (
                    <div className="block-actions">
                      <button className="ai-helper-btn" onClick={() => askAI(block.id)} title="Demander à Gemini de rédiger ou améliorer ce texte">
                        <GeminiLogo /> Aide Gemini
                      </button>
                      <button className="v2-btn-icon btn-delete" onClick={() => deleteBlock(block.id)} title="Supprimer cet article"><FontAwesomeIcon icon={faTrash} /></button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {!isPreview && (
            <div className="add-block-zone" onClick={addBlock} title="Ajouter un nouvel article">
              <FontAwesomeIcon icon={faPlusCircle} size="2x" />
              <div style={{ marginTop: '10px' }}>Ajouter un article (Image + Texte)</div>
            </div>
          )}
        </div>

        {/* FOOTER BLEU */}
        <footer className="mag-footer-v2">
          <img src="/assets/logos/logoMama.png" alt="Logo" className="mag-footer-logo" />
          <p>© {new Date().getFullYear()} - Association Mama Esther - Tous droits réservés</p>
          <div className="mag-footer-btns">
            <button className="mag-btn-news" title="Lien vers contact">Des questions ? Contactez-nous !</button>
            <button className="mag-btn-news" title="Lien vers mentions légales">Mentions légales</button>
            <button className="mag-btn-news" style={{ opacity: 0.7 }} title="Lien de désinscription">Désinscription</button>
          </div>
        </footer>

      </div>

      {/* BOITE A OUTILS (DROITE) */}
      {activeBlockId && !isPreview && (
        <div className="sidebar-toolbox">
          <div className="toolbox-header">
            <FontAwesomeIcon icon={faPalette} /> Outils de style
          </div>
          
          <div className="tool-group">
            <label><FontAwesomeIcon icon={faTextHeight} /> Taille du texte</label>
            <select className="tool-select-v2" onChange={(e) => handleStyleChange(activeBlockId, 'fontSize', e.target.value)}>
              <option value="1.1rem">Petit</option>
              <option value="1.25rem" selected>Normal</option>
              <option value="1.5rem">Grand</option>
              <option value="1.8rem">Titre</option>
            </select>
          </div>

          <div className="tool-group">
            <label><FontAwesomeIcon icon={faFillDrip} /> Couleur du texte</label>
            <input type="color" className="tool-color-picker" onChange={(e) => handleStyleChange(activeBlockId, 'color', e.target.value)} defaultValue="#ffffff" />
          </div>

          <button className="tool-btn-close" onClick={() => setActiveBlockId(null)}>Appliquer les changements</button>
        </div>
      )}
    </div>
  );
};

export default AdminNewsletterEditor;
