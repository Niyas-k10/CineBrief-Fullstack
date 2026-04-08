from django.urls import path
from .views import RegisterView,ProfileView,PasswordResetRequestView, PasswordResetConfirmView,UserProfileView


urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('profile/', UserProfileView.as_view(), name='profile'),
    path('password-reset/', PasswordResetRequestView.as_view(), name='password_reset'),
    path('password-reset-confirm/', PasswordResetConfirmView.as_view(), name='password_reset_confirm'),
    path("profile/", UserProfileView.as_view()),
]