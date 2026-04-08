from django.urls import path
from .views import MovieSearchView, TrendingMoviesView, MovieDetailView, AddFavoriteMovie, UserFavorites, RemoveFavorite,MovieCastView,AddToWatchlist,UserWatchlist,RemoveFromWatchlist,MovieGenresView, MoviesByGenreView,PopularMoviesView,MovieRecommendationView,SimilarMoviesView,TopRatedMoviesView,RecentlyViewedView

urlpatterns = [
    path("search/", MovieSearchView.as_view()),
    path("trending/", TrendingMoviesView.as_view()),
    path("<int:movie_id>/", MovieDetailView.as_view()),
    path("favorites/add/", AddFavoriteMovie.as_view()),
    path("favorites/", UserFavorites.as_view()),
    path("favorites/remove/<int:movie_id>/", RemoveFavorite.as_view()),
    path("<int:movie_id>/cast/", MovieCastView.as_view()),
    path("watchlist/add/",AddToWatchlist.as_view()),
    path("watchlist/",UserWatchlist.as_view()),
    path("watchlist/remove/<int:movie_id>/",RemoveFromWatchlist.as_view()),
    path("genres/",MovieGenresView.as_view()),
    path("genre/<int:genre_id>/",MoviesByGenreView.as_view()),
    path("popular/", PopularMoviesView.as_view()),

    path("recommendations/", MovieRecommendationView.as_view()),

    path("<int:movie_id>/similar/", SimilarMoviesView.as_view()),

    path("top-rated/", TopRatedMoviesView.as_view()),

    path("recently-viewed/", RecentlyViewedView.as_view()),



]