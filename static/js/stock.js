// ========================================
// RF010: GESTIÓN DE STOCK - FUNCIONALIDAD
// ========================================

// Variable global para almacenar el ID del producto actual
let productoIdActual = null;

/**
 * Abre el modal para editar el stock de un producto
 * @param {number} productoId - ID del producto
 * @param {string} nombreProducto - Nombre del producto
 * @param {number} stockActual - Cantidad actual en stock
 */
function abrirModalStock(productoId, nombreProducto, stockActual) {
    // Guardar el ID del producto
    productoIdActual = productoId;
    
    // Actualizar el contenido del modal
    document.getElementById('nombreProducto').textContent = nombreProducto;
    document.getElementById('stockActual').value = stockActual;
    document.getElementById('nuevoStock').value = stockActual;
    
    // Configurar la URL del formulario
    const form = document.getElementById('formStock');
    form.action = `/actualizar_stock/${productoId}`;
    
    // Mostrar el modal
    document.getElementById('modalStock').style.display = 'block';
    
    // Focus en el campo de nuevo stock
    document.getElementById('nuevoStock').focus();
}

/**
 * Cierra el modal de stock
 */
function cerrarModalStock() {
    document.getElementById('modalStock').style.display = 'none';
    
    // Limpiar el formulario
    document.getElementById('formStock').reset();
    productoIdActual = null;
}

/**
 * Valida el formulario de stock antes de enviarlo
 */
function validarFormularioStock(event) {
    const nuevoStock = document.getElementById('nuevoStock').value;
    
    // Validar que sea un número válido
    if (nuevoStock === '' || isNaN(nuevoStock) || parseInt(nuevoStock) < 0) {
        event.preventDefault();
        alert('Por favor, ingrese una cantidad válida (número mayor o igual a 0)');
        return false;
    }
    
    return true;
}

// ========================================
// EVENTOS
// ========================================

// Cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    // Configurar el formulario de stock
    const formStock = document.getElementById('formStock');
    if (formStock) {
        formStock.addEventListener('submit', validarFormularioStock);
    }
    
    // Cerrar modal al hacer clic fuera de él
    window.onclick = function(event) {
        const modal = document.getElementById('modalStock');
        if (event.target === modal) {
            cerrarModalStock();
        }
    };
    
    // Cerrar modal con tecla ESC
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape') {
            const modal = document.getElementById('modalStock');
            if (modal.style.display === 'block') {
                cerrarModalStock();
            }
        }
    });
    
    // Auto-ocultar alertas después de 5 segundos
    const alerts = document.querySelectorAll('.alert');
    alerts.forEach(function(alert) {
        setTimeout(function() {
            alert.style.transition = 'opacity 0.5s ease';
            alert.style.opacity = '0';
            setTimeout(function() {
                alert.remove();
            }, 500);
        }, 5000);
    });
    
    // Permitir solo números en el campo de stock
    const campoStock = document.getElementById('nuevoStock');
    if (campoStock) {
        campoStock.addEventListener('input', function(e) {
            // Remover caracteres no numéricos
            this.value = this.value.replace(/[^0-9]/g, '');
        });
        
        // Validación en tiempo real
        campoStock.addEventListener('blur', function() {
            if (this.value === '') {
                this.value = '0';
            }
        });
    }
});

// ========================================
// FUNCIONES AUXILIARES
// ========================================

/**
 * Actualiza la apariencia de la fila según el stock
 * @param {number} productoId - ID del producto
 * @param {number} nuevoStock - Nueva cantidad en stock
 */
function actualizarFilaProducto(productoId, nuevoStock) {
    const fila = document.querySelector(`tr[data-producto-id="${productoId}"]`);
    if (fila) {
        const stockBadge = fila.querySelector('.stock-badge');
        const estadoBadge = fila.querySelector('.badge-success, .badge-danger');
        
        // Actualizar badge de stock
        if (stockBadge) {
            stockBadge.textContent = `${nuevoStock} unidades`;
            stockBadge.className = 'stock-badge';
            if (nuevoStock === 0) {
                stockBadge.classList.add('stock-empty');
            } else if (nuevoStock < 10) {
                stockBadge.classList.add('stock-low');
            } else {
                stockBadge.classList.add('stock-ok');
            }
        }
        
        // Actualizar badge de estado
        if (estadoBadge) {
            if (nuevoStock > 0) {
                estadoBadge.className = 'badge badge-success';
                estadoBadge.textContent = 'Disponible';
            } else {
                estadoBadge.className = 'badge badge-danger';
                estadoBadge.textContent = 'Agotado';
            }
        }
    }
}

/**
 * Confirma la actualización de stock
 * @param {string} nombreProducto - Nombre del producto
 * @param {number} stockActual - Stock actual
 * @param {number} nuevoStock - Nuevo stock
 * @returns {boolean} - True si el usuario confirma
 */
function confirmarActualizacion(nombreProducto, stockActual, nuevoStock) {
    const mensaje = `¿Confirmar actualización de stock?\n\n` +
                   `Producto: ${nombreProducto}\n` +
                   `Stock actual: ${stockActual} unidades\n` +
                   `Nuevo stock: ${nuevoStock} unidades`;
    
    return confirm(mensaje);
}

// ========================================
// BÚSQUEDA Y FILTRADO (OPCIONAL)
// ========================================

/**
 * Filtra los productos en la tabla según el texto de búsqueda
 * @param {string} textoBusqueda - Texto a buscar
 */
function filtrarProductos(textoBusqueda) {
    const filas = document.querySelectorAll('.products-table tbody tr');
    const textoMinuscula = textoBusqueda.toLowerCase();
    
    filas.forEach(function(fila) {
        const texto = fila.textContent.toLowerCase();
        if (texto.includes(textoMinuscula)) {
            fila.style.display = '';
        } else {
            fila.style.display = 'none';
        }
    });
}

/**
 * Ordena la tabla por columna
 * @param {number} columna - Índice de la columna
 * @param {boolean} ascendente - True para orden ascendente
 */
function ordenarTabla(columna, ascendente = true) {
    const tabla = document.querySelector('.products-table tbody');
    const filas = Array.from(tabla.querySelectorAll('tr'));
    
    filas.sort(function(a, b) {
        const valorA = a.cells[columna].textContent.trim();
        const valorB = b.cells[columna].textContent.trim();
        
        // Intentar convertir a número si es posible
        const numA = parseFloat(valorA.replace(/[^0-9.-]/g, ''));
        const numB = parseFloat(valorB.replace(/[^0-9.-]/g, ''));
        
        if (!isNaN(numA) && !isNaN(numB)) {
            return ascendente ? numA - numB : numB - numA;
        }
        
        // Comparación de texto
        return ascendente ? 
            valorA.localeCompare(valorB) : 
            valorB.localeCompare(valorA);
    });
    
    // Limpiar y volver a agregar las filas ordenadas
    filas.forEach(function(fila) {
        tabla.appendChild(fila);
    });
}

// ========================================
// EXPORTAR FUNCIONES GLOBALES
// ========================================

// Hacer funciones disponibles globalmente para uso en HTML
window.abrirModalStock = abrirModalStock;
window.cerrarModalStock = cerrarModalStock;
window.filtrarProductos = filtrarProductos;
window.ordenarTabla = ordenarTabla;