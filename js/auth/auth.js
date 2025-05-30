// js/auth/auth.js
const Auth = {
  currentUser: null,

  init: function() {
    // Crear usuario de prueba si no existe
    this.createTestUser();
    
    // Verificar si hay una sesión activa
    try {
      const savedUser = localStorage.getItem('marvel_current_user');
      if (savedUser) {
        const userData = JSON.parse(savedUser);
        this.currentUser = new User(userData);
        this.showMainApp();
      } else {
        this.showLogin();
      }
    } catch (e) {
      console.log('No localStorage available, showing login');
      this.showLogin();
    }

    this.bindEvents();
  },

  createTestUser: function() {
    try {
      const users = JSON.parse(localStorage.getItem('marvel_users') || '{}');
      if (!users['admin']) {
        users['admin'] = {
          username: 'admin',
          email: 'admin@marvel.com',
          password: '123456',
          favorites: []
        };
        localStorage.setItem('marvel_users', JSON.stringify(users));
        console.log('Usuario de prueba creado: admin / 123456');
      }
    } catch (e) {
      console.log('Could not create test user:', e);
    }
  },

  bindEvents: function() {
    // Login form
    $('#login-form').on('submit', (e) => {
      e.preventDefault();
      this.handleLogin();
    });

    // Register form
    $('#register-form').on('submit', (e) => {
      e.preventDefault();
      this.handleRegister();
    });

    // Toggle between login and register
    $('#show-register').on('click', (e) => {
      e.preventDefault();
      this.showRegister();
    });

    $('#show-login').on('click', (e) => {
      e.preventDefault();
      this.showLogin();
    });

    // Logout
    $('#logout-btn').on('click', () => {
      this.logout();
    });
  },

  handleLogin: function() {
    const username = $('#username').val().trim();
    const password = $('#password').val();

    if (!username || !password) {
      alert('Por favor completa todos los campos');
      return;
    }

    // Simular autenticación (en una app real sería una API)
    try {
      const users = JSON.parse(localStorage.getItem('marvel_users') || '{}');
      const savedUser = users[username];

      if (savedUser && savedUser.password === password) {
        this.currentUser = new User({
          username: savedUser.username,
          email: savedUser.email,
          favorites: savedUser.favorites || []
        });
        this.saveCurrentSession();
        this.showMainApp();
      } else {
        alert('Usuario o contraseña incorrectos');
      }
    } catch (e) {
      console.log('Error accessing localStorage:', e);
      // Para testing sin localStorage, crear usuario temporal
      this.currentUser = new User({
        username: username,
        email: 'test@example.com',
        favorites: []
      });
      this.showMainApp();
    }
  },

  handleRegister: function() {
    const username = $('#reg-username').val().trim();
    const email = $('#reg-email').val().trim();
    const password = $('#reg-password').val();
    const confirmPassword = $('#reg-confirm-password').val();

    if (!username || !email || !password || !confirmPassword) {
      alert('Por favor completa todos los campos');
      return;
    }

    if (password !== confirmPassword) {
      alert('Las contraseñas no coinciden');
      return;
    }

    if (password.length < 6) {
      alert('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    try {
      // Verificar si el usuario ya existe
      const users = JSON.parse(localStorage.getItem('marvel_users') || '{}');
      if (users[username]) {
        alert('El nombre de usuario ya existe');
        return;
      }

      // Crear nuevo usuario
      const newUser = {
        username: username,
        email: email,
        password: password,
        favorites: []
      };

      users[username] = newUser;
      localStorage.setItem('marvel_users', JSON.stringify(users));

      this.currentUser = new User({
        username: newUser.username,
        email: newUser.email,
        favorites: newUser.favorites
      });
      this.saveCurrentSession();
      this.showMainApp();
    } catch (e) {
      console.log('Error accessing localStorage:', e);
      // Para testing sin localStorage, crear usuario temporal
      this.currentUser = new User({
        username: username,
        email: email,
        favorites: []
      });
      this.showMainApp();
    }
  },

  saveCurrentSession: function() {
    try {
      const userData = {
        username: this.currentUser.get('username'),
        email: this.currentUser.get('email'),
        favorites: this.currentUser.get('favorites')
      };
      localStorage.setItem('marvel_current_user', JSON.stringify(userData));
    } catch (e) {
      console.log('Could not save session to localStorage:', e);
    }
  },

  logout: function() {
    this.currentUser = null;
    try {
      localStorage.removeItem('marvel_current_user');
    } catch (e) {
      console.log('Could not clear localStorage:', e);
    }
    this.showLogin();
    
    // Limpiar la aplicación
    $('#comics-container').empty();
    $('#favorites-container').empty();
  },

  showLogin: function() {
    $('#login-container').removeClass('hidden');
    $('#register-container').addClass('hidden');
    $('#main-app').addClass('hidden');
    
    // Limpiar campos
    $('#username, #password').val('');
  },

  showRegister: function() {
    $('#login-container').addClass('hidden');
    $('#register-container').removeClass('hidden');
    $('#main-app').addClass('hidden');
    
    // Limpiar campos
    $('#reg-username, #reg-email, #reg-password, #reg-confirm-password').val('');
  },

  showMainApp: function() {
    $('#login-container').addClass('hidden');
    $('#register-container').addClass('hidden');
    $('#main-app').removeClass('hidden');
    
    // Mostrar nombre del usuario
    $('#current-user').text(this.currentUser.get('username'));
  },

  getCurrentUser: function() {
    return this.currentUser;
  }
};