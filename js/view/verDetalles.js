const VerDetallesView = Backbone.View.extend({
  tagName: "div",
  className: "detalles-comic",

  initialize: function (options) {
    this.comic = options.comic; // 👈 Guarda el comic en this.comic
  },

  events: {
    "click .cerrar-detalles": "cerrarDetalles"
  },

  render: function () {
    const comic = this.comic; // 👈 Usa el comic directamente
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
  }
});
