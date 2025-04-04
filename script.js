// Función para mostrar mensajes (usa SweetAlert2 si está disponible)
function mostrarMensaje(mensaje, tipo = 'info') {
    if (typeof Swal !== 'undefined') {
        Swal.fire({
            icon: tipo,
            title: mensaje,
            timer: 1500,
            showConfirmButton: false
        });
    } else {
        alert(mensaje);
    }
}

// Función de procesamiento de login
function procesarLogin(e) {
    e.preventDefault();

    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    if (!email || !password) {
        mostrarMensaje('Por favor complete todos los campos', 'error');
        return;
    }

    // Verificar si el usuario existe
    const usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
    const usuario = usuarios.find(user => user.email === email && user.password === password);

    if (usuario) {
        // Inicio de sesión exitoso
        localStorage.setItem('usuarioActual', JSON.stringify(usuario));
        localStorage.setItem('usuarioLogueado', 'true');
        mostrarMensaje('Inicio de sesión exitoso', 'success');

        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1000);
    } else {
        mostrarMensaje('Credenciales incorrectas', 'error');
    }
}

// Estado de autenticación
let usuarioLogueado = localStorage.getItem('usuarioLogueado') === 'true';

// Carrito
let carrito = JSON.parse(localStorage.getItem('carrito')) || [];

// Elementos del DOM
const carritoDOM = document.getElementById('carrito');
const listaCarrito = document.getElementById('lista-carrito');
const totalDOM = document.getElementById('total');
const btnPagar = document.getElementById('pagar-carrito');
const formularioPago = document.getElementById('formulario-pago');

// Actualizar estado de autenticación en la UI
function actualizarEstadoUsuario() {
    const authButtons = document.querySelector('.auth-buttons');
    const navLinks = document.querySelector('.nav-links');
    
    if (usuarioLogueado) {
        const usuarioActual = JSON.parse(localStorage.getItem('usuarioActual'));
        
        // Actualizar botones de autenticación
        authButtons.innerHTML = `
            <span class="usuario">Bienvenido, ${usuarioActual.nombre || 'Usuario'}</span>
            <a href="#" onclick="cerrarSesion()" class="btn-login">Cerrar sesión</a>
        `;

        // Mostrar enlace al catálogo solo para vendedores verificados
        if (usuarioActual.tipo === 'vendedor' && usuarioActual.verificado) {
            const existingCatalogLink = document.querySelector('.nav-links a[href="catalogo.html"]');
            if (!existingCatalogLink) {
                const catalogLink = document.createElement('li');
                catalogLink.innerHTML = '<a href="catalogo.html">MI CATÁLOGO</a>';
                navLinks.insertBefore(catalogLink, navLinks.children[2]);
            }
        } else {
            const catalogLink = document.querySelector('.nav-links a[href="catalogo.html"]');
            if (catalogLink) {
                catalogLink.parentElement.remove();
            }
        }
    } else {
        authButtons.innerHTML = `
            <a href="login.html" class="btn-login">Iniciar Sesión</a>
            <a href="registro.html" class="btn-registro">Registro</a>
        `;
        
        // Ocultar enlace al catálogo si no está logueado
        const catalogLink = document.querySelector('.nav-links a[href="catalogo.html"]');
        if (catalogLink) {
            catalogLink.parentElement.remove();
        }
    }
    actualizarVisibilidadCarrito();
}

// Verificar autenticación
function verificarAutenticacion() {
    if (!usuarioLogueado) {
        if (typeof Swal !== 'undefined') {
            Swal.fire({
                icon: 'warning',
                title: 'Acceso requerido',
                text: 'Debes iniciar sesión para realizar esta acción',
                confirmButtonText: 'Ir a login',
                showCancelButton: true,
            }).then((result) => {
                if (result.isConfirmed) window.location.href = 'login.html';
            });
        } else {
            alert('Debes iniciar sesión para realizar esta acción');
            window.location.href = 'login.html';
        }
        return false;
    }
    return true;
}

// Funciones del carrito
function agregarAlCarrito(producto) {
    if (!verificarAutenticacion()) return;

    const productoExistente = carrito.find(item => item.id === producto.id);
    if (productoExistente) {
        productoExistente.cantidad++;
    } else {
        carrito.push({ ...producto, cantidad: 1 });
    }
    guardarCarrito();
    actualizarCarrito();
}

function eliminarDelCarrito(id) {
    carrito = carrito.filter(item => item.id !== id);
    guardarCarrito();
    actualizarCarrito();
}

function vaciarCarrito() {
    carrito = [];
    guardarCarrito();
    actualizarCarrito();
}

function guardarCarrito() {
    localStorage.setItem('carrito', JSON.stringify(carrito));
}

function actualizarCarrito() {
    listaCarrito.innerHTML = '';
    let total = 0;

    carrito.forEach(item => {
        const li = document.createElement('li');
        li.innerHTML = `
            ${item.nombre} x${item.cantidad}
            <span>$${item.precio * item.cantidad} MXN</span>
            <button onclick="eliminarDelCarrito('${item.id}')" class="eliminar-item">×</button>
        `;
        listaCarrito.appendChild(li);
        total += item.precio * item.cantidad;
    });

    totalDOM.textContent = total;
    actualizarVisibilidadCarrito();
}

function actualizarVisibilidadCarrito() {
    carritoDOM.style.display = usuarioLogueado && carrito.length > 0 ? 'block' : 'none';
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    actualizarEstadoUsuario();
    actualizarCarrito();

    document.querySelectorAll('.agregar-carrito').forEach(button => {
        button.addEventListener('click', () => {
            const productoElem = button.closest('.producto');
            const producto = {
                id: productoElem.dataset.id,
                nombre: productoElem.dataset.nombre,
                precio: parseFloat(productoElem.dataset.precio)
            };
            agregarAlCarrito(producto);
        });
    });

    const btnVaciar = document.getElementById('vaciar-carrito');
    if (btnVaciar) {
        btnVaciar.addEventListener('click', vaciarCarrito);
    }

    if (btnPagar && formularioPago) {
        btnPagar.addEventListener('click', () => {
            formularioPago.style.display = 'block';
            window.scrollTo(0, document.body.scrollHeight);
        });
    }

    const formPago = document.getElementById('form-pago');
    if (formPago) {
        formPago.addEventListener('submit', (e) => {
            e.preventDefault();
            procesarPago(e);
        });
    }
});

// Funciones de autenticación
function cerrarSesion() {
    localStorage.removeItem('usuarioLogueado');
    localStorage.removeItem('usuarioActual');
    usuarioLogueado = false;
    actualizarEstadoUsuario();
    vaciarCarrito();
    window.location.reload();
}

// Función para procesar el pago
function procesarPago(e) {
    e.preventDefault();

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

        // Ocultar formulario de pago
        if (formularioPago) {
            formularioPago.style.display = 'none';
        }

        // Cerrar carrito (quita clase active si la tiene)
        const carritoElement = document.getElementById('carrito');
        if (carritoElement) {
            carritoElement.classList.remove('active');
        }
    }, 2000);
}
