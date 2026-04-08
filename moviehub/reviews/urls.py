from django.urls import path
from .views import CreateReview, MovieReviews, DeleteReview, MovieRatingSummary, CurrentUser

urlpatterns = [
    path("movies/<int:movie_id>/review/", CreateReview.as_view()),
    path("movies/<int:movie_id>/reviews/", MovieReviews.as_view()),
    path("reviews/<int:review_id>/delete/", DeleteReview.as_view()),
    path("movies/<int:movie_id>/ratings/", MovieRatingSummary.as_view()),

    path("user/me/", CurrentUser.as_view()),
]