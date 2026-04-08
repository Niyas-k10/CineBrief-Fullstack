from rest_framework import generics
from django.contrib.auth.models import User
from .serializers import RegisterSerializer,PasswordResetRequestSerializer,PasswordResetConfirmSerializer
from .tasks import send_welcome_email,send_password_reset_email

from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework.response import Response

from rest_framework import status
from django.contrib.auth.tokens import PasswordResetTokenGenerator
from django.utils.http import urlsafe_base64_encode
from django.utils.encoding import force_bytes

from rest_framework.permissions import IsAuthenticated
from movies.models import Watchlist,FavoriteMovie
from reviews.models import Review


class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = RegisterSerializer

    def perform_create(self, serializer):
        user = serializer.save()
        send_welcome_email.delay(user.email)

#================= Protect a Route =================

class ProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response({
            "message": "You are authenticated",
            "user": request.user.username
        })

#=========== Password Reset Request View ==============

class PasswordResetRequestView(APIView):

    def post(self, request):
        serializer = PasswordResetRequestSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        email = serializer.validated_data['email']
        user = User.objects.get(email=email)

        uid = urlsafe_base64_encode(force_bytes(user.pk))
        token = PasswordResetTokenGenerator().make_token(user)

        reset_link = f"http://localhost:5173/reset-password/{uid}/{token}/"

        send_password_reset_email.delay(email, reset_link)

        return Response(
            {"message": "Password reset link sent successfully"},
            status=status.HTTP_200_OK
        )

#============ Confirm Reset View ===============

class PasswordResetConfirmView(APIView):

    def post(self, request):
        serializer = PasswordResetConfirmSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        return Response(
            {"message": "Password reset successful"},
            status=status.HTTP_200_OK
        )



class UserProfileView(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request):

        user = request.user

        favorites_count = FavoriteMovie.objects.filter(user=user).count()

        watchlist_count = Watchlist.objects.filter(user=user).count()

        reviews_count = Review.objects.filter(user=user).count()

        return Response({
            "username": user.username,
            "email": user.email,
            "favorites": favorites_count,
            "watchlist": watchlist_count,
            "reviews": reviews_count
        })
