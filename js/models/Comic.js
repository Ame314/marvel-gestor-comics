// js/models/Comic.js
const Comic = Backbone.Model.extend({
  defaults: {
    id: null,
    title: '',
    description: '',
    thumbnail: {
      path: '',
      extension: ''
    },
    images: [],
    creators: [],
    characters: []
  },

  initialize: function() {
    // Constructor del modelo Comic
  },

  getImageUrl: function() {
    const thumbnail = this.get('thumbnail');
    if (thumbnail && thumbnail.path && thumbnail.extension) {
      return `${thumbnail.path}.${thumbnail.extension}`;
    }
    return 'https://via.placeholder.com/150x225?text=No+Image';
  },

  getDescription: function() {
    const description = this.get('description');
    return description || 'Sin descripción disponible.';
  }
});