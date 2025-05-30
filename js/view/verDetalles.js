const VerDetallesView = Backbone.View.extend({
  tagName: "div",
  className: "detalles-comic",

  initialize: function (options) {
    this.comic = options.comic;
  },

  events: {
    "click .cerrar-detalles": "cerrarDetalles"
  },

  render: function () {
    const comic = this.comic;
    const title = comic.get("title");
    const description = comic.get("description") || "Sin descripción disponible";
    const thumbnail = comic.get("thumbnail");
    const imageUrl = `${thumbnail.path}.${thumbnail.extension}`;

    this.$el.html(`
      <div class="detalle-card">
        <h2>${title}</h2>
        <img src="${imageUrl}" alt="${title}" width="300">
        <p>${description}</p>
        <button class="cerrar-detalles">Cerrar</button>
      </div>
    `);

    return this;
  },

  cerrarDetalles: function () {
    this.remove();
    $("#comics-container").show();
    $("#pagination-controls").show();
  }
});

// Variables globales para paginación  
let currentPage = 0;
let totalPages = 0;
let currentFilters = {};
const COMICS_PER_PAGE = 10;

$(function () {
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

          container.append(`
            <div class="comic-card">
              <img src="${imageUrl}" alt="${title}" width="150">
              <h3>${title}</h3>
              <button class="details-button" data-id="${id}">Ver detalles</button>
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

  // Cargar primera página
  fetchComics();

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

  $("#comics-container").on("click", ".details-button", function () {
    const comicId = $(this).data("id");

    fetchComicById(comicId, function (comic) {
      const detallesView = new VerDetallesView({ comic: comic });
      $("#comics-container").hide();
      $("#pagination-controls").hide();
      $("body").append(detallesView.render().el);
    });
  });
});

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