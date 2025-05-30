const FavoritesView = Backbone.View.extend({
  el: "#results",

  render() {
    const ids = Auth.getFavorites();
    if (!ids.length) {
      this.$el.html("<p>No tienes favoritos todavía.</p>");
      return;
    }

    MarvelAPI.getComicsByIds(ids).then(comics => {
      this.$el.empty();
      comics.forEach(data => {
        const comic = new Comic(data);
        comic.set("isFavorite", true);
        const view = new ComicView({ model: comic });
        this.$el.append(view.render().el);
      });
    });

    return this;
  }
});
window.FavoritesView = FavoritesView;
