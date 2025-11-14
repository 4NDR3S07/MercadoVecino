// favoritos.js - Sistema de Favoritos

console.log('✅ favoritos.js cargado');

class GestorFavoritos {
    constructor() {
        this.STORAGE_KEY = 'mercadovecino_favoritos';
        this.items = this.cargarFavoritos();
        console.log('Favoritos inicializados con', this.items.length, 'items');
    }

    cargarFavoritos() {
        try {
            const guardado = sessionStorage.getItem(this.STORAGE_KEY);
            return guardado ? JSON.parse(guardado) : [];
        } catch (e) {
            console.error('Error al cargar favoritos:', e);
            return [];
        }
    }

    guardarFavoritos() {
        try {
            sessionStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.items));
            console.log('Favoritos guardados:', this.items);
        } catch (e) {
            console.error('Error al guardar favoritos:', e);
        }
    }

    agregarFavorito(producto) {
        console.log('Agregando a favoritos:', producto);
        
        const yaExiste = this.items.find(item => item.id === producto.id);
        
        if (yaExiste) {
            console.log('Producto ya está en favoritos');
            return false;
        }
        
        this.items.push({
            id: producto.id,
            nombre: producto.nombre,
            precio: producto.precio,
            descripcion: producto.descripcion || '',
            vendedor: producto.vendedor || 'Sin vendedor',
            categoria: producto.categoria || 'OTROS',
            fecha_agregado: new Date().toISOString()
        });
        
        this.guardarFavoritos();
        return true;
    }

    eliminarFavorito(productoId) {
        this.items = this.items.filter(item => item.id !== productoId);
        this.guardarFavoritos();
    }

    obtenerFavoritos() {
        return this.items;
    }

    estaEnFavoritos(productoId) {
        return this.items.some(item => item.id === productoId);
    }

    vaciarFavoritos() {
        this.items = [];
        this.guardarFavoritos();
    }

    obtenerCantidad() {
        return this.items.length;
    }
}

// Crear instancia global
const favoritos = new GestorFavoritos();
console.log('✅ Instancia de favoritos creada');

// Función principal para agregar a favoritos
function agregarAFavoritos(productoId) {
    console.log('agregarAFavoritos llamado con ID:', productoId);
    
    // Verificar si está logueado
    const userWelcome = document.getElementById('userWelcome');
    if (!userWelcome) {
        console.log('Usuario no logueado');
        alert('Debes iniciar sesión para agregar a favoritos');
        window.location.href = '/login';
        return;
    }

    // Buscar el producto en el DOM
    const productoCard = document.querySelector(`[data-producto-id="${productoId}"]`);
    if (!productoCard) {
        console.error('No se encontró el producto con ID:', productoId);
        return;
    }

    // Extraer datos del producto
    const nombre = productoCard.querySelector('h4').textContent.trim();
    const precioText = productoCard.querySelector('.precio').textContent;
    const precio = parseFloat(precioText.replace(/[^\d]/g, '')) || 0;
    const descripcion = productoCard.querySelector('.descripcion').textContent.trim();
    const vendedorEl = productoCard.querySelector('.vendedor');
    const vendedor = vendedorEl ? vendedorEl.textContent.replace('👤 ', '').trim() : 'Sin vendedor';
    const categoria = productoCard.dataset.categoria || 'OTROS';

    console.log('Datos del producto:', { productoId, nombre, precio, vendedor });

    const producto = {
        id: productoId,
        nombre,
        precio,
        descripcion,
        vendedor,
        categoria
    };

    if (favoritos.agregarFavorito(producto)) {
        mostrarNotificacionFavorito(`"${nombre}" Agregado a ⭐ Favoritos`);
        actualizarBtnFavorito(productoId);
    } else {
        alert('Este producto ya está en favoritos');
    }
}

function eliminarDeFavoritos(productoId) {
    if (confirm('¿Deseas eliminar este producto de favoritos?')) {
        favoritos.eliminarFavorito(productoId);
        mostrarNotificacionFavorito2('Eliminado de ⭐ Favoritos');
        actualizarBtnFavorito(productoId);
        
        // Si estamos en la página de favoritos, renderizar de nuevo
        if (window.location.pathname === '/favoritos') {
            renderizarFavoritos();
        }
    }
}

function actualizarBtnFavorito(productoId) {
    const card = document.querySelector(`[data-producto-id="${productoId}"]`);
    if (!card) return;
    
    const btn = card.querySelector('.btn-favorito');
    if (!btn) return;
    
    const esFavorito = favoritos.estaEnFavoritos(productoId);
    if (esFavorito) {
        btn.innerHTML = '⭐ En favoritos';
        btn.style.background = '#13D796';
    } else {
        btn.innerHTML = '⭐ Agregar a favoritos';
        btn.style.background = '';
    }
}

function mostrarNotificacionFavorito2(mensaje) {
    const notif = document.createElement('div');
    notif.className = 'notificacion-favorito';
    notif.textContent = mensaje;
    notif.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: linear-gradient(135deg, #ef4444 0%, #ef4444 100%);
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        z-index: 2000;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        animation: slideIn 0.3s ease-in-out;
        font-weight: 600;
    `;
    
    document.body.appendChild(notif);
    
    setTimeout(() => {
        notif.remove();
    }, 3000);
}

function mostrarNotificacionFavorito(mensaje) {
    const notif = document.createElement('div');
    notif.className = 'notificacion-favorito';
    notif.textContent = mensaje;
    notif.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: linear-gradient(135deg, #13D796 0%, #13D796 100%);
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        z-index: 2000;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        animation: slideIn 0.3s ease-in-out;
        font-weight: 600;
    `;
    
    document.body.appendChild(notif);
    
    setTimeout(() => {
        notif.remove();
    }, 3000);
}

// Funciones para la página de favoritos
function renderizarFavoritos() {
    const favoritosContainer = document.querySelector('.favoritos-container');
    if (!favoritosContainer) return;

    const items = favoritos.obtenerFavoritos();
    let html = '<h2>Mis Favoritos</h2>';

    if (items.length === 0) {
        html += `
            <div style="text-align: center; padding: 60px 20px; color: #999;">
                <p style="font-size: 48px; margin-bottom: 15px;">⭐</p>
                <p style="font-size: 18px; margin-bottom: 15px;">No tienes favoritos</p>
            </div>
        `;
    } else {
        html += '<div class="productos-grid">';
        
        items.forEach(item => {
            html += `
                <div class="producto-card" data-categoria="${item.categoria}" data-precio="${item.precio}" data-producto-id="${item.id}">
                    <div class="producto-header">
                        <h4>${item.nombre}</h4>
                        <span class="categoria-badge">${item.categoria}</span>
                    </div>
                    <p class="descripcion">${item.descripcion || 'Sin descripción disponible'}</p>
                    <div class="producto-footer">
                        <span class="precio">$${item.precio.toLocaleString('es-CO')}</span>
                        <p class="vendedor"><small>👤 ${item.vendedor}</small></p>
                    </div>
                    <div style="display: flex; gap: 10px; margin-top: 10px; position: relative;">
                        <button class="btn-carrito" onclick="agregarAlCarrito(${item.id})" style="flex: 1;">🛒 Carrito</button>
                        <button class="eliminar" onclick="eliminarDeFavoritos(${item.id})">✕</button>
                    </div>
                </div>
            `;
        });
        
        html += '</div>';
    } 
    favoritosContainer.innerHTML = html;
}

// Inicializar cuando carga la página
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM cargado');
    if (window.location.pathname === '/favoritos') {
        console.log('Renderizando favoritos');
        renderizarFavoritos();
    }
});

// Inicializar cuando carga la página
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM cargado');
    if (window.location.pathname === '/favoritos') {
        console.log('Renderizando favoritos');
        renderizarFavoritos();
    }
});