// js/view/verDetalles.js
const VerDetallesView = Backbone.View.extend({
  tagName: "div",
  className: "detalles-comic",

  initialize: function(options) {
    this.comic = options.comic;
  },

  events: {
    "click .cerrar-detalles": "cerrarDetalles",
    "click .favorite-detail-btn": "toggleFavorite"
  },

  render: function() {
    const comic = this.comic;
    const title = comic.get("title");
    const description = comic.getDescription();
    const imageUrl = comic.getImageUrl();
    const comicId = comic.get("id");

    // Verificar si es favorito
    const user = Auth.getCurrentUser();
    const isFavorite = user ? user.isFavorite(comicId) : false;
    const favText = isFavorite ? '❤️ Quitar de Favoritos' : '🤍 Agregar a Favoritos';
    const favClass = isFavorite ? 'favorited' : '';

    this.$el.html(`
      <div class="detalle-card">
        <h2>${title}</h2>
        <img src="${imageUrl}" alt="${title}" width="300">
        <p>${description}</p>
        <div class="detail-actions">
          <button class="favorite-detail-btn ${favClass}" data-id="${comicId}">${favText}</button>
          <button class="cerrar-detalles">Cerrar</button>
        </div>
      </div>
    `);

    return this;
  },

  toggleFavorite: function(e) {
    e.preventDefault();
    const comicId = parseInt($(e.target).data('id'));
    const user = Auth.getCurrentUser();
    
    if (!user) return;

    if (user.isFavorite(comicId)) {
      user.removeFavorite(comicId);
      $(e.target).html('🤍 Agregar a Favoritos').removeClass('favorited');
    } else {
      user.addFavorite(comicId);
      $(e.target).html('❤️ Quitar de Favoritos').addClass('favorited');
    }

    // Actualizar otros botones de favoritos en la página
    Favorites.updateFavoriteButtons(comicId);
  },

  cerrarDetalles: function() {
    this.remove();
    $("#comics-container").show();
    $("#pagination-controls").show();
  }
});