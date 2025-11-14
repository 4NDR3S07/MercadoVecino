// ========================================
// RF011: VISTA RÁPIDA DEL PRODUCTO
// ========================================

/**
 * Muestra la vista rápida de un producto en un modal
 * @param {number} productoId - ID del producto
 */
function mostrarVistaRapida(productoId) {
    // Hacer petición AJAX para obtener datos del producto
    fetch(`/api/producto/${productoId}/vista-rapida`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Producto no encontrado');
            }
            return response.json();
        })
        .then(producto => {
            // Crear y mostrar el modal con la información
            crearModalVistaRapida(producto);
        })
        .catch(error => {
            console.error('Error:', error);
            alert('No se pudo cargar la información del producto');
        });
}

/**
 * Crea el modal de vista rápida con los datos del producto
 * @param {object} producto - Datos del producto
 */
function crearModalVistaRapida(producto) {
    // Verificar si ya existe un modal y eliminarlo
    const modalExistente = document.getElementById('modalVistaRapida');
    if (modalExistente) {
        modalExistente.remove();
    }
    
    // Crear el modal
    const modal = document.createElement('div');
    modal.id = 'modalVistaRapida';
    modal.className = 'modal-vista-rapida';
    modal.style.cssText = `
        display: block;
        position: fixed;
        z-index: 1000;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0,0,0,0.6);
        animation: fadeIn 0.3s ease;
    `;
    
    // Contenido del modal
    modal.innerHTML = `
        <div class="modal-contenido" style="
            background-color: white;
            margin: 5% auto;
            padding: 0;
            border-radius: 12px;
            width: 90%;
            max-width: 800px;
            box-shadow: 0 10px 40px rgba(0,0,0,0.3);
            animation: slideUp 0.3s ease;
            overflow: hidden;
        ">
            <span class="cerrar-modal" style="
                position: absolute;
                right: 20px;
                top: 20px;
                color: white;
                font-size: 32px;
                font-weight: bold;
                cursor: pointer;
                z-index: 1;
                text-shadow: 0 2px 4px rgba(0,0,0,0.3);
            ">&times;</span>
            
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0;">
                <!-- Imagen del producto -->
                <div style="background: #f8f9fa; display: flex; align-items: center; justify-content: center; padding: 40px;">
                    <img src="/static/${producto.imagen || 'imagenes/placeholder.png'}" 
                         alt="${producto.nombre}"
                         onerror="this.src='/static/imagenes/placeholder.png'"
                         style="max-width: 100%; max-height: 400px; object-fit: contain; border-radius: 8px;">
                </div>
                
                <!-- Información del producto -->
                <div style="padding: 40px;">
                    <h2 style="color: #2c3e50; font-size: 24px; margin-bottom: 15px;">${producto.nombre}</h2>
                    
                    <div style="margin-bottom: 20px;">
                        <span style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 6px 15px; border-radius: 20px; font-size: 13px; font-weight: 600;">
                            ${producto.categoria}
                        </span>
                    </div>
                    
                    <p style="color: #555; line-height: 1.8; margin-bottom: 20px; font-size: 15px;">
                        ${producto.descripcion}
                    </p>
                    
                    <div style="margin-bottom: 20px;">
                        <span style="display: block; font-size: 32px; color: #27ae60; font-weight: 700;">
                            $${new Intl.NumberFormat('es-CO').format(producto.precio)}
                        </span>
                    </div>
                    
                    <div style="margin-bottom: 25px; padding: 15px; background: ${producto.stock > 0 ? '#d4edda' : '#f8d7da'}; border-radius: 8px;">
                        <span style="color: ${producto.stock > 0 ? '#155724' : '#721c24'}; font-weight: 600; font-size: 15px;">
                            ${producto.stock > 0 ? `✅ Disponible (${producto.stock} unidades)` : '❌ Producto agotado'}
                        </span>
                    </div>
                    
                    <div style="padding: 15px; background: #f8f9fa; border-radius: 8px; margin-bottom: 25px;">
                        <h4 style="color: #2c3e50; margin-bottom: 10px; font-size: 16px;">📍 Vendedor</h4>
                        <p style="color: #555; margin-bottom: 5px;"><strong>Nombre:</strong> ${producto.vendedor}</p>
                        <p style="color: #555;"><strong>Teléfono:</strong> ${producto.telefono || 'No disponible'}</p>
                    </div>
                    
                    <div style="display: flex; gap: 10px;">
                        <button onclick="window.location.href='/producto/${producto.id}'" 
                                style="flex: 1; padding: 12px 20px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border: none; border-radius: 8px; font-weight: 600; cursor: pointer; font-size: 14px; transition: all 0.3s ease;">
                            Ver Detalles Completos
                        </button>
                        ${producto.stock > 0 ? `
                            <button onclick="agregarAlCarritoRapido(${producto.id})" 
                                    style="flex: 1; padding: 12px 20px; background: #27ae60; color: white; border: none; border-radius: 8px; font-weight: 600; cursor: pointer; font-size: 14px; transition: all 0.3s ease;">
                                🛒 Agregar al Carrito
                            </button>
                        ` : ''}
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Agregar al body
    document.body.appendChild(modal);
    
    // Configurar evento para cerrar
    const btnCerrar = modal.querySelector('.cerrar-modal');
    btnCerrar.onclick = () => cerrarModalVistaRapida();
    
    // Cerrar al hacer clic fuera del contenido
    modal.onclick = (event) => {
        if (event.target === modal) {
            cerrarModalVistaRapida();
        }
    };
    
    // Cerrar con tecla ESC
    document.addEventListener('keydown', function cerrarConEsc(e) {
        if (e.key === 'Escape') {
            cerrarModalVistaRapida();
            document.removeEventListener('keydown', cerrarConEsc);
        }
    });
}

/**
 * Cierra el modal de vista rápida
 */
function cerrarModalVistaRapida() {
    const modal = document.getElementById('modalVistaRapida');
    if (modal) {
        modal.style.animation = 'fadeOut 0.3s ease';
        setTimeout(() => {
            modal.remove();
        }, 300);
    }
}

/**
 * Agregar producto al carrito desde vista rápida
 * @param {number} productoId - ID del producto
 */
function agregarAlCarritoRapido(productoId) {
    // Aquí iría la lógica para agregar al carrito
    alert('Producto agregado al carrito');
    cerrarModalVistaRapida();
}

// ========================================
// CARGA DE PRODUCTOS EN INDEX
// ========================================

document.addEventListener('DOMContentLoaded', function() {
    cargarProductos();
    configurarModal();
});

/**
 * Carga los productos desde la API
 */
function cargarProductos() {
    const container = document.getElementById('productosContainer');
    
    if (!container) {
        return; // No estamos en la página de productos
    }
    
    fetch('/api/productos')
        .then(response => response.json())
        .then(productos => {
            if (productos.length === 0) {
                container.innerHTML = `
                    <div style="text-align: center; padding: 60px 20px; grid-column: 1/-1;">
                        <div style="font-size: 80px; margin-bottom: 20px;">📦</div>
                        <h3 style="color: #2c3e50; margin-bottom: 10px;">No hay productos disponibles</h3>
                        <p style="color: #7f8c8d;">Vuelve pronto para ver nuevos productos</p>
                    </div>
                `;
                return;
            }
            
            container.innerHTML = productos.map(producto => `
                <div class="producto-card" style="
                    background: #f8f9fa;
                    border: 1px solid #e9ecef;
                    border-radius: 12px;
                    padding: 20px;
                    text-align: center;
                    transition: all 0.3s ease;
                    position: relative;
                    overflow: hidden;
                ">
                    <div style="
                        width: 100%;
                        height: 200px;
                        background: #e9ecef;
                        border-radius: 8px;
                        margin-bottom: 15px;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        overflow: hidden;
                    ">
                        <span style="font-size: 60px;">📦</span>
                    </div>
                    
                    ${producto.stock === 0 ? `
                        <span style="
                            position: absolute;
                            top: 15px;
                            right: 15px;
                            background: #e74c3c;
                            color: white;
                            padding: 5px 10px;
                            border-radius: 5px;
                            font-size: 12px;
                            font-weight: 600;
                        ">Agotado</span>
                    ` : ''}
                    
                    <h4 style="
                        color: #2c3e50;
                        margin-bottom: 10px;
                        font-size: 16px;
                        height: 40px;
                        overflow: hidden;
                        display: -webkit-box;
                        -webkit-line-clamp: 2;
                        -webkit-box-orient: vertical;
                    ">${producto.nombre}</h4>
                    
                    <p style="
                        color: #7f8c8d;
                        font-size: 14px;
                        margin-bottom: 15px;
                        height: 40px;
                        overflow: hidden;
                    ">${producto.descripcion}</p>
                    
                    <span style="
                        display: block;
                        font-size: 24px;
                        font-weight: bold;
                        color: #27ae60;
                        margin-bottom: 15px;
                    ">$${new Intl.NumberFormat('es-CO').format(producto.precio)}</span>
                    
                    <div style="display: flex; gap: 8px; margin-bottom: 10px;">
                        <button onclick="mostrarVistaRapida(${producto.id})" style="
                            flex: 1;
                            padding: 10px 15px;
                            background: #6c757d;
                            color: white;
                            border: none;
                            border-radius: 6px;
                            font-weight: 600;
                            cursor: pointer;
                            font-size: 13px;
                            transition: all 0.3s ease;
                        " onmouseover="this.style.background='#5a6268'" onmouseout="this.style.background='#6c757d'">
                            👁️ Vista Rápida
                        </button>
                    </div>
                    
                    <button onclick="window.location.href='/producto/${producto.id}'" style="
                        width: 100%;
                        padding: 10px 15px;
                        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                        color: white;
                        border: none;
                        border-radius: 6px;
                        font-weight: 600;
                        cursor: pointer;
                        font-size: 13px;
                        transition: all 0.3s ease;
                    " onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 6px 15px rgba(102,126,234,0.4)'" onmouseout="this.style.transform=''; this.style.boxShadow=''">
                        Ver Detalles
                    </button>
                    
                    <p style="
                        color: #999;
                        font-size: 12px;
                        margin-top: 10px;
                    ">Vendedor: ${producto.vendedor}</p>
                </div>
            `).join('');
            
            // Agregar efecto hover a las tarjetas
            document.querySelectorAll('.producto-card').forEach(card => {
                card.addEventListener('mouseenter', function() {
                    this.style.transform = 'translateY(-5px)';
                    this.style.boxShadow = '0 8px 20px rgba(0,0,0,0.15)';
                });
                
                card.addEventListener('mouseleave', function() {
                    this.style.transform = '';
                    this.style.boxShadow = '';
                });
            });
        })
        .catch(error => {
            console.error('Error:', error);
            container.innerHTML = `
                <div style="text-align: center; padding: 40px; color: #e74c3c; grid-column: 1/-1;">
                    <p>Error al cargar los productos. Por favor, intenta de nuevo.</p>
                </div>
            `;
        });
}

/**
 * Configura el modal de login para usuarios no autenticados
 */
function configurarModal() {
    const modal = document.getElementById('loginModal');
    const btnAceptar = document.getElementById('acceptModal');
    
    if (btnAceptar) {
        btnAceptar.onclick = () => {
            modal.style.display = 'none';
        };
    }
}

// Agregar estilos de animación
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
    }
    
    @keyframes fadeOut {
        from { opacity: 1; }
        to { opacity: 0; }
    }
    
    @keyframes slideUp {
        from {
            opacity: 0;
            transform: translateY(50px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    #productosContainer {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
        gap: 25px;
        margin-top: 20px;
    }
    
    @media (max-width: 768px) {
        .modal-contenido > div {
            grid-template-columns: 1fr !important;
        }
    }
`;
document.head.appendChild(style);

// Exportar funciones globalmente
window.mostrarVistaRapida = mostrarVistaRapida;
window.cerrarModalVistaRapida = cerrarModalVistaRapida;
window.agregarAlCarritoRapido = agregarAlCarritoRapido;