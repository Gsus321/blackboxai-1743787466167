// Variables globales
let carrito = [];
let totalCarrito = 0;

// Esperar a que cargue el DOM
document.addEventListener('DOMContentLoaded', function() {
    // Cargar carrito desde localStorage si existe
    cargarCarrito();
    
    // Actualizar contador del carrito
    actualizarContadorCarrito();
    
    // Detectar botones de agregar al carrito
    const botonesAgregar = document.querySelectorAll('.agregar-carrito');
    botonesAgregar.forEach(boton => {
        boton.addEventListener('click', function() {
            const producto = this.parentElement;
            const id = producto.dataset.id;
            const nombre = producto.dataset.nombre;
            const precio = parseFloat(producto.dataset.precio);
            
            agregarAlCarrito(id, nombre, precio);
        });
    });
    
    // Botón de ver carrito
    const botonVerCarrito = document.getElementById('ver-carrito');
    if (botonVerCarrito) {
        botonVerCarrito.addEventListener('click', toggleCarrito);
    }
    
    // Botón de vaciar carrito
    const botonVaciarCarrito = document.getElementById('vaciar-carrito');
    if (botonVaciarCarrito) {
        botonVaciarCarrito.addEventListener('click', vaciarCarrito);
    }
    
    // Botón de pagar carrito
    const botonPagarCarrito = document.getElementById('pagar-carrito');
    if (botonPagarCarrito) {
        botonPagarCarrito.addEventListener('click', mostrarFormularioPago);
    }
    
    // Formulario de pago
    const formPago = document.getElementById('form-pago');
    if (formPago) {
        formPago.addEventListener('submit', procesarPago);
    }
    
    // Formularios de login y registro
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', procesarLogin);
    }
    
    const registroForm = document.getElementById('registro-form');
    if (registroForm) {
        registroForm.addEventListener('submit', procesarRegistro);
    }
    
    // Botones de autenticación
    actualizarBotonesAuth();
});

// Funciones del carrito
function agregarAlCarrito(id, nombre, precio) {
    // Verificar si el producto ya está en el carrito
    const productoExistente = carrito.find(item => item.id === id);
    
    if (productoExistente) {
        productoExistente.cantidad++;
    } else {
        carrito.push({
            id: id,
            nombre: nombre,
            precio: precio,
            cantidad: 1
        });
    }
    
    // Actualizar el carrito en localStorage
    guardarCarrito();
    
    // Actualizar la interfaz
    actualizarContadorCarrito();
    actualizarListaCarrito();
    
    // Mostrar mensaje de confirmación
    mostrarMensaje(`${nombre} agregado al carrito`);
}

function actualizarContadorCarrito() {
    const contador = document.querySelector('.contador-carrito');
    if (contador) {
        let cantidadTotal = 0;
        carrito.forEach(item => {
            cantidadTotal += item.cantidad;
        });
        contador.textContent = cantidadTotal;
    }
}

function actualizarListaCarrito() {
    const listaCarrito = document.getElementById('lista-carrito');
    const totalElement = document.getElementById('total');
    const totalPagoElement = document.getElementById('total-pago');
    
    if (listaCarrito) {
        // Limpiar lista
        listaCarrito.innerHTML = '';
        
        // Calcular total
        totalCarrito = 0;
        
        // Agregar items al carrito
        carrito.forEach(item => {
            const subtotal = item.precio * item.cantidad;
            totalCarrito += subtotal;
            
            const li = document.createElement('li');
            li.innerHTML = `
                <div class="item-carrito">
                    <span>${item.nombre}</span>
                    <div>
                        <button class="btn-cantidad" data-id="${item.id}" data-action="restar">-</button>
                        <span>${item.cantidad}</span>
                        <button class="btn-cantidad" data-id="${item.id}" data-action="sumar">+</button>
                    </div>
                    <span>$${subtotal.toFixed(2)} MXN</span>
                </div>
            `;
            listaCarrito.appendChild(li);
        });
        
        // Agregar eventos para botones de cantidad
        const botonesCantidad = document.querySelectorAll('.btn-cantidad');
        botonesCantidad.forEach(boton => {
            boton.addEventListener('click', function() {
                const id = this.dataset.id;
                const accion = this.dataset.action;
                actualizarCantidad(id, accion);
            });
        });
        
        // Actualizar total
        if (totalElement) {
            totalElement.textContent = totalCarrito.toFixed(2);
        }
        
        // Actualizar total en formulario de pago
        if (totalPagoElement) {
            totalPagoElement.textContent = totalCarrito.toFixed(2);
        }
    }
}

function actualizarCantidad(id, accion) {
    const productoIndex = carrito.findIndex(item => item.id === id);
    
    if (productoIndex !== -1) {
        if (accion === 'sumar') {
            carrito[productoIndex].cantidad++;
        } else if (accion === 'restar') {
            carrito[productoIndex].cantidad--;
            
            // Eliminar producto si cantidad es 0
            if (carrito[productoIndex].cantidad <= 0) {
                carrito.splice(productoIndex, 1);
            }
        }
        
        // Actualizar carrito
        guardarCarrito();
        actualizarContadorCarrito();
        actualizarListaCarrito();
    }
}

function vaciarCarrito() {
    carrito = [];
    guardarCarrito();
    actualizarContadorCarrito();
    actualizarListaCarrito();
    mostrarMensaje('Carrito vaciado');
}

function toggleCarrito() {
    const carritoElement = document.getElementById('carrito');
    if (carritoElement) {
        carritoElement.classList.toggle('active');
        
        // Ocultar formulario de pago si el carrito se cierra
        if (!carritoElement.classList.contains('active')) {
            const formularioPago = document.getElementById('formulario-pago');
            if (formularioPago) {
                formularioPago.style.display = 'none';
            }
        }
    }
}

function mostrarFormularioPago() {
    if (carrito.length === 0) {
        mostrarMensaje('El carrito está vacío');
        return;
    }
    
    const formularioPago = document.getElementById('formulario-pago');
    if (formularioPago) {
        formularioPago.style.display = 'block';
    }
}

function procesarPago(e) {
    e.preventDefault();
    
    // Validar formulario
    const numeroTarjeta = document.getElementById('numero-tarjeta').value;
    const fechaExpiracion = document.getElementById('fecha-expiracion').value;
    const cvv = document.getElementById('cvv').value;
    
    if (!numeroTarjeta || !fechaExpiracion || !cvv) {
        mostrarMensaje('Por favor complete todos los campos', 'error');
        return;
    }
    
    // Simular procesamiento de pago
    mostrarMensaje('Procesando pago...');
    
    // Simular respuesta exitosa
    setTimeout(() => {
        mostrarMensaje('¡Pago completado con éxito!', 'success');
        
        // Limpiar carrito
        vaciarCarrito();
        
        // Ocultar formulario
        const formularioPago = document.getElementById('formulario-pago');
        if (formularioPago) {
            formularioPago.style.display = 'none';
        }
        
        // Cerrar carrito
        const carritoElement = document.getElementById('carrito');
        if (carritoElement) {
            carritoElement.classList.remove('active');
        }
    }, 2000);
}

// Funciones de autenticación
function procesarLogin(e) {
    e.preventDefault();
    
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    
    if (!email || !password) {
        mostrarMensaje('Por favor complete todos los campos', 'error');
        return;
    }
    
    // Simular inicio de sesión exitoso
    localStorage.setItem('usuarioActual', JSON.stringify({
        email: email,
        tipo: 'comprador'
    }));
    
    mostrarMensaje('Inicio de sesión exitoso', 'success');
    
    // Redireccionar después de 1 segundo
    setTimeout(() => {
        window.location.href = 'index.html';
    }, 1000);
}

function procesarRegistro(e) {
    e.preventDefault();
    
    const nombre = document.getElementById('nombre').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const tipo = document.getElementById('tipo').value;
    
    if (!nombre || !email || !password) {
        mostrarMensaje('Por favor complete todos los campos', 'error');
        return;
    }
    
    // Simular registro exitoso
    const usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
    
    // Verificar si el email ya está registrado
    if (usuarios.some(user => user.email === email)) {
        mostrarMensaje('Este correo ya está registrado', 'error');
        return;
    }
    
    // Agregar usuario
    usuarios.push({
        nombre: nombre,
        email: email,
        password: password, // En producción, esto debería estar encriptado
        tipo: tipo
    });
    
    localStorage.setItem('usuarios', JSON.stringify(usuarios));
    
    // Iniciar sesión automáticamente
    localStorage.setItem('usuarioActual', JSON.stringify({
        nombre: nombre,
        email: email,
        tipo: tipo
    }));
    
    mostrarMensaje('Registro exitoso', 'success');
    
    // Redireccionar después de 1 segundo
    setTimeout(() => {
        window.location.href = 'index.html';
    }, 1000);
}

function cerrarSesion() {
    localStorage.removeItem('usuarioActual');
    mostrarMensaje('Sesión cerrada');
    actualizarBotonesAuth();
    
    // Si estamos en una página que requiere autenticación, redireccionar
    const paginasProtegidas = ['perfil.html'];
    const paginaActual = window.location.pathname.split('/').pop();
    
    if (paginasProtegidas.includes(paginaActual)) {
        window.location.href = 'index.html';
    }
}

function actualizarBotonesAuth() {
    const authButtonsContainer = document.querySelector('.auth-buttons');
    if (!authButtonsContainer) return;
    
    const usuarioActual = JSON.parse(localStorage.getItem('usuarioActual'));
    
    if (usuarioActual) {
        // Usuario autenticado
        authButtonsContainer.innerHTML = `
            <span>Hola, ${usuarioActual.nombre || usuarioActual.email}</span>
            <button class="btn-cerrar-sesion">Cerrar Sesión</button>
        `;
        
        // Agregar evento al botón de cerrar sesión
        const btnCerrarSesion = document.querySelector('.btn-cerrar-sesion');
        if (btnCerrarSesion) {
            btnCerrarSesion.addEventListener('click', cerrarSesion);
        }
    } else {
        // Usuario no autenticado
        authButtonsContainer.innerHTML = `
            <a href="login.html" class="btn-auth">Iniciar Sesión</a>
            <a href="registro.html" class="btn-auth">Registrarse</a>
        `;
    }
}

// Funciones de utilidad
function mostrarMensaje(mensaje, tipo = 'info') {
    if (typeof Swal !== 'undefined') {
        // Usar SweetAlert2 si está disponible
        Swal.fire({
            title: mensaje,
            icon: tipo,
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 3000
        });
    } else {
        // Usar alert como fallback
        alert(mensaje);
    }
}

function guardarCarrito() {
    localStorage.setItem('carrito', JSON.stringify(carrito));
}

function cargarCarrito() {
    const carritoGuardado = localStorage.getItem('carrito');
    if (carritoGuardado) {
        carrito = JSON.parse(carritoGuardado);
        actualizarListaCarrito();
    }
}