from rest_framework import serializers
from .models import Review


class ReviewSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source="user.username", read_only=True)
    user_id = serializers.IntegerField(source="user.id", read_only=True)  # ✅ ADD THIS

    class Meta:
        model = Review
        fields = ["id", "user_id", "username", "rating", "comment", "created_at"]