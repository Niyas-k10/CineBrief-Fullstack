from django.contrib import admin
from movies.models import Watchlist,FavoriteMovie,RecentlyViewed


@admin.register(FavoriteMovie)
class FavoriteMovieAdmin(admin.ModelAdmin):

    list_display = ("user", "title", "movie_id", "added_at")

    search_fields = ("user__username", "title")

    list_filter = ("added_at",)


@admin.register(Watchlist)
class WatchlistAdmin(admin.ModelAdmin):

    list_display = ("user", "title", "movie_id", "added_at")

    search_fields = ("user__username", "title")

    list_filter = ("added_at",)

@admin.register(RecentlyViewed)
class RecentlyViewedAdmin(admin.ModelAdmin):

    list_display = ("user", "title", "movie_id", "viewed_at")

    search_fields = ("user__username", "title")

    list_filter = ("viewed_at",)