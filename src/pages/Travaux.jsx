import React, { useState } from "react";
import "./TravauxV2.css";
import { useTranslation } from "react-i18next";
import Navbar from "../components/Navbar";

const TravauxV2 = () => {
  const { t } = useTranslation();
  const [filter, setFilter] = useState("all");

  const projects = [
    {
      id: 1,
      title: "Rénovation du Dortoir",
      category: "ongoing",
      img: "/assets/travaux-mama.png",
      desc: "Création d'un espace de vie sécurisé et salubre pour 50 enfants.",
      progress: 65,
      location: "Yaoundé"
    },
    {
      id: 2,
      title: "Distribution de Kits Scolaires",
      category: "completed",
      img: "/assets/soutien.png",
      desc: "200 enfants équipés pour la rentrée 2024.",
      location: "Douala"
    },
    {
      id: 3,
      title: "Forage d'un Puits",
      category: "ongoing",
      img: "/assets/don/banniere.png",
      desc: "Accès à l'eau potable pour l'orphelinat et le quartier voisin.",
      progress: 30,
      location: "Nord Cameroun"
    },
    {
      id: 4,
      title: "Construction de l'Infirmerie",
      category: "completed",
      img: "/assets/comptabilite.png",
      desc: "Accès aux premiers soins 24h/24 pour les pensionnaires.",
      location: "Yaoundé"
    }
  ];

  const filteredProjects = filter === "all" ? projects : projects.filter(p => p.category === filter);

  return (
    <div className="v2-layout">
      <Navbar hideDonate={true} />
      
      {/* HERO TRAVAUX */}
      <section className="travaux-v2-hero">
        <div className="v2-container">
          <div className="travaux-v2-hero-content">
            <span className="v2-subtitle" style={{color: "var(--color-yellow)"}}>Transparence & Action</span>
            <h1 className="v2-title" style={{color: "white"}}>Nos réalisations <br/>sur le terrain</h1>
          </div>
        </div>
      </section>

      {/* FILTER TABS */}
      <section className="travaux-v2-content">
        <div className="v2-container">
          <div className="v2-filters">
            <button 
              className={`filter-btn ${filter === 'all' ? 'active' : ''}`} 
              onClick={() => setFilter('all')}
            >
              Tous les projets
            </button>
            <button 
              className={`filter-btn ${filter === 'ongoing' ? 'active' : ''}`} 
              onClick={() => setFilter('ongoing')}
            >
              En cours 🚧
            </button>
            <button 
              className={`filter-btn ${filter === 'completed' ? 'active' : ''}`} 
              onClick={() => setFilter('completed')}
            >
              Réalisés ✅
            </button>
          </div>

          <div className="projects-grid">
            {filteredProjects.map((project) => (
              <div className="v2-project-card" key={project.id}>
                <div className="project-img-wrapper">
                  <img src={project.img} alt={project.title} />
                  <span className={`status-badge ${project.category}`}>
                    {project.category === 'ongoing' ? 'En cours' : 'Terminé'}
                  </span>
                </div>
                <div className="project-body">
                  <span className="project-location">📍 {project.location}</span>
                  <h3>{project.title}</h3>
                  <p>{project.desc}</p>
                  
                  {project.category === 'ongoing' && (
                    <div className="progress-section">
                      <div className="progress-header">
                        <span>Financement</span>
                        <strong>{project.progress}%</strong>
                      </div>
                      <div className="progress-bar">
                        <div className="progress-fill" style={{width: `${project.progress}%`}}></div>
                      </div>
                      <button className="v2-btn-sm" onClick={() => window.location.href='/v2/don'}>
                        Contribuer →
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default TravauxV2;
