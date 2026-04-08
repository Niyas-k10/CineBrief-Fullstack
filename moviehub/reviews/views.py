from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

from .models import Review
from .serializers import ReviewSerializer

from django.db.models import Avg
from django.shortcuts import get_object_or_404


class CreateReview(APIView):

    permission_classes = [IsAuthenticated]

    def post(self, request, movie_id):

        # Check if user already reviewed this movie
        if Review.objects.filter(user=request.user, movie_id=movie_id).exists():

            return Response({
                "success": False,
                "message": "You already reviewed this movie"
            })

        review = Review.objects.create(
            user=request.user,
            movie_id=movie_id,
            rating=request.data["rating"],
            comment=request.data["comment"]
        )

        serializer = ReviewSerializer(review)

        return Response({
            "success": True,
            "message": "Review added successfully",
            "data": serializer.data
        })


class MovieReviews(APIView):

    def get(self, request, movie_id):

        reviews = Review.objects.filter(movie_id=movie_id)

        serializer = ReviewSerializer(reviews, many=True)

        return Response(serializer.data)


class DeleteReview(APIView):

    permission_classes = [IsAuthenticated]

    def delete(self, request, review_id):

        review = get_object_or_404(Review, id=review_id, user=request.user)

        review.delete()

        return Response({"message": "Review deleted"})


# class DeleteReview(APIView):

#     permission_classes = [IsAuthenticated]

#     def delete(self, request, review_id):

#         review = Review.objects.get(id=review_id, user=request.user)

#         review.delete()

#         return Response({"message": "Review deleted"})


class MovieRatingSummary(APIView):

    def get(self, request, movie_id):

        reviews = Review.objects.filter(movie_id=movie_id)

        total_reviews = reviews.count()

        avg_rating = reviews.aggregate(Avg("rating"))["rating__avg"]

        return Response({
            "movie_id": movie_id,
            "average_rating": avg_rating,
            "total_reviews": total_reviews
        })



class CurrentUser(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response({
            "id": request.user.id,
            "username": request.user.username
        })