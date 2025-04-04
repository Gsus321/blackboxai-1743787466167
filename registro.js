// ARTMEXA Registration System
class RegistrationSystem {
    constructor() {
      this.init();
    }
  
    init() {
      this.form = document.getElementById('registro-form');
      if (!this.form) return;
      
      this.form.addEventListener('submit', (e) => this.handleSubmit(e));
    }
  
    handleSubmit(event) {
      event.preventDefault();
      const formData = this.getFormData();
      
      if (!this.validateForm(formData)) return;
      
      if (formData.tipo === 'vendedor') {
        this.showVendorForm(formData);
      } else {
        this.registerUser(formData);
      }
    }
  
    getFormData() {
      return {
        nombre: document.getElementById('nombre').value,
        email: document.getElementById('email').value,
        password: document.getElementById('password').value,
        confirmPassword: document.getElementById('confirmar-password').value,
        tipo: document.getElementById('tipo').value
      };
    }
  
    validateForm(data) {
      if (data.password !== data.confirmPassword) {
        this.showError('Las contraseñas no coinciden');
        return false;
      }
  
      if (data.password.length < 8) {
        this.showError('La contraseña debe tener al menos 8 caracteres');
        return false;
      }
  
      const users = JSON.parse(localStorage.getItem('usuarios')) || [];
      if (users.some(user => user.email === data.email)) {
        this.showError('Este correo ya está registrado');
        return false;
      }
  
      return true;
    }
  
    showVendorForm(baseData) {
      Swal.fire({
        title: 'Datos de Vendedor',
        html: `
          <input id="identificacion" class="swal2-input" placeholder="Identificación" required>
          <input id="telefono" class="swal2-input" placeholder="Teléfono" required>
          <textarea id="direccion" class="swal2-textarea" placeholder="Dirección" required></textarea>
        `,
        focusConfirm: false,
        preConfirm: () => ({
          identificacion: document.getElementById('identificacion').value,
          telefono: document.getElementById('telefono').value,
          direccion: document.getElementById('direccion').value
        })
      }).then(result => {
        if (result.isConfirmed) {
          if (!result.value.identificacion) {
            this.showError('Identificación requerida');
            return;
          }
          this.registerUser({...baseData, vendorData: result.value});
        }
      });
    }
  
    registerUser(data) {
      const user = this.createUser(data);
      this.saveUser(user);
      this.showSuccess(user);
      this.redirectUser(user);
    }
  
    createUser(data) {
      const user = {
        nombre: data.nombre,
        email: data.email,
        password: data.password,
        tipo: data.tipo,
        fechaRegistro: new Date().toISOString()
      };
  
      if (data.tipo === 'vendedor') {
        user.datosVendedor = data.vendorData;
        user.verificado = false;
        user.productos = [];
      }
  
      return user;
    }
  
    saveUser(user) {
      const users = JSON.parse(localStorage.getItem('usuarios')) || [];
      users.push(user);
      localStorage.setItem('usuarios', JSON.stringify(users));
      localStorage.setItem('usuarioActual', JSON.stringify(user));
    }
  
    showSuccess(user) {
      const message = user.tipo === 'vendedor'
        ? 'Tu cuenta de vendedor está en verificación'
        : '¡Registro exitoso!';
        
      Swal.fire({
        icon: 'success',
        title: message,
        timer: 3000
      });
    }
  
    redirectUser(user) {
      setTimeout(() => {
        window.location.href = user.tipo === 'vendedor' && user.verificado
          ? 'catalogo.html'
          : 'index.html';
      }, 1000);
    }
  
    showError(message) {
      Swal.fire('Error', message, 'error');
    }
  }
  
  // Initialize when DOM is ready
  document.addEventListener('DOMContentLoaded', () => new RegistrationSystem());
  