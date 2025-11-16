document.addEventListener('DOMContentLoaded', function() {
    const toggleInput = document.getElementById('themeToggle');
    const body = document.body;

    // Función para aplicar el tema
    function applyTheme(isDark) {
        if (isDark) {
            body.classList.add('dark-mode');
            toggleInput.checked = false; // Luna visible
        } else {
            body.classList.remove('dark-mode');
            toggleInput.checked = true; // Sol visible
        }
    }

    // Verificar preferencia del sistema si no hay tema guardado
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
        applyTheme(true);
    } else {
        applyTheme(false);
    }

    // Listener para cambios en el toggle
    toggleInput.addEventListener('change', function() {
        const isDark = !toggleInput.checked;
        applyTheme(isDark);
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
    });

    // Detectar cambios en la preferencia del sistema (opcional)
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
        // Solo aplicar si el usuario no ha establecido una preferencia
        if (!localStorage.getItem('theme')) {
            applyTheme(e.matches);
        }
    });
});