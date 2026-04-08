from django.contrib import admin
from reviews.models import Review

@admin.register(Review)
class ReviewAdmin(admin.ModelAdmin):

    list_display = ("user", "movie_id", "rating", "created_at")

    search_fields = ("user__username", "movie_id")

    list_filter = ("rating", "created_at")