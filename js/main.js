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
          container.append(`
            <div class="comic-card">
              <img src="${imageUrl}" alt="${title}" width="150">
              <h3>${title}</h3>
            </div>
          `);
        });
      },
      error: function () {
        $("#comics-container").html("<p>Error cargando los cómics.</p>");
      }
    });
  }

  fetchComics(); // Al inicio

  $("#filter-form").on("submit", function (e) {
    e.preventDefault();
    const title = $("#title-filter").val();
    const year = $("#year-filter").val();
    const filters = {};

    if (title) filters.title = title;
    if (year) filters.startYear = year;

    fetchComics(filters);
  });
});
