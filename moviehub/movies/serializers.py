from rest_framework import serializers
from .models import FavoriteMovie,Watchlist

class FavoriteMovieSerializer(serializers.ModelSerializer):

    class Meta:
        model = FavoriteMovie
        fields = "__all__"

class WatchlistSerializer(serializers.ModelSerializer):

    class Meta:
        model = Watchlist
        fields = "__all__"