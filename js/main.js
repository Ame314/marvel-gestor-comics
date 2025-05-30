// Variables globales para paginación  
let currentPage = 0;
let totalPages = 0;
let currentFilters = {};
const COMICS_PER_PAGE = 10;

$(function () {
  // Inicializar sistemas
  Auth.init();
  Favorites.init();

  const comics = new Comics();

  function fetchComics(filters = {}, offset = 0) {
    currentFilters = filters;
    
    const requestData = {
      ...filters,
      limit: COMICS_PER_PAGE,
      offset: offset
    };

    comics.fetch({
      data: requestData,
      reset: true,
      success: function (collection, response) {
        const container = $("#comics-container");
        container.empty();

        // Calcular páginas totales
        const total = response.data.total;
        totalPages = Math.ceil(total / COMICS_PER_PAGE);
        currentPage = Math.floor(offset / COMICS_PER_PAGE);

        collection.each(function (comic) {
          const title = comic.get("title");
          const thumbnail = comic.get("thumbnail");
          const imageUrl = `${thumbnail.path}.${thumbnail.extension}`;
          const id = comic.get("id");

          // Verificar si es favorito
          const user = Auth.getCurrentUser();
          const isFavorite = user ? user.isFavorite(id) : false;
          const favIcon = isFavorite ? '❤️' : '🤍';
          const favClass = isFavorite ? 'favorited' : '';

          container.append(`
            <div class="comic-card">
              <img src="${imageUrl}" alt="${title}" width="150">
              <h3>${title}</h3>
              <div class="card-actions">
                <button class="details-button" data-id="${id}">Ver detalles</button>
                <button class="fav-btn ${favClass}" data-id="${id}">${favIcon}</button>
              </div>
            </div>
          `);
        });

        updatePaginationControls();
      },
      error: function () {
        $("#comics-container").html("<p>Error cargando los cómics.</p>");
      }
    });
  }

  function updatePaginationControls() {
    // Solo crear si no existe
    if ($("#pagination-controls").length === 0) {
      $("body").append('<div id="pagination-controls"></div>');
    }
    
    const paginationHtml = `
      <button class="pagination-btn" data-action="prev" ${currentPage === 0 ? 'disabled' : ''}>
        <span>❮</span> Anterior
      </button>
      <span id="page-info">Página ${currentPage + 1} de ${totalPages}</span>
      <button class="pagination-btn" data-action="next" ${currentPage === totalPages - 1 ? 'disabled' : ''}>
        Siguiente <span>❯</span>
      </button>
    `;
    
    $("#pagination-controls").html(paginationHtml);
  }

  // Un solo event listener delegado para paginación
  $("body").on("click", ".pagination-btn", function(e) {
    e.preventDefault();
    
    if ($(this).prop('disabled')) return;
    
    const action = $(this).data('action');
    let newOffset;
    
    if (action === 'prev' && currentPage > 0) {
      newOffset = (currentPage - 1) * COMICS_PER_PAGE;
      fetchComics(currentFilters, newOffset);
    } else if (action === 'next' && currentPage < totalPages - 1) {
      newOffset = (currentPage + 1) * COMICS_PER_PAGE;
      fetchComics(currentFilters, newOffset);
    }
  });

  // Solo cargar cómics si el usuario está logueado
  function initializeComics() {
    if (Auth.getCurrentUser()) {
      fetchComics();
    }
  }

  // Inicializar cómics cuando se muestre la app principal
  const observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
      if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
        const target = mutation.target;
        if (target.id === 'main-app' && !target.classList.contains('hidden')) {
          initializeComics();
        }
      }
    });
  });

  observer.observe(document.getElementById('main-app'), {
    attributes: true,
    attributeFilter: ['class']
  });

  $("#filter-form").on("submit", function (e) {
    e.preventDefault();
    const title = $("#title-filter").val();
    const year = $("#year-filter").val();
    const filters = {};

    if (title) filters.title = title;
    if (year) filters.startYear = year;

    // Resetear a la primera página cuando se aplican filtros
    fetchComics(filters, 0);
  });

  $("#comics-container").on("click", ".details-button", function (e) {
    e.stopPropagation();
    const comicId = $(this).data("id");

    fetchComicById(comicId, function (comic) {
      const detallesView = new VerDetallesView({ comic: comic });
      $("#comics-container").hide();
      $("#pagination-controls").hide();
      $("body").append(detallesView.render().el);
    });
  });

  // También manejar clicks en favoritos del modal
  $("#favorites-container").on("click", ".details-button", function (e) {
    e.stopPropagation();
    const comicId = $(this).data("id");

    fetchComicById(comicId, function (comic) {
      const detallesView = new VerDetallesView({ comic: comic });
      Favorites.hideFavoritesModal();
      $("#comics-container").hide();
      $("#pagination-controls").hide();
      $("body").append(detallesView.render().el);
    });
  });
});

//

function fetchComicById(comicId, callback) {
  const ts = Date.now().toString();
  const publicKey = "ea4aa10fe5dc13cc5e832d8421587bc1";
  const privateKey = "92bea8dd8a72bb0f9e512639715441540a4670e3";
  const hash = CryptoJS.MD5(ts + privateKey + publicKey).toString();

  const url = `https://gateway.marvel.com/v1/public/comics/${comicId}?ts=${ts}&apikey=${publicKey}&hash=${hash}`;

  $.getJSON(url)
    .done(function (response) {
      const result = response.data.results[0];
      const comic = new Comic(result);
      callback(comic);
    })
    .fail(function () {
      alert("Error al obtener los detalles del cómic.");
    });
}