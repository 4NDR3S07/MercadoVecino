// carrito_compras.js - Sistema de Carrito Simple y Robusto

console.log('✅ carrito_compras.js cargado');

class CarritoCompras {
    constructor() {
        this.STORAGE_KEY = 'mercadovecino_carrito';
        this.items = this.cargarCarrito();
        console.log('Carrito inicializado con', this.items.length, 'items');
    }

    cargarCarrito() {
        try {
            const guardado = sessionStorage.getItem(this.STORAGE_KEY);
            return guardado ? JSON.parse(guardado) : [];
        } catch (e) {
            console.error('Error al cargar carrito:', e);
            return [];
        }
    }

    guardarCarrito() {
        try {
            sessionStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.items));
            console.log('Carrito guardado:', this.items);
        } catch (e) {
            console.error('Error al guardar carrito:', e);
        }
    }

    agregarProducto(producto) {
        console.log('Agregando producto:', producto);
        
        const itemExistente = this.items.find(item => item.id === producto.id);
        
        if (itemExistente) {
            itemExistente.cantidad += 1;
            console.log('Producto ya existía, cantidad actualizada a', itemExistente.cantidad);
        } else {
            this.items.push({
                id: producto.id,
                nombre: producto.nombre,
                precio: producto.precio,
                descripcion: producto.descripcion || '',
                vendedor: producto.vendedor || 'Sin vendedor',
                cantidad: 1
            });
            console.log('Producto nuevo agregado');
        }
        
        this.guardarCarrito();
        return true;
    }

    eliminarProducto(productoId) {
        this.items = this.items.filter(item => item.id !== productoId);
        this.guardarCarrito();
    }

    actualizarCantidad(productoId, cantidad) {
        const item = this.items.find(item => item.id === productoId);
        if (item) {
            if (cantidad <= 0) {
                this.eliminarProducto(productoId);
            } else {
                item.cantidad = cantidad;
                this.guardarCarrito();
            }
        }
    }

    vaciarCarrito() {
        this.items = [];
        this.guardarCarrito();
    }

    calcularSubtotal() {
        return this.items.reduce((total, item) => total + (item.precio * item.cantidad), 0);
    }

    calcularEnvio() {
        return this.items.length > 0 ? 2800 : 0;
    }

    calcularTotal() {
        return this.calcularSubtotal() + this.calcularEnvio();
    }

    obtenerCantidadArticulos() {
        return this.items.reduce((total, item) => total + item.cantidad, 0);
    }

    obtenerItems() {
        return this.items;
    }

    estaVacio() {
        return this.items.length === 0;
    }
}

// Crear instancia global
const carrito = new CarritoCompras();
console.log('✅ Instancia de carrito creada');

// Función principal para agregar al carrito
function agregarAlCarrito(productoId) {
    console.log('agregarAlCarrito llamado con ID:', productoId);
    
    // Verificar si está logueado
    const userWelcome = document.getElementById('userWelcome');
    if (!userWelcome) {
        console.log('Usuario no logueado');
        alert('Debes iniciar sesión para agregar productos al carrito');
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

    console.log('Datos del producto:', { productoId, nombre, precio, vendedor });

    const producto = {
        id: productoId,
        nombre,
        precio,
        descripcion,
        vendedor
    };

    carrito.agregarProducto(producto);
    mostrarNotificacion(`"${nombre}" Agregado al 🛒 Carrito`);
}

function mostrarNotificacion2(mensaje) {
    const notif = document.createElement('div');
    notif.className = 'notificacion-carrito';
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

function mostrarNotificacion(mensaje) {
    const notif = document.createElement('div');
    notif.className = 'notificacion-carrito';
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

// Funciones para la página del carrito
function renderizarCarrito() {
    const carritoContainer = document.querySelector('.detalle-compras');
    if (!carritoContainer) return;

    const items = carrito.obtenerItems();
    let html = '<h2>Carrito de Compras</h2>';

    if (items.length === 0) {
        html += `
            <div style="text-align: center; padding: 60px 20px; color: #999;">
                <p style="font-size: 48px; margin-bottom: 15px;">🛒</p>
                <p style="font-size: 18px; margin-bottom: 15px;">Tu carrito está vacío</p>
            </div>
        `;
    } else {
        items.forEach(item => {
            html += `
                <div class="item-compra" data-item-id="${item.id}">
                    <img src="/static/imagenes/producto-default.png" alt="${item.nombre}" style="width: 100px; height: 100px; object-fit: cover; border-radius: 4px;">
                    <div class="info">
                        <p class="nombre">${item.nombre}</p>
                        <p class="precio">$${item.precio.toLocaleString('es-CO')}</p>
                        <p style="font-size: 12px; color: #999;">Vendedor: ${item.vendedor}</p>
                    </div>
                    <div class="cantidad">
                        <button onclick="disminuirCantidad(${item.id})">−</button> 
                        <span style="width: 30px; text-align: center;">${item.cantidad}</span>
                        <button onclick="aumentarCantidad(${item.id})">+</button> 
                    </div>
                    <button class="eliminar" onclick="eliminarDelCarrito(${item.id})">✕</button> 
                </div>
            `;
        });
    }

    carritoContainer.innerHTML = html;
    actualizarResumen();
}

function actualizarResumen() {
    const resumenCompra = document.querySelector('.resumen-compra');
    if (!resumenCompra) return;

    const subtotal = carrito.calcularSubtotal();
    const envio = carrito.calcularEnvio();
    const total = carrito.calcularTotal();
    const cantidadArticulos = carrito.obtenerCantidadArticulos();

    let html = `
        <h2>Resumen del Carrito</h2>
        <p>Subtotal: <span>$${subtotal.toLocaleString('es-CO')}</span></p>
        <p>Envío: <span>$${envio.toLocaleString('es-CO')}</span></p>
        <p style="font-size: 16px; font-weight: 700; border-top: 2px solid #e1e5e9; padding-top: 10px; margin-top: 10px;">
            <strong>Total:</strong> <span style="color: #13D796;">$${total.toLocaleString('es-CO')}</span>
        </p>
        <p style="font-size: 13px; color: #999;">Total de Artículos: <span>${cantidadArticulos}</span></p>
    `;

    if (cantidadArticulos > 0) {
        html += `
            <button class="actualizar" onclick="finalizarCompra()" style="margin-top: 20px;">Finalizar Compra</button>
            <button onclick="vaciarCarrito()" style="width: 100%; padding: 12px; background: #ef4444; color: white; border: none; border-radius: 6px; margin-top: 10px; cursor: pointer;">Vaciar Carrito</button>
        `;
    }

    resumenCompra.innerHTML = html;
}

function aumentarCantidad(productoId) {
    const item = carrito.items.find(i => i.id === productoId);
    if (item) {
        carrito.actualizarCantidad(productoId, item.cantidad + 1);
        renderizarCarrito();
    }
}

function disminuirCantidad(productoId) {
    const item = carrito.items.find(i => i.id === productoId);
    if (item && item.cantidad > 1) {
        carrito.actualizarCantidad(productoId, item.cantidad - 1);
        renderizarCarrito();
    }
}

function eliminarDelCarrito(productoId) {
    if (confirm('¿Deseas eliminar este producto?')) {
        carrito.eliminarProducto(productoId);
        renderizarCarrito();
        mostrarNotificacion2('Producto eliminado del 🛒 Carrito');
    }
}

function vaciarCarrito() {
    if (confirm('¿Vaciar todo el carrito?')) {
        carrito.vaciarCarrito();
        renderizarCarrito();
        mostrarNotificacion2('🛒 Carrito vaciado');
    }
}

function finalizarCompra() {
    if (carrito.estaVacio()) {
        alert('Tu carrito está vacío');
        return;
    }

    const total = carrito.calcularTotal();
    if (confirm(`¿Confirmar compra por $${total.toLocaleString('es-CO')}?`)) {
        enviarCompraAlBackend();
    }
}

async function enviarCompraAlBackend() {
    try {
        const response = await fetch('/api/crear_pedido', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                items: carrito.obtenerItems(),
                subtotal: carrito.calcularSubtotal(),
                envio: carrito.calcularEnvio(),
                total: carrito.calcularTotal()
            })
        });

        if (response.ok) {
            mostrarNotificacion('Compra realizada');
            carrito.vaciarCarrito();
            setTimeout(() => {
                window.location.href = '/historial_compras';
            }, 1500);
        } else {
            alert('Error al procesar la compra');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error de conexión');
    }
}

// Inicializar cuando carga la página
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM cargado');
    if (window.location.pathname === '/carrito_compras') {
        console.log('Renderizando carrito');
        renderizarCarrito();
    }
});