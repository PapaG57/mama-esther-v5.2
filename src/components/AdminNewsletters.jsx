import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faPlus, faEdit, faTrash, faRobot, faPaperPlane, 
  faLanguage, faSave, faTimes, faCheckCircle, faGlobe 
} from '@fortawesome/free-solid-svg-icons';
import { newsletterService } from '../api/services';
import { toast } from 'react-toastify';

const AdminNewsletters = () => {
  const { t, i18n } = useTranslation();
  const [newsletters, setNewsletters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState(null);

  // État du formulaire
  const [formData, setFormData] = useState({
    title: { fr: '', en: '' },
    summary: { fr: '', en: '' },
    date: new Date().toISOString().split('T')[0],
    tags: { fr: '', en: '' },
    coverImage: '',
    isPublished: false,
    content: { fr: [], en: [] } // Pour une évolution future vers des blocs
  });

  // État de l'IA
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiLoading, setAiLoading] = useState(false);

  useEffect(() => {
    fetchNewsletters();
  }, []);

  const fetchNewsletters = async () => {
    try {
      setLoading(true);
      const res = await newsletterService.getAll();
      setNewsletters(res.data);
    } catch (err) {
      console.error(err);
      toast.error(t('admin.newsletters.messages.error'));
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e, lang = null, field = null) => {
    const { name, value, type, checked } = e.target;
    
    if (lang && field) {
      setFormData(prev => ({
        ...prev,
        [field]: { ...prev[field], [lang]: value }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Préparation des tags (string to array)
      const formattedData = {
        ...formData,
        tags: {
          fr: formData.tags.fr.split(',').map(tag => tag.trim()),
          en: formData.tags.en.split(',').map(tag => tag.trim())
        }
      };

      if (editingId) {
        // Logique de mise à jour à implémenter si besoin
        toast.info("Mise à jour non encore implémentée sur le backend complet");
      } else {
        await newsletterService.create(formattedData);
        toast.success(t('admin.newsletters.messages.createSuccess'));
      }
      
      resetForm();
      fetchNewsletters();
    } catch (err) {
      toast.error(t('admin.newsletters.messages.error'));
    }
  };

  const resetForm = () => {
    setFormData({
      title: { fr: '', en: '' },
      summary: { fr: '', en: '' },
      date: new Date().toISOString().split('T')[0],
      tags: { fr: '', en: '' },
      coverImage: '',
      isPublished: false,
      content: { fr: [], en: [] }
    });
    setIsAdding(false);
    setEditingId(null);
  };

  const handleAiAction = async (action) => {
    if (!aiPrompt) return toast.warn(t('admin.newsletters.ai.promptPlaceholder'));
    
    setAiLoading(true);
    try {
      const res = await newsletterService.aiGenerate(aiPrompt, action);
      const generatedContent = res.data.content;
      
      // Simulation d'injection dans le formulaire selon l'action
      if (action === 'draft') {
        setFormData(prev => ({
          ...prev,
          summary: { ...prev.summary, fr: generatedContent }
        }));
      } else if (action === 'translate') {
        setFormData(prev => ({
          ...prev,
          summary: { ...prev.summary, en: `[Translated] ${prev.summary.fr}` }
        }));
      }
      
      toast.success(t('admin.newsletters.messages.createSuccess')); // Réutiliser un message générique de succès
    } catch (err) {
      toast.error(t('admin.newsletters.messages.aiError'));
    } finally {
      setAiLoading(false);
    }
  };

  return (
    <div className="admin-v2-list-section">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <h2>{t('admin.newsletters.title')}</h2>
        {!isAdding && (
          <button className="v2-btn v2-btn-primary" onClick={() => setIsAdding(true)}>
            <FontAwesomeIcon icon={faPlus} style={{ marginRight: '10px' }} />
            {t('admin.newsletters.createBtn')}
          </button>
        )}
      </div>

      {isAdding ? (
        <form onSubmit={handleSubmit} className="admin-v2-form">
          <div className="admin-v2-grid" style={{ marginBottom: '20px' }}>
            {/* Colonne FR */}
            <div className="admin-v2-card" style={{ padding: '25px', border: '1px solid var(--color-green)' }}>
              <h3 style={{ color: 'var(--color-green)', marginBottom: '15px' }}>
                <FontAwesomeIcon icon={faGlobe} style={{ marginRight: '10px' }} />
                Français
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <input 
                  className="admin-v2-input" 
                  placeholder={t('admin.newsletters.form.title')} 
                  value={formData.title.fr} 
                  onChange={(e) => handleInputChange(e, 'fr', 'title')} 
                  required 
                />
                <textarea 
                  className="admin-v2-input" 
                  placeholder={t('admin.newsletters.form.summary')} 
                  value={formData.summary.fr} 
                  onChange={(e) => handleInputChange(e, 'fr', 'summary')} 
                  style={{ minHeight: '100px' }}
                  required 
                />
                <input 
                  className="admin-v2-input" 
                  placeholder={t('admin.newsletters.form.tags')} 
                  value={formData.tags.fr} 
                  onChange={(e) => handleInputChange(e, 'fr', 'tags')} 
                />
              </div>
            </div>

            {/* Colonne EN */}
            <div className="admin-v2-card" style={{ padding: '25px', border: '1px solid var(--color-yellow)' }}>
              <h3 style={{ color: 'var(--color-yellow)', marginBottom: '15px' }}>
                <FontAwesomeIcon icon={faLanguage} style={{ marginRight: '10px' }} />
                English
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <input 
                  className="admin-v2-input" 
                  placeholder={t('admin.newsletters.form.title')} 
                  value={formData.title.en} 
                  onChange={(e) => handleInputChange(e, 'en', 'title')} 
                  required 
                />
                <textarea 
                  className="admin-v2-input" 
                  placeholder={t('admin.newsletters.form.summary')} 
                  value={formData.summary.en} 
                  onChange={(e) => handleInputChange(e, 'en', 'summary')} 
                  style={{ minHeight: '100px' }}
                  required 
                />
                <input 
                  className="admin-v2-input" 
                  placeholder={t('admin.newsletters.form.tags')} 
                  value={formData.tags.en} 
                  onChange={(e) => handleInputChange(e, 'en', 'tags')} 
                />
              </div>
            </div>
          </div>

          {/* Assistant IA */}
          <div className="admin-v2-card" style={{ marginBottom: '30px', background: '#f8f9ff', border: '2px dashed var(--color-green)' }}>
            <h3 style={{ color: 'var(--color-dark)', fontSize: '1.2rem', marginBottom: '15px' }}>
              <FontAwesomeIcon icon={faRobot} style={{ marginRight: '10px', color: 'var(--color-green)' }} />
              {t('admin.newsletters.ai.title')}
            </h3>
            <div style={{ display: 'flex', gap: '15px' }}>
              <input 
                className="admin-v2-input" 
                placeholder={t('admin.newsletters.ai.promptPlaceholder')} 
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
              />
              <div style={{ display: 'flex', gap: '10px' }}>
                <button type="button" className="v2-btn v2-btn-outline-green" onClick={() => handleAiAction('draft')} disabled={aiLoading}>
                  {aiLoading ? '...' : t('admin.newsletters.ai.actionDraft')}
                </button>
                <button type="button" className="v2-btn v2-btn-outline-green" onClick={() => handleAiAction('translate')} disabled={aiLoading}>
                  {aiLoading ? '...' : t('admin.newsletters.ai.actionTranslate')}
                </button>
              </div>
            </div>
            <p style={{ fontSize: '0.8rem', marginTop: '10px', opacity: 0.7 }}>{t('admin.newsletters.ai.helpText')}</p>
          </div>

          {/* Paramètres Généraux */}
          <div className="admin-v2-card" style={{ padding: '25px', marginBottom: '30px' }}>
            <div className="admin-v2-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', margin: 0 }}>
              <div>
                <label style={{ display: 'block', marginBottom: '10px', fontWeight: 'bold' }}>{t('admin.newsletters.form.date')}</label>
                <input 
                  type="date" 
                  name="date"
                  className="admin-v2-input" 
                  value={formData.date} 
                  onChange={handleInputChange} 
                  required 
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '10px', fontWeight: 'bold' }}>{t('admin.newsletters.form.coverImage')}</label>
                <input 
                  name="coverImage"
                  className="admin-v2-input" 
                  placeholder="URL de l'image (ex: /assets/covers/...)" 
                  value={formData.coverImage} 
                  onChange={handleInputChange} 
                  required 
                />
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px', paddingTop: '30px' }}>
                <input 
                  type="checkbox" 
                  name="isPublished"
                  id="isPublished"
                  checked={formData.isPublished} 
                  onChange={handleInputChange}
                  style={{ width: '25px', height: '25px' }}
                />
                <label htmlFor="isPublished" style={{ fontWeight: 'bold', cursor: 'pointer' }}>{t('admin.newsletters.form.isPublished')}</label>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '20px', justifyContent: 'center' }}>
            <button type="button" className="v2-btn v2-btn-outline-green" onClick={resetForm}>
              <FontAwesomeIcon icon={faTimes} style={{ marginRight: '10px' }} />
              {t('admin.newsletters.form.cancel')}
            </button>
            <button type="submit" className="v2-btn v2-btn-primary">
              <FontAwesomeIcon icon={faSave} style={{ marginRight: '10px' }} />
              {editingId ? t('admin.newsletters.form.submitUpdate') : t('admin.newsletters.form.submitCreate')}
            </button>
          </div>
        </form>
      ) : (
        <div className="admin-v2-table-wrapper">
          <table className="admin-v2-table">
            <thead>
              <tr>
                <th>N°</th>
                <th>{t('admin.newsletters.form.title')}</th>
                <th>{t('admin.newsletters.form.date')}</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="5" style={{ textAlign: 'center', padding: '40px' }}>{t('admin.newsletters.messages.loading')}</td></tr>
              ) : newsletters.length === 0 ? (
                <tr><td colSpan="5" style={{ textAlign: 'center', padding: '40px' }}>{t('admin.newsletters.noNewsletters')}</td></tr>
              ) : (
                newsletters.map((news) => (
                  <tr key={news._id}>
                    <td style={{ fontWeight: 'bold' }}>{news.newsletterNumber}</td>
                    <td>{news.title[i18n.language] || news.title.fr}</td>
                    <td>{new Date(news.date).toLocaleDateString()}</td>
                    <td>
                      {news.isPublished ? (
                        <span style={{ color: 'var(--color-green)', fontWeight: 'bold' }}>
                          <FontAwesomeIcon icon={faCheckCircle} style={{ marginRight: '5px' }} />
                          Publié
                        </span>
                      ) : (
                        <span style={{ opacity: 0.5 }}>Brouillon</span>
                      )}
                    </td>
                    <td>
                      <div className="admin-v2-actions">
                        <button className="admin-v2-btn-icon" style={{ background: 'rgba(0,122,94,0.1)', color: 'var(--color-green)' }}>
                          <FontAwesomeIcon icon={faEdit} />
                        </button>
                        <button className="admin-v2-btn-icon delete">
                          <FontAwesomeIcon icon={faTrash} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminNewsletters;
