        function applyFilters() {
            const statusFilter = document.getElementById('statusFilter').value;
            const customerFilter = document.getElementById('customerFilter').value;
            const rows = document.querySelectorAll('#ordersTable tbody tr');

            rows.forEach(row => {
                let showRow = true;

                if (statusFilter && row.dataset.status !== statusFilter) {
                    showRow = false;
                }

                if (customerFilter && row.dataset.customer !== customerFilter) {
                    showRow = false;
                }

                row.style.display = showRow ? '' : 'none';
            });

            showNotification('Filtros aplicados correctamente');
        }

        function clearFilters() {
            document.querySelectorAll('.filter-select').forEach(select => {
                select.value = '';
            });

            document.querySelectorAll('#ordersTable tbody tr').forEach(row => {
                row.style.display = '';
            });

            showNotification('Filtros limpiados');
        }

        function generateReport() {
            showNotification('📊 Generando reporte de pedidos...');
            
            // Simulate report generation
            setTimeout(() => {
                showNotification('✅ Reporte generado exitosamente');
            }, 2000);
        }

        function showNotification(message) {
            const notification = document.createElement('div');
            notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: linear-gradient(135deg, #4caf50 0%, #45a049 100%);
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        z-index: 2000;
        box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        animation: slideIn 0.3s ease-in-out;
        font-weight: 600;
            `;
            notification.textContent = message;
            document.body.appendChild(notification);
            
            setTimeout(() => {
                notification.remove();
            }, 3000);
        }

        // Add CSS for notification animation
        const style = document.createElement('style');
        style.textContent = `
            @keyframes slideInRight {
                from {
                    transform: translateX(100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
        `;
        document.head.appendChild(style);

        // Search functionality
        document.querySelector('.search-input').addEventListener('input', function(e) {
            const searchTerm = e.target.value.toLowerCase();
            const rows = document.querySelectorAll('#ordersTable tbody tr');

            rows.forEach(row => {
                const productName = row.querySelector('td:first-child').textContent.toLowerCase();
                const customerName = row.querySelector('.customer-name').textContent.toLowerCase();
                
                const matches = productName.includes(searchTerm) || customerName.includes(searchTerm);
                row.style.display = matches ? '' : 'none';
            });
        });

        // Auto-update simulation
        setInterval(() => {
            const pendingBadges = document.querySelectorAll('.status-pending');
            if (pendingBadges.length > 0 && Math.random() > 0.7) {
                const randomBadge = pendingBadges[Math.floor(Math.random() * pendingBadges.length)];
                randomBadge.className = 'status-badge status-delivered';
                randomBadge.textContent = 'Entregado';
                showNotification('📦 Estado de pedido actualizado');
            }
        }, 10000);

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

