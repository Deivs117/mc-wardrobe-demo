// js/wardrobe-data.js

const WARDROBE_DATA = {
  hombre: {
    label: "Hombre",
    // El cuerpo base solo se usa para renderizar, guardamos su ruta directa
    bodyBase: "assets/wardrobe/hombre/render/h_body_base.png",
    categorias: {
      superior: {
        label: "Prendas Superiores",
        texturaPlaceholder: "👕",
        items: [
          { id: "h_top_camiseta", nombre: "Camiseta High Performance", precio: "$85.000", archivo: "h_top_camiseta.png" },
          { id: "h_top_camisilla", nombre: "Camisilla Elite Track", precio: "$75.000", archivo: "h_top_camisilla.png" }
        ]
      },
      inferior: {
        label: "Prendas Inferiores",
        texturaPlaceholder: "🩳",
        items: [
          { id: "h_bottom_pantaloneta", nombre: "Short Aerodinámico 5\"", precio: "$95.000", archivo: "h_bottom_pantaloneta.png" },
          { id: "h_bottom_jogger", nombre: "Jogger Street Lifestyle", precio: "$140.000", archivo: "h_bottom_jogger.png" }
        ]
      },
      calzado: {
        label: "Calzado",
        texturaPlaceholder: "👟",
        items: [
          { id: "h_shoes_runner", nombre: "Tenis Runner Fly Amortiguados", precio: "$340.000", archivo: "h_shoes_runner.png" },
          { id: "h_shoes_lifestyle", nombre: "Tenis Casual Urban Court", precio: "$280.000", archivo: "h_shoes_lifestyle.png" }
        ]
      }
    }
  },
  mujer: {
    label: "Mujer",
    bodyBase: "assets/wardrobe/mujer/render/m_body_base.png",
    categorias: {
      superior: { label: "Prendas Superiores", texturaPlaceholder: "👚", items: [] },
      inferior: { label: "Prendas Inferiores", texturaPlaceholder: "🩱", items: [] },
      calzado: { label: "Calzado", texturaPlaceholder: "👟", items: [] }
    }
  }
};