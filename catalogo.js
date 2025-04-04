document.addEventListener('DOMContentLoaded', function() {
    // Verificar si el usuario es vendedor
    const usuarioActual = JSON.parse(localStorage.getItem('usuarioActual'));
    if (!usuarioActual || usuarioActual.tipo !== 'vendedor') {
        window.location.href = 'index.html';
        return;
    }

    // Elementos del DOM
    const formProducto = document.getElementById('form-producto');
    const listaProductos = document.getElementById('lista-productos');

    // Cargar productos del vendedor
    cargarProductos();

    // Evento para agregar producto
    formProducto.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const producto = {
            id: Date.now().toString(),
            vendedor: usuarioActual.email,
            nombre: document.getElementById('nombre-producto').value,
            descripcion: document.getElementById('descripcion').value,
            precio: parseFloat(document.getElementById('precio').value),
            imagen: document.getElementById('imagen').value || 'images/producto-default.png',
            categoria: document.getElementById('categoria').value
        };

        agregarProducto(producto);
        formProducto.reset();
    });

    // Función para cargar productos
    function cargarProductos() {
        const productos = JSON.parse(localStorage.getItem('productos')) || [];
        const misProductos = productos.filter(p => p.vendedor === usuarioActual.email);
        
        listaProductos.innerHTML = '';
        
        if (misProductos.length === 0) {
            listaProductos.innerHTML = '<p>No tienes productos registrados aún.</p>';
            return;
        }

        misProductos.forEach(producto => {
            const productoElement = document.createElement('div');
            productoElement.className = 'producto-vendedor';
            productoElement.innerHTML = `
                <img src="${producto.imagen}" alt="${producto.nombre}">
                <h3>${producto.nombre}</h3>
                <p>${producto.descripcion}</p>
                <p>$${producto.precio} MXN</p>
                <button class="btn-eliminar" data-id="${producto.id}">Eliminar</button>
            `;
            listaProductos.appendChild(productoElement);
        });

        // Agregar eventos a botones de eliminar
        document.querySelectorAll('.btn-eliminar').forEach(btn => {
            btn.addEventListener('click', function() {
                eliminarProducto(this.dataset.id);
            });
        });
    }

    // Función para agregar producto
    function agregarProducto(producto) {
        const productos = JSON.parse(localStorage.getItem('productos')) || [];
        productos.push(producto);
        localStorage.setItem('productos', JSON.stringify(productos));
        
        Swal.fire({
            icon: 'success',
            title: 'Producto agregado',
            text: 'Tu producto ha sido registrado exitosamente'
        });
        
        cargarProductos();
    }

    // Función para eliminar producto
    function eliminarProducto(id) {
        Swal.fire({
            title: '¿Eliminar producto?',
            text: "Esta acción no se puede deshacer",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Sí, eliminar'
        }).then((result) => {
            if (result.isConfirmed) {
                const productos = JSON.parse(localStorage.getItem('productos')) || [];
                const nuevosProductos = productos.filter(p => p.id !== id);
                localStorage.setItem('productos', JSON.stringify(nuevosProductos));
                
                Swal.fire(
                    'Eliminado',
                    'El producto ha sido eliminado',
                    'success'
                );
                
                cargarProductos();
            }
        });
    }
});