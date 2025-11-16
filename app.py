from flask import Flask, render_template, request, redirect, url_for, flash, session, jsonify
from werkzeug.security import generate_password_hash, check_password_hash
import os
from conexion import db  # Importar la conexión MySQL

app = Flask(__name__)
app.secret_key = 'tu_clave_secreta_aqui'  # Cambia esto por una clave secreta segura


def init_db():
    """Función para inicializar la base de datos si es necesario"""
    # Verificar conexión
    if db.connect():
        print("Conexión a MySQL establecida correctamente")
    else:
        print("Error al conectar con MySQL")


@app.route('/')
def index():
    """Página principal"""
    return render_template('index.html')


@app.route('/login', methods=['GET', 'POST'])
def login():
    """Página de inicio de sesión"""
    if request.method == 'POST':
        correo = request.form.get('correo')
        contraseña = request.form.get('contraseña')
        
        if not correo or not contraseña:
            flash('Por favor completa todos los campos', 'error')
            return render_template('login.html')
        
        # Usar nombres de columna correctos de tu BD MySQL
        query = 'SELECT * FROM usuarios WHERE correo = %s'
        users = db.execute_query(query, (correo,))
        
        if users and len(users) > 0:
            user = users[0]
            # Usar 'password_hash' en lugar de 'contraseña'
            if check_password_hash(user['password_hash'], contraseña):
                session['user_id'] = user['id_usuario']
                session['user_name'] = user['nombre']
                session['user_role'] = user['rol']
                flash('Inicio de sesión exitoso', 'success')
                return redirect(url_for('index'))
        
        flash('Credenciales incorrectas', 'error')
    
    return render_template('login.html')


@app.route('/registrar', methods=['GET', 'POST'])
def registrar():
    """Página de registro"""
    if request.method == 'POST':
        nombre = request.form.get('nombre')
        apellido = request.form.get('apellido')
        correo = request.form.get('correo')
        telefono = request.form.get('telefono')
        contraseña = request.form.get('contraseña')
        confirm_password = request.form.get('confirm_password')
        rol = request.form.get('rol', 'COMPRADOR')  # Usar valores ENUM de tu BD
        direccion = request.form.get('direccion')
        
        # Validaciones
        if not all([nombre, apellido, correo, contraseña]):
            flash('Por favor completa todos los campos obligatorios', 'error')
            return render_template('registrar.html')
        
        if contraseña != confirm_password:
            flash('Las contraseñas no coinciden', 'error')
            return render_template('registrar.html')
        
        if len(contraseña) < 6:
            flash('La contraseña debe tener al menos 6 caracteres', 'error')
            return render_template('registrar.html')
        
        # Verificar si el usuario ya existe
        check_query = 'SELECT id_usuario FROM usuarios WHERE correo = %s'
        existing_users = db.execute_query(check_query, (correo,))
        
        if existing_users and len(existing_users) > 0:
            flash('Ya existe una cuenta con este correo electrónico', 'error')
            return render_template('registrar.html')
        
        # Crear nuevo usuario
        hashed_password = generate_password_hash(contraseña)
        
        # Mapear roles del formulario a valores ENUM de la BD
        rol_mapping = {
            'cliente': 'COMPRADOR',
            'vendedor': 'VENDEDOR'
        }
        rol_bd = rol_mapping.get(rol, 'COMPRADOR')
        
        insert_query = '''
            INSERT INTO usuarios (nombre, apellido, correo, telefono, password_hash, rol, direccion)
            VALUES (%s, %s, %s, %s, %s, %s, %s)
        '''
        
        user_id = db.execute_insert(insert_query, 
            (nombre, apellido, correo, telefono, hashed_password, rol_bd, direccion))
        
        if user_id:
            flash('Cuenta creada exitosamente', 'success')
            return redirect(url_for('login'))
        else:
            flash('Error al crear la cuenta. Inténtalo de nuevo.', 'error')
            return render_template('registrar.html')
    
    return render_template('registrar.html')


@app.route('/logout')
def logout():
    """Cerrar sesión"""
    session.clear()
    flash('Sesión cerrada exitosamente', 'success')
    return redirect(url_for('index'))


@app.route('/perfil_comprador')
def perfil_comprador():
    """Página de perfil del comprador"""
    if 'user_id' not in session:
        flash('Debes iniciar sesión para acceder a esta página', 'error')
        return redirect(url_for('login'))
    return render_template('perfil_comprador.html')


@app.route('/carrito_compras')
def carrito_compras():
    """Página del carrito de compras"""
    if 'user_id' not in session:
        flash('Debes iniciar sesión para acceder a esta página', 'error')
        return redirect(url_for('login'))
    return render_template('carrito_compras.html')


@app.route('/productos')
def productos():
    """Página de productos"""
    query = '''
        SELECT p.*, u.nombre as vendedor_nombre 
        FROM productos p 
        JOIN usuarios u ON p.id_vendedor = u.id_usuario 
        WHERE p.estado = 'PUBLICADO'
        ORDER BY p.id_producto DESC
    '''
    productos = db.execute_query(query)
    return render_template('productos.html', productos=productos)


@app.route('/api/productos')
def api_productos():
    """API para obtener productos"""
    query = '''
        SELECT p.*, u.nombre as vendedor_nombre 
        FROM productos p 
        JOIN usuarios u ON p.id_vendedor = u.id_usuario 
        WHERE p.estado = 'PUBLICADO'
        ORDER BY p.id_producto DESC
    '''
    productos = db.execute_query(query)
    
    productos_list = []
    for producto in productos:
        productos_list.append({
            'id': producto['id_producto'],
            'nombre': producto['nombre'],
            'descripcion': producto['descripcion'],
            'precio': float(producto['precio']) if producto['precio'] else 0,
            'categoria': producto['categoria'],
            'vendedor': producto['vendedor_nombre']
        })
    
    return jsonify(productos_list)


if __name__ == '__main__':
    # Crear las carpetas necesarias si no existen
    os.makedirs('static/css', exist_ok=True)
    os.makedirs('static/js', exist_ok=True)
    os.makedirs('static/imagenes', exist_ok=True)
    os.makedirs('templates', exist_ok=True)
    
    # Inicializar la base de datos
    init_db()
    
    # Ejecutar la aplicación
    app.run(debug=True)