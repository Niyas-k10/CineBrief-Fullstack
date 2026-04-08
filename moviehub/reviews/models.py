from django.db import models
from django.contrib.auth.models import User


class Review(models.Model):

    user = models.ForeignKey(User, on_delete=models.CASCADE)

    movie_id = models.IntegerField()

    rating = models.FloatField()

    comment = models.TextField()

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username} - {self.movie_id}"