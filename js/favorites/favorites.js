// js/favorites/favorites.js
const Favorites = {
  init: function() {
    this.bindEvents();
  },

  bindEvents: function() {
    // Botón para mostrar favoritos
    $('#favorites-btn').on('click', () => {
      this.showFavoritesModal();
    });

    // Cerrar modal de favoritos
    $('.close-modal, #favorites-modal').on('click', (e) => {
      if (e.target === e.currentTarget || $(e.target).hasClass('close-modal')) {
        this.hideFavoritesModal();
      }
    });

    // Event delegation para botones de favoritos en las cards
    $('body').on('click', '.fav-btn', (e) => {
      e.stopPropagation();
      const comicId = parseInt($(e.target).data('id'));
      this.toggleFavorite(comicId);
    });

    // Event delegation para botones de favoritos en detalles
    $('body').on('click', '.favorite-detail-btn', (e) => {
      const comicId = parseInt($(e.target).data('id'));
      this.toggleFavorite(comicId);
      this.updateFavoriteButton($(e.target), comicId);
    });
  },

  toggleFavorite: function(comicId) {
    const user = Auth.getCurrentUser();
    if (!user) return;

    if (user.isFavorite(comicId)) {
      user.removeFavorite(comicId);
    } else {
      user.addFavorite(comicId);
    }

    // Actualizar UI
    this.updateFavoriteButtons(comicId);
  },

  updateFavoriteButtons: function(comicId) {
    const user = Auth.getCurrentUser();
    if (!user) return;

    const isFav = user.isFavorite(comicId);
    const buttons = $(`.fav-btn[data-id="${comicId}"], .favorite-detail-btn[data-id="${comicId}"]`);
    
    buttons.each(function() {
      const $btn = $(this);
      if (isFav) {
        $btn.html('❤️').addClass('favorited');
      } else {
        $btn.html('🤍').removeClass('favorited');
      }
    });
  },

  updateFavoriteButton: function($button, comicId) {
    const user = Auth.getCurrentUser();
    if (!user) return;

    const isFav = user.isFavorite(comicId);
    if (isFav) {
      $button.html('❤️ Quitar de Favoritos').addClass('favorited');
    } else {
      $button.html('🤍 Agregar a Favoritos').removeClass('favorited');
    }
  },

  showFavoritesModal: function() {
    const user = Auth.getCurrentUser();
    if (!user) return;

    const favorites = user.get('favorites') || [];
    const container = $('#favorites-container');
    container.empty();

    if (favorites.length === 0) {
      container.html('<p class="no-favorites">No tienes cómics favoritos aún.</p>');
    } else {
      container.html('<div class="loading">Cargando favoritos...</div>');
      this.loadFavoriteComics(favorites);
    }

    $('#favorites-modal').removeClass('hidden');
  },

  hideFavoritesModal: function() {
    $('#favorites-modal').addClass('hidden');
  },

  loadFavoriteComics: function(favoriteIds) {
    const container = $('#favorites-container');
    container.empty();

    let loadedCount = 0;
    const totalCount = favoriteIds.length;

    favoriteIds.forEach(comicId => {
      fetchComicById(comicId, (comic) => {
        loadedCount++;

        const title = comic.get("title");
        const thumbnail = comic.get("thumbnail");
        const imageUrl = `${thumbnail.path}.${thumbnail.extension}`;
        const id = comic.get("id");

        container.append(`
          <div class="favorite-card">
            <img src="${imageUrl}" alt="${title}" width="120">
            <div class="favorite-info">
              <h4>${title}</h4>
              <div class="favorite-actions">
                <button class="details-button" data-id="${id}">Ver detalles</button>
                <button class="fav-btn favorited" data-id="${id}">❤️</button>
              </div>
            </div>
          </div>
        `);

        // Si es el último, mostrar mensaje si está vacío
        if (loadedCount === totalCount && container.children().length === 0) {
          container.html('<p class="no-favorites">No se pudieron cargar los favoritos.</p>');
        }
      });
    });
  }
};