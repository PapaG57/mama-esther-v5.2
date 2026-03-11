import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faArrowLeft, faSave, faEye, faEyeSlash, 
  faGlobe, faImage, faPlusCircle, faCheck, faFileUpload 
} from '@fortawesome/free-solid-svg-icons';
import { newsletterService } from '../api/services';
import { toast } from 'react-toastify';
import Navbar from '../components/Navbar';
import '../styles/AdminNewsletterEditor.css';

const AdminNewsletterEditor = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [isPreview, setIsPreview] = useState(false);
  const [currentLang, setCurrentLang] = useState('fr'); // 'fr' ou 'en'
  const fileInputRef = useRef(null);

  // État de la newsletter
  const [data, setData] = useState({
    title: { fr: 'Titre de la Newsletter', en: 'Newsletter Title' },
    summary: { 
      fr: 'Cliquez ici pour rédiger le résumé de votre newsletter en français...', 
      en: 'Click here to write your newsletter summary in English...' 
    },
    date: new Date().toISOString().split('T')[0],
    tags: { fr: 'chantier, travaux', en: 'construction, works' },
    coverImage: '/assets/covers/banner.webp',
    pdfPath: '',
    isPublished: false
  });

  const handleTextChange = (field, value) => {
    setData(prev => ({
      ...prev,
      [field]: { ...prev[field], [currentLang]: value }
    }));
  };

  const handleSimpleChange = (field, value) => {
    setData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    try {
      // Formater les tags pour le backend (string -> array)
      const formattedData = {
        ...data,
        tags: {
          fr: typeof data.tags.fr === 'string' ? data.tags.fr.split(',').map(tag => tag.trim()) : data.tags.fr,
          en: typeof data.tags.en === 'string' ? data.tags.en.split(',').map(tag => tag.trim()) : data.tags.en
        }
      };

      await newsletterService.create(formattedData);
      toast.success("Newsletter publiée avec succès !");
      navigate('/admin');
    } catch (err) {
      toast.error("Erreur lors de la sauvegarde.");
      console.error(err);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);

    try {
      toast.info("Envoi de l'image...");
      const res = await newsletterService.uploadImage(formData);
      // L'URL renvoyée est relative, on ajoute la base du backend
      const imageUrl = `http://localhost:5000${res.data.url}`;
      handleSimpleChange('coverImage', imageUrl);
      toast.success("Image mise à jour !");
    } catch (err) {
      toast.error("Échec de l'upload de l'image.");
    }
  };

  const triggerFilePicker = () => {
    if (fileInputRef.current) fileInputRef.current.click();
  };

  return (
    <div className={`newsletter-editor-layout ${isPreview ? 'preview-mode' : ''}`}>
      <Navbar hideDonate={true} />

      {/* Input File invisible pour l'explorateur Windows */}
      <input 
        type="file" 
        ref={fileInputRef} 
        style={{ display: 'none' }} 
        accept="image/*"
        onChange={handleImageUpload}
      />

      {/* Barre d'outils du Studio */}
      <div className="editor-toolbar">
        <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
          <button className="v2-btn-icon" onClick={() => navigate('/admin')} style={{ color: 'var(--color-dark)' }}>
            <FontAwesomeIcon icon={faArrowLeft} />
          </button>
          <h2 style={{ margin: 0, fontSize: '1.2rem' }}>Studio Newsletter</h2>
        </div>

        <div style={{ display: 'flex', gap: '15px' }}>
          <div style={{ display: 'flex', background: '#eee', borderRadius: '30px', padding: '5px' }}>
            <button 
              className={`lang-toggle-btn ${currentLang === 'fr' ? 'active' : ''}`}
              onClick={() => setCurrentLang('fr')}
            >
              🇫🇷 FR
            </button>
            <button 
              className={`lang-toggle-btn ${currentLang === 'en' ? 'active' : ''}`}
              onClick={() => setCurrentLang('en')}
            >
              🇬🇧 EN
            </button>
          </div>

          <button className="v2-btn v2-btn-outline-green" onClick={() => setIsPreview(!isPreview)} style={{ padding: '10px 20px' }}>
            <FontAwesomeIcon icon={isPreview ? faEyeSlash : faEye} style={{ marginRight: '10px' }} />
            {isPreview ? 'Éditer' : 'Aperçu'}
          </button>

          <button className="v2-btn v2-btn-green" onClick={handleSave} style={{ padding: '10px 20px' }}>
            <FontAwesomeIcon icon={faSave} style={{ marginRight: '10px' }} />
            Publier
          </button>
        </div>
      </div>

      {/* La Maquette */}
      <div className="editor-container">
        
        {/* Entête Magazine */}
        <div className="mag-preview-header">
          <div className="mag-preview-title">Mama Esther</div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '0.8rem', opacity: 0.8 }}>EDITION OFFICIELLE</div>
            <input 
              type="date" 
              value={data.date} 
              onChange={(e) => handleSimpleChange('date', e.target.value)}
              style={{ background: 'none', border: 'none', color: 'white', fontWeight: 'bold', textAlign: 'right', outline: 'none' }}
            />
          </div>
        </div>

        {/* Image de Couverture - Clique pour ouvrir l'explorateur Windows */}
        <div 
          className="mag-preview-cover" 
          style={{ backgroundImage: `url(${data.coverImage})` }}
          onClick={!isPreview ? triggerFilePicker : undefined}
        >
          {!data.coverImage && <FontAwesomeIcon icon={faImage} size="3x" style={{ opacity: 0.2 }} />}
          {!isPreview && (
            <div className="upload-overlay" style={{ position: 'absolute', bottom: '20px', right: '20px', background: 'white', padding: '10px 20px', borderRadius: '30px', boxShadow: '0 4px 10px rgba(0,0,0,0.2)', fontSize: '0.8rem', color: 'var(--color-green)', fontWeight: 'bold' }}>
              <FontAwesomeIcon icon={faFileUpload} style={{ marginRight: '10px' }} />
              Changer l'image (Windows)
            </div>
          )}
        </div>

        {/* Corps de la Newsletter */}
        <div className="mag-preview-body">
          <h1 
            className="editable-text" 
            contentEditable={!isPreview}
            suppressContentEditableWarning={true}
            onBlur={(e) => handleTextChange('title', e.target.innerText)}
            style={{ fontSize: '2.5rem', marginBottom: '20px', fontWeight: '800' }}
          >
            {data.title[currentLang]}
          </h1>

          <div 
            className="mag-preview-summary editable-text"
            contentEditable={!isPreview}
            suppressContentEditableWarning={true}
            onBlur={(e) => handleTextChange('summary', e.target.innerText)}
          >
            {data.summary[currentLang]}
          </div>

          <div style={{ marginTop: '40px', borderTop: '1px solid #eee', paddingTop: '20px' }}>
            <div style={{ fontWeight: 'bold', color: 'var(--color-green)', marginBottom: '10px' }}>
              <FontAwesomeIcon icon={faGlobe} style={{ marginRight: '10px' }} />
              TAGS & METADONNÉES
            </div>
            <div 
              className="editable-text"
              contentEditable={!isPreview}
              suppressContentEditableWarning={true}
              onBlur={(e) => handleTextChange('tags', e.target.innerText)}
              style={{ fontSize: '0.9rem', color: '#666' }}
            >
              {data.tags[currentLang]}
            </div>
          </div>

          {!isPreview && (
            <div style={{ marginTop: '30px', padding: '20px', background: '#f8f9fa', borderRadius: '12px', border: '1px solid #ddd' }}>
              <div style={{ fontWeight: 'bold', marginBottom: '10px' }}>Lien du PDF</div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <input 
                  type="text" 
                  className="admin-v2-input" 
                  placeholder="/assets/newsletter-pdf/pdf/..." 
                  value={data.pdfPath}
                  onChange={(e) => handleSimpleChange('pdfPath', e.target.value)}
                  style={{ margin: 0, fontSize: '0.9rem' }}
                />
              </div>
            </div>
          )}

          {/* Footer de la maquette */}
          <div style={{ marginTop: '60px', textAlign: 'center', opacity: 0.3, fontSize: '0.8rem' }}>
            © {new Date().getFullYear()} ASSOCIATION MAMA ESTHER - TOUS DROITS RÉSERVÉS
          </div>
        </div>

      </div>

      {/* Message d'aide flottant */}
      {!isPreview && (
        <div style={{ position: 'fixed', bottom: '30px', left: '30px', background: 'var(--color-dark)', color: 'white', padding: '15px 25px', borderRadius: '40px', boxShadow: '0 10px 30px rgba(0,0,0,0.3)', zIndex: 2000 }}>
          <FontAwesomeIcon icon={faPlusCircle} style={{ marginRight: '10px', color: 'var(--color-yellow)' }} />
          Astuce : Cliquez sur l'image ou les textes pour modifier !
        </div>
      )}
    </div>
  );
};

export default AdminNewsletterEditor;
