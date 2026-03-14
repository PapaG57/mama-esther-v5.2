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
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [isPreview, setIsPreview] = useState(false);
  const [currentLang, setCurrentLang] = useState('fr');
  const [activeBlockId, setActiveBlockId] = useState(null);
  const fileInputRef = useRef(null);
  const [uploadTarget, setUploadTarget] = useState(null); // 'banner', 'president', or {blockId}

  // État initial basé sur la trame News3
  const [data, setData] = useState({
    title: { fr: 'Newsletter #... - MOIS ANNÉE', en: 'Newsletter #... - MONTH YEAR' },
    date: new Date().toISOString().split('T')[0],
    bannerImage: '/assets/covers/banner.webp',
    presidentImage: '/assets/mentions/president-mama.webp',
    edito: { 
      fr: "Bonjour et bienvenue à tous les lecteurs de cette newsletter !...", 
      en: "Hello and welcome to all readers of this newsletter!..." 
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
        blocks: prev.blocks.map(b => b.id === blockId ? { ...b, [field]: { ...b[field], [currentLang]: value } } : b)
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
      text: { fr: 'Nouveau texte d\'article...', en: 'New article text...' },
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
          <button className="v2-btn-icon" onClick={() => navigate('/admin')}><FontAwesomeIcon icon={faArrowLeft} /></button>
          <h2 style={{ margin: 0, fontSize: '1.1rem' }}>Studio Newsletter v2.1 (Style News3)</h2>
        </div>
        <div style={{ display: 'flex', gap: '15px' }}>
          <div style={{ display: 'flex', background: '#eee', borderRadius: '30px', padding: '5px' }}>
            <button className={`lang-toggle-btn ${currentLang === 'fr' ? 'active' : ''}`} onClick={() => setCurrentLang('fr')}>🇫🇷 FR</button>
            <button className={`lang-toggle-btn ${currentLang === 'en' ? 'active' : ''}`} onClick={() => setCurrentLang('en')}>🇬🇧 EN</button>
          </div>
          <button className="v2-btn v2-btn-outline-green" onClick={() => setIsPreview(!isPreview)}>
            <FontAwesomeIcon icon={isPreview ? faEyeSlash : faEye} /> {isPreview ? 'Éditer' : 'Aperçu'}
          </button>
          <button className="v2-btn v2-btn-green" onClick={handleSave}><FontAwesomeIcon icon={faSave} /> Publier</button>
        </div>
      </div>

      {/* MAQUETTE CLONE NEWS3 */}
      <div className="editor-container">
        
        {/* BANNIÈRE HEADER */}
        <div className="mag-header-banner" onClick={() => { setUploadTarget('banner'); fileInputRef.current.click(); }}>
          <img src={data.bannerImage} alt="Bannière" />
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
              <h3 style={{ color: 'white', marginBottom: '15px', textTransform: 'uppercase', fontSize: '0.9rem' }}>Le mot de la présidente</h3>
              <img 
                src={data.presidentImage} 
                alt="Présidente" 
                className="mag-edito-img" 
                onClick={() => { setUploadTarget('president'); fileInputRef.current.click(); }}
                style={{ cursor: 'pointer' }}
              />
            </div>
            <div className="mag-edito-right">
              <div 
                className="editable-area" 
                contentEditable={!isPreview}
                suppressContentEditableWarning={true}
                onBlur={(e) => handleTextChange('edito', e.target.innerText)}
              >
                {data.edito[currentLang]}
              </div>
            </div>
          </section>

          {/* BLOCS ARTICLES */}
          {data.blocks.map((block) => (
            <div key={block.id} className="mag-article-row" onClick={() => setActiveBlockId(block.id)}>
              <div 
                className="mag-article-img-box" 
                onClick={() => { setUploadTarget(block.id); fileInputRef.current.click(); }}
              >
                {block.image ? <img src={block.image} alt="Article" /> : <FontAwesomeIcon icon={faImage} size="3x" color="rgba(255,255,255,0.3)" />}
              </div>
              <div className="mag-article-right" style={block.styles}>
                <div 
                  className="mag-article-text editable-area"
                  contentEditable={!isPreview}
                  suppressContentEditableWarning={true}
                  onBlur={(e) => handleTextChange('text', e.target.innerText, block.id)}
                >
                  {block.text[currentLang]}
                </div>
                {!isPreview && (
                  <div style={{ display: 'flex', gap: '10px', marginTop: '15px' }}>
                    <button className="ai-helper-btn" onClick={() => askAI(block.id)}><FontAwesomeIcon icon={faRobot} /> IA</button>
                    <button className="v2-btn-icon" style={{ color: '#ff4d4d' }} onClick={() => deleteBlock(block.id)}><FontAwesomeIcon icon={faTrash} /></button>
                  </div>
                )}
              </div>
            </div>
          ))}

          {!isPreview && (
            <div className="add-block-zone" onClick={addBlock}>
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
            <button className="mag-btn-news">Des questions ? Contactez-nous !</button>
            <button className="mag-btn-news">Mentions légales</button>
            <button className="mag-btn-news" style={{ opacity: 0.7 }}>Désinscription</button>
          </div>
        </footer>

      </div>

      {/* STYLE BAR */}
      {activeBlockId && !isPreview && (
        <div className="floating-style-bar">
          <FontAwesomeIcon icon={faTextHeight} />
          <select className="tool-select" onChange={(e) => handleStyleChange(activeBlockId, 'fontSize', e.target.value)}>
            <option value="1.2rem">Normal</option>
            <option value="1.4rem">Grand</option>
            <option value="1.6rem">Titre</option>
          </select>
          <FontAwesomeIcon icon={faPalette} />
          <input type="color" onChange={(e) => handleStyleChange(activeBlockId, 'color', e.target.value)} />
          <button className="tool-btn" onClick={() => setActiveBlockId(null)} style={{ color: '#fcd116' }}>OK</button>
        </div>
      )}
    </div>
  );
};

export default AdminNewsletterEditor;
