$(function () {
  const comics = new Comics();

  function fetchComics(filters = {}) {
    comics.fetch({
      data: filters,
      reset: true,
      success: function (collection) {
        const container = $("#comics-container");
        container.empty();

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
      },
      error: function () {
        $("#comics-container").html("<p>Error cargando los cómics.</p>");
      }
    });
  }

  fetchComics();

  $("#filter-form").on("submit", function (e) {
    e.preventDefault();
    const title = $("#title-filter").val();
    const year = $("#year-filter").val();
    const filters = {};

    if (title) filters.title = title;
    if (year) filters.startYear = year;

    fetchComics(filters);
  });

  $("#comics-container").on("click", ".details-button", function () {
    const comicId = $(this).data("id");

    fetchComicById(comicId, function (comic) {
      const detallesView = new VerDetallesView({ comic: comic });
      $("#comics-container").hide(); // Oculta la lista
      $("body").append(detallesView.render().el); // Muestra los detalles
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
