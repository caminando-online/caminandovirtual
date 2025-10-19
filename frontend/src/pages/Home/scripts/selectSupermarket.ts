// Interfaces específicas de la sección selectSupermarket
export interface Supermarket {
  id: string;
  name: string;
  logo: string;
  baseUrl: string;
}

// Servicio principal de la sección selectSupermarket
export class SelectSupermarketService {
  private supermarkets: Supermarket[] = [
    {
      id: 'carrefour',
      name: 'Carrefour',
      logo: '🏪',
      baseUrl: 'https://www.carrefour.com.ar'
    },
    {
      id: 'jumbo',
      name: 'Jumbo',
      logo: '🛒',
      baseUrl: 'https://www.jumbo.com.ar'
    },
    {
      id: 'dia',
      name: 'Dia',
      logo: '🏬',
      baseUrl: 'https://www.dia.com.ar'
    },
    {
      id: 'vea',
      name: 'Vea',
      logo: '🛍️',
      baseUrl: 'https://www.vea.com.ar'
    },
    {
      id: 'disco',
      name: 'Disco',
      logo: '🏪',
      baseUrl: 'https://www.disco.com.ar'
    }
  ];

  private selectedSupermarket: Supermarket | null = null;

  // Constructor
  constructor() {
    // Inicialización si es necesaria
  }

  // Getters
  getSupermarkets(): Supermarket[] {
    return this.supermarkets;
  }

  getSelectedSupermarket(): Supermarket | null {
    return this.selectedSupermarket;
  }

  // Métodos de selección
  selectSupermarket(supermarket: Supermarket): Supermarket {
    this.selectedSupermarket = supermarket;
    return supermarket;
  }

  clearSelection(): void {
    this.selectedSupermarket = null;
  }

  hasSelectedSupermarket(): boolean {
    return this.selectedSupermarket !== null;
  }

  // Métodos específicos de la sección
  getSupermarketById(id: string): Supermarket | undefined {
    return this.supermarkets.find(supermarket => supermarket.id === id);
  }

  getAvailableSupermarkets(): Supermarket[] {
    return this.supermarkets.filter(supermarket => supermarket.baseUrl);
  }
}