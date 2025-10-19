import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { SelectSupermarketService, Supermarket } from './scripts/selectSupermarket';
import './styles/Home.scss';
import './styles/selectSupermarket.scss';

const Home: React.FC = () => {
  const [currentSection, setCurrentSection] = useState<'supermarket' | 'categories' | 'products'>('supermarket');
  const [selectSupermarketService] = useState(() => new SelectSupermarketService());

  const supermarkets = selectSupermarketService.getSupermarkets();
  const selectedSupermarket = selectSupermarketService.getSelectedSupermarket();

  const handleSupermarketSelect = (supermarket: Supermarket) => {
    selectSupermarketService.selectSupermarket(supermarket);
    setCurrentSection('categories');
  };

  const handleBack = () => {
    if (currentSection === 'categories') {
      setCurrentSection('supermarket');
      selectSupermarketService.clearSelection();
    }
  };

  return (
    <>
      <Helmet>
        <title>Caminando Online - Compara Precios</title>
        <meta name="description" content="Compara precios de productos en los mejores supermercados de Argentina" />
      </Helmet>

      <div className="home">
        <header className="home-header">
          <h1 className="home-title">🛒 Caminando Online</h1>
          <p className="home-subtitle">Compara precios en Carrefour, Jumbo, Dia, Vea y Disco</p>
        </header>

        <main className="home-main">
          {currentSection === 'supermarket' && (
            <div className="selectSupermarket">
              <h2 className="section-title">Selecciona un Supermercado</h2>
              <div className="buttons-grid">
                {supermarkets.map((supermarket) => (
                  <button
                    key={supermarket.id}
                    className="supermarket-btn"
                    onClick={() => handleSupermarketSelect(supermarket)}
                  >
                    <span className="supermarket-logo">{supermarket.logo}</span>
                    <span className="supermarket-name">{supermarket.name}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {currentSection === 'categories' && selectedSupermarket && (
            <div className="categories">
              <div className="section-header">
                <button className="back-btn" onClick={handleBack}>
                  ← Volver
                </button>
                <h2 className="section-title">
                  Categorías en {selectedSupermarket.name}
                </h2>
              </div>
              <div className="categories-grid">
                <p>Las categorías se cargarán desde la API...</p>
              </div>
            </div>
          )}
        </main>

        <footer className="home-footer">
          <p>&copy; 2025 Caminando Online. Todos los derechos reservados.</p>
        </footer>
      </div>
    </>
  );
};

export default Home;