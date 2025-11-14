from flask import Flask, render_template, session, redirect, url_for, flash, request
from functools import wraps

app = Flask(__name__)
app.secret_key = "clave_super_secreta"  # cámbiala en producción por algo seguro

# -------------------
# Decorador: solo Gmail y sesión activa
# -------------------
def gmail_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        # Verificar si está logueado
        if 'user_id' not in session or 'user_email' not in session:
            flash("Debes iniciar sesión con tu cuenta Gmail para acceder.", "warning")
            return redirect(url_for('login'))

        # Verificar si es Gmail
        if not session['user_email'].lower().endswith('@gmail.com'):
            flash("Solo se permiten cuentas Gmail.", "danger")
            return redirect(url_for('login'))

        return f(*args, **kwargs)
    return decorated_function

# -------------------
# Ruta de login (ejemplo básico)
# -------------------
@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        correo = request.form['correo']
        contraseña = request.form['contraseña']

        # ⚠️ Aquí deberías validar contra tu base de datos de usuarios
        if correo.endswith("@gmail.com") and contraseña == "1234":  
            # Guardar sesión
            session['user_id'] = 1
            session['user_email'] = correo
            flash("Inicio de sesión exitoso", "success")
            return redirect(url_for('index'))
        else:
            flash("Credenciales inválidas o no es Gmail", "danger")

    # Renderiza tu login.html
    return render_template('login.html')

# -------------------
# Ruta de logout
# -------------------
@app.route('/logout')
def logout():
    session.clear()
    flash("Sesión cerrada", "info")
    return redirect(url_for('login'))

# -------------------
# Rutas protegidas
# -------------------
@app.route('/')
@gmail_required
def index():
    return render_template('index.html')

@app.route('/carrito_compras')
@gmail_required
def carrito_compras():
    return render_template('carrito_compras.html')

@app.route('/perfil_comprador')
@gmail_required
def perfil_comprador():
    return render_template('perfil_comprador.html')

@app.route('/perfil_vendedor')
@gmail_required
def perfil_vendedor():
    return render_template('perfil_vendedor.html')

# -------------------
# Ejecutar app
# -------------------
if __name__ == "__main__":
    app.run(debug=True)
