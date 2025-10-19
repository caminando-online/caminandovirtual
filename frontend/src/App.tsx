import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import Home from './pages/Home';
import './App.scss';

function App() {
  return (
    <div className="App">
      <Helmet>
        <title>Caminando Online - Comparación de Precios</title>
        <meta name="description" content="Compara precios de productos en supermercados Carrefour, Jumbo, Dia, Vea y Disco" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Helmet>

      <Routes>
        <Route path="/" element={<Home />} />
        {/* Otras rutas se agregarán aquí */}
      </Routes>
    </div>
  );
}

export default App;