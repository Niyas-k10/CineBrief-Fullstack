from django.db import models
from django.contrib.auth.models import User

class FavoriteMovie(models.Model):

    user = models.ForeignKey(User, on_delete=models.CASCADE)

    movie_id = models.IntegerField()
    title = models.CharField(max_length=255)

    poster_path = models.CharField(max_length=255, null=True, blank=True)

    added_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username} - {self.title}"



class Watchlist(models.Model):

    user = models.ForeignKey(User, on_delete=models.CASCADE)

    movie_id = models.IntegerField()

    title = models.CharField(max_length=255)

    poster_path = models.CharField(max_length=255, null=True, blank=True)

    added_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username} - {self.title}"


class RecentlyViewed(models.Model):

    user = models.ForeignKey(User, on_delete=models.CASCADE)

    movie_id = models.IntegerField()

    title = models.CharField(max_length=255)

    poster_path = models.CharField(max_length=255, null=True, blank=True)

    viewed_at = models.DateTimeField(auto_now_add=True)