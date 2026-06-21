// js/app.js

// 1. ESTADO GLOBAL DE LA APLICACIÓN
const state = {
  generoActivo: 'hombre',
  categoriaActiva: 'superior',
  prendasEquipadas: {
    superior: null,
    inferior: null,
    calzado: null
  }
};

// 2. ELEMENTOS DEL DOM SELECTORES
const dom = {
  layerBody: document.getElementById('layer-body'),
  layerSuperior: document.getElementById('layer-superior'),
  layerInferior: document.getElementById('layer-inferior'),
  layerCalzado: document.getElementById('layer-calzado'),
  genderSelector: document.getElementById('genderSelector'),
  categoryTabs: document.getElementById('categoryTabs'),
  wardrobeGrid: document.getElementById('wardrobeGrid'),
  btnCheckout: document.getElementById('btnCheckout'),
  avatarCanvas: document.getElementById('avatarCanvas')
};

// 3. INICIALIZADOR DEL PROYECTO (Se configuran los eventos globales UNA SOLA VEZ)
function init() {
  renderSelectorGeneros();
  renderPestañasCategorias();
  cambiarGenero(state.generoActivo);
  setupGlobalDragAndDrop(); // Eventos estáticos del Canvas configurados una vez
  setupCheckout();
}

// 4. RENDERIZAR SELECTOR DE GÉNERO
function renderSelectorGeneros() {
  dom.genderSelector.innerHTML = Object.keys(WARDROBE_DATA).map(gen => {
    const data = WARDROBE_DATA[gen];
    const isActive = gen === state.generoActivo ? 'active' : '';
    return `<button class="btn-gender ${isActive}" data-gender="${gen}">${data.label}</button>`;
  }).join('');

  dom.genderSelector.addEventListener('click', (e) => {
    if (e.target.classList.contains('btn-gender')) {
      const nuevoGen = e.target.getAttribute('data-gender');
      if (nuevoGen === 'mujer') {
        alert("¡Sección de Mujer en camino! Para esta Demo nos enfocaremos en la interactividad con la colección de Hombre 🏃‍♂️🏆");
        return;
      }
      document.querySelectorAll('.btn-gender').forEach(b => b.classList.remove('active'));
      e.target.classList.add('active');
      cambiarGenero(nuevoGen);
    }
  });
}

// 5. RENDERIZAR PESTAÑAS DE CATEGORÍA
function renderPestañasCategorias() {
  const categorias = WARDROBE_DATA[state.generoActivo].categorias;
  dom.categoryTabs.innerHTML = Object.keys(categorias).map(cat => {
    const isActive = cat === state.categoriaActiva ? 'active' : '';
    return `<button class="tab-btn ${isActive}" data-cat="${cat}">${categorias[cat].label}</button>`;
  }).join('');

  dom.categoryTabs.addEventListener('click', (e) => {
    if (e.target.classList.contains('tab-btn')) {
      document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      e.target.classList.add('active');
      state.categoriaActiva = e.target.getAttribute('data-cat');
      renderGridPrendas();
    }
  });
}

// 6. CAMBIAR DE GÉNERO Y RESETEAR CANVAS
function cambiarGenero(genero) {
  state.generoActivo = genero;
  dom.layerBody.src = WARDROBE_DATA[genero].bodyBase;
  
  Object.keys(state.prendasEquipadas).forEach(cat => {
    state.prendasEquipadas[cat] = null;
    const layer = getLayerElement(cat);
    layer.src = '';
    layer.classList.remove('equipped', 'visible');
  });

  renderGridPrendas();
}

// 7. RENDERIZAR ARMARIO DINÁMICO (Limpio de configuraciones redundantes de eventos)
function renderGridPrendas() {
  const categoria = WARDROBE_DATA[state.generoActivo].categorias[state.categoriaActiva];
  
  if (!categoria || !categoria.items.length) {
    dom.wardrobeGrid.innerHTML = `<p style="grid-column: 1/-1; color: var(--muted); text-align: center; padding: 2rem;">No hay prendas en esta categoría.</p>`;
    return;
  }

  dom.wardrobeGrid.innerHTML = categoria.items.map(item => {
    const isEquipped = state.prendasEquipadas[state.categoriaActiva]?.id === item.id ? 'active' : '';
    const rutaItem = `assets/wardrobe/${state.generoActivo}/item/${item.archivo}`;

    return `
      <div class="clothing-card ${isEquipped}" 
           draggable="true" 
           data-id="${item.id}" 
           data-cat="${state.categoriaActiva}">
        <div class="card-preview">
          <img src="${rutaItem}" alt="${item.nombre}" draggable="false" onerror="this.style.display='none'; this.parentElement.innerHTML='${categoria.texturaPlaceholder}'">
        </div>
        <div class="card-info">
          <div class="card-name">${item.nombre}</div>
          <div class="card-price">${item.precio}</div>
        </div>
      </div>
    `;
  }).join('');
}

// 7.5 CONFIGURAR EVENTOS DEL PANEL POR DELEGACIÓN DE EVENTOS (Optimizado para Memoria RAM)
dom.wardrobeGrid.addEventListener('dragstart', (e) => {
  const card = e.target.closest('.clothing-card');
  if (!card) return;
  card.classList.add('dragging');
  e.dataTransfer.setData('text/plain', card.getAttribute('data-id'));
  e.dataTransfer.setData('category', card.getAttribute('data-cat'));
});

dom.wardrobeGrid.addEventListener('dragend', (e) => {
  const card = e.target.closest('.clothing-card');
  if (card) card.classList.remove('dragging');
  dom.avatarCanvas.classList.remove('drag-over');
});

dom.wardrobeGrid.addEventListener('click', (e) => {
  const card = e.target.closest('.clothing-card');
  if (!card) return;
  const idPrenda = card.getAttribute('data-id');
  const itemsDisponibles = WARDROBE_DATA[state.generoActivo].categorias[state.categoriaActiva].items;
  const prendaSeleccionada = itemsDisponibles.find(item => item.id === idPrenda);
  equiparPrenda(state.categoriaActiva, prendaSeleccionada);
});

// 7.6 CONFIGURAR EVENTOS DE CAÍDA DEL CANVAS (Se ejecuta una sola vez en init)
function setupGlobalDragAndDrop() {
  dom.avatarCanvas.addEventListener('dragover', (e) => {
    e.preventDefault();
    dom.avatarCanvas.classList.add('drag-over');
  });

  dom.avatarCanvas.addEventListener('dragleave', () => {
    dom.avatarCanvas.classList.remove('drag-over');
  });

  dom.avatarCanvas.addEventListener('drop', (e) => {
    e.preventDefault();
    dom.avatarCanvas.classList.remove('drag-over');

    const idPrenda = e.dataTransfer.getData('text/plain');
    const categoria = e.dataTransfer.getData('category');

    if (!idPrenda || !categoria) return;

    const itemsDisponibles = WARDROBE_DATA[state.generoActivo].categorias[categoria].items;
    const prendaSeleccionada = itemsDisponibles.find(item => item.id === idPrenda);

    if (prendaSeleccionada) {
      if (categoria !== state.categoriaActiva) {
        state.categoriaActiva = categoria;
        document.querySelectorAll('.tab-btn').forEach(b => {
          b.classList.toggle('active', b.getAttribute('data-cat') === categoria);
        });
      }
      equiparPrenda(categoria, prendaSeleccionada);
    }
  });
}

// 8. ASIGNAR PRENDA A LA CAPA ANATÓMICA (Controlado limpiamente por clases CSS)
function equiparPrenda(categoria, prenda) {
  const layer = getLayerElement(categoria);

  // Desequipar
  if (state.prendasEquipadas[categoria]?.id === prenda.id) {
    state.prendasEquipadas[categoria] = null;
    layer.classList.remove('equipped', 'visible');
    // Esperamos a que la transición termine para limpiar el src y no parpadee
    setTimeout(() => {
      if (!state.prendasEquipadas[categoria]) layer.src = '';
    }, 300);
  } else {
    // Equipar
    state.prendasEquipadas[categoria] = prenda;
    
    const rutaRender = `assets/wardrobe/${state.generoActivo}/render/${prenda.archivo}`;
    layer.src = rutaRender;
    layer.classList.add('visible');
    
    // Forzar reflow para reiniciar la animación popImpact en CSS
    layer.style.animation = 'none';
    layer.offsetHeight; 
    layer.style.animation = 'popImpact 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards';
    layer.classList.add('equipped');
  }

  renderGridPrendas();
}

function getLayerElement(categoria) {
  if (categoria === 'superior') return dom.layerSuperior;
  if (categoria === 'inferior') return dom.layerInferior;
  if (categoria === 'calzado') return dom.layerCalzado;
}

// 9. LÓGICA DE CIERRE COMERCIAL
function setupCheckout() {
  dom.btnCheckout.addEventListener('click', () => {
    const equipadas = Object.values(state.prendasEquipadas).filter(p => p !== null);
    
    if (equipadas.length === 0) {
      alert("¡Selecciona al menos una prenda en el vestidor para armar tu outfit! 🏆");
      return;
    }

    let mensaje = `Hola MC 🏆 He armado un outfit en la Demo de Vestidor Virtual:\n`;
    equipadas.forEach(p => {
      mensaje += `• ${p.nombre} (${p.precio})\n`;
    });
    mensaje += `\n¿Tienen disponibilidad de estos modelos para coordinar la compra?`;

    const urlWa = `https://wa.me/573135208083?text=${encodeURIComponent(mensaje)}`;
    window.open(urlWa, '_blank');
  });
}

window.onload = init;