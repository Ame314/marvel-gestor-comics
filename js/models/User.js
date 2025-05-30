// js/models/User.js
const User = Backbone.Model.extend({
  defaults: {
    username: '',
    email: '',
    favorites: []
  },

  initialize: function() {
    // Asegurar que favorites sea siempre un array
    if (!this.get('favorites')) {
      this.set('favorites', []);
    }
  },

  addFavorite: function(comicId) {
    const favorites = this.get('favorites') || [];
    if (!favorites.includes(comicId)) {
      favorites.push(comicId);
      this.set('favorites', favorites);
      this.saveToStorage();
    }
  },

  removeFavorite: function(comicId) {
    const favorites = this.get('favorites') || [];
    const newFavorites = favorites.filter(id => id !== comicId);
    this.set('favorites', newFavorites);
    this.saveToStorage();
  },

  isFavorite: function(comicId) {
    const favorites = this.get('favorites') || [];
    return favorites.includes(comicId);
  },

  saveToStorage: function() {
    try {
      const userData = {
        username: this.get('username'),
        email: this.get('email'),
        favorites: this.get('favorites'),
        password: this.get('password') // Mantener la contraseña para persistencia
      };
      
      // Actualizar en la base de datos de usuarios
      const users = JSON.parse(localStorage.getItem('marvel_users') || '{}');
      users[this.get('username')] = userData;
      localStorage.setItem('marvel_users', JSON.stringify(users));
      
      // Actualizar sesión actual
      const currentUserData = {
        username: this.get('username'),
        email: this.get('email'),
        favorites: this.get('favorites')
      };
      localStorage.setItem('marvel_current_user', JSON.stringify(currentUserData));
    } catch (e) {
      console.log('Error saving to localStorage:', e);
    }
  }
});