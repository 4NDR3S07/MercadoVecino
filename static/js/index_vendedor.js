// index.js - JavaScript para la página principal

document.addEventListener('DOMContentLoaded', function() {
    cargarProductosDesdeAPI();
    configurarBuscador();
    configurarFiltros();
});

async function cargarProductosDesdeAPI() {
    const productosContainer = document.getElementById('productosContainer');
    productosContainer.innerHTML = '<p>⏳ Cargando productos...</p>';
    
    try {
        const response = await fetch('/api/productos');
        
        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
        }
        
        const productos = await response.json();
        console.log('✅ Productos cargados:', productos);
        
        if (!Array.isArray(productos) || productos.length === 0) {
            productosContainer.innerHTML = `
                <div style="text-align: center; padding: 40px;">
                    <p style="font-size: 18px; color: #666;">📦 No hay productos disponibles en este momento.</p>
                </div>
            `;
            return;
        }
        
        const productosHTML = generarProductosHTML(productos);
        productosContainer.innerHTML = productosHTML;
        window.productosGlobales = productos;
        
    } catch (error) {
        console.error('❌ Error al cargar productos:', error);
        productosContainer.innerHTML = `
            <div style="text-align: center; padding: 40px; color: #ef4444;">
                <p><strong>⚠️ Error al cargar productos</strong></p>
                <button onclick="location.reload()" style="margin-top: 15px; padding: 10px 20px; background: #1976d2; color: white; border: none; border-radius: 4px; cursor: pointer;">
                    🔄 Reintentar
                </button>
            </div>
        `;
    }
}

function generarProductosHTML(productos) {
    let html = '<div class="productos-grid">';
    
    productos.forEach(producto => {
        html += `
            <div class="producto-card" data-categoria="${producto.categoria}" data-precio="${producto.precio}" data-producto-id="${producto.id}">
                <div class="producto-header">
                    <h4>${producto.nombre}</h4>
                    <span class="categoria-badge">${producto.categoria}</span>
                </div>
                <p class="descripcion">${producto.descripcion || 'Sin descripción disponible'}</p>
                <div class="producto-footer">
                    <span class="precio">$${producto.precio.toLocaleString('es-CO')}</span>
                    <p class="vendedor"><small>👤 ${producto.vendedor}</small></p>
                </div>
            </div>
        `;
    });
    
    html += '</div>';
    return html;
}

function configurarBuscador() {
    const buscador = document.querySelector('.buscador');
    
    if (buscador) {
        buscador.addEventListener('input', function(e) {
            const termino = e.target.value.toLowerCase();
            filtrarProductos(termino);
        });
    }
}

function configurarFiltros() {
    const filtro = document.getElementById('filtro');
    
    if (filtro) {
        filtro.addEventListener('change', function(e) {
            const tipoFiltro = e.target.value;
            if (tipoFiltro) {
                aplicarFiltro(tipoFiltro);
            }
        });
    }
}

function filtrarProductos(termino) {
    const productos = document.querySelectorAll('.producto-card');
    
    productos.forEach(producto => {
        const nombre = producto.querySelector('h4').textContent.toLowerCase();
        const descripcion = producto.querySelector('.descripcion').textContent.toLowerCase();
        const vendedor = producto.querySelector('.vendedor').textContent.toLowerCase();
        
        if (nombre.includes(termino) || 
            descripcion.includes(termino) || 
            vendedor.includes(termino)) {
            producto.style.display = 'block';
        } else {
            producto.style.display = 'none';
        }
    });
}

function aplicarFiltro(tipoFiltro) {
    const productos = document.querySelectorAll('.producto-card');
    const productosArray = Array.from(productos);
    const container = document.querySelector('.productos-grid');
    
    if (!container) return;
    
    switch (tipoFiltro) {
        case 'precio-asc':
            productosArray.sort((a, b) => {
                const precioA = parseFloat(a.dataset.precio);
                const precioB = parseFloat(b.dataset.precio);
                return precioA - precioB;
            });
            break;
            
        case 'precio-desc':
            productosArray.sort((a, b) => {
                const precioA = parseFloat(a.dataset.precio);
                const precioB = parseFloat(b.dataset.precio);
                return precioB - precioA;
            });
            break;
            
        case 'nombre':
            productosArray.sort((a, b) => {
                const nombreA = a.querySelector('h4').textContent;
                const nombreB = b.querySelector('h4').textContent;
                return nombreA.localeCompare(nombreB);
            });
            break;
            
        case 'categoria':
            productosArray.sort((a, b) => {
                const catA = a.dataset.categoria;
                const catB = b.dataset.categoria;
                return catA.localeCompare(catB);
            });
            break;
    }
    
    productosArray.forEach(producto => {
        container.appendChild(producto);
    });
}

