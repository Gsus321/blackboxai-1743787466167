localStorage.setItem('usuarios', JSON.stringify([{
    nombre: "Vendedor Test",
    email: "vendedor@test.com",
    password: "test123",
    tipo: "vendedor",
    verificado: true,
    datosVendedor: {
        identificacion: "TEST123",
        telefono: "5512345678",
        direccion: "Test Address"
    },
    productos: []
}]));

localStorage.setItem('usuarioActual', JSON.stringify({
    nombre: "Vendedor Test",
    email: "vendedor@test.com",
    tipo: "vendedor",
    verificado: true
}));

localStorage.setItem('usuarioLogueado', 'true');
