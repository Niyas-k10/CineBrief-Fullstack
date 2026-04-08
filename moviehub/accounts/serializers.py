from django.contrib.auth.models import User
from rest_framework import serializers
from django.contrib.auth.tokens import PasswordResetTokenGenerator
from django.utils.http import urlsafe_base64_decode
from django.utils.encoding import force_str
import re

# ================= REGISTER =================
class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['username', 'email', 'password']

    # ✅ UNIQUE EMAIL
    def validate_email(self, value):
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("Email already exists")
        return value

    # ✅ STRONG PASSWORD
    def validate_password(self, value):

        if len(value) < 6:
            raise serializers.ValidationError("Password must be at least 6 characters")

        if not re.search(r"[A-Z]", value):
            raise serializers.ValidationError("Password must contain 1 uppercase letter")

        if not re.search(r"[a-z]", value):
            raise serializers.ValidationError("Password must contain 1 lowercase letter")

        if not re.search(r"[0-9]", value):
            raise serializers.ValidationError("Password must contain 1 number")

        return value

    # ✅ CREATE USER
    def create(self, validated_data):
        return User.objects.create_user(**validated_data)


# ================= PASSWORD RESET REQUEST =================
class PasswordResetRequestSerializer(serializers.Serializer):
    email = serializers.EmailField()

    def validate(self, data):
        if not User.objects.filter(email=data['email']).exists():
            raise serializers.ValidationError("User with this email does not exist")
        return data


# ================= PASSWORD RESET CONFIRM =================
class PasswordResetConfirmSerializer(serializers.Serializer):
    uid = serializers.CharField()
    token = serializers.CharField()
    new_password = serializers.CharField(write_only=True)

    def validate(self, data):
        try:
            uid = force_str(urlsafe_base64_decode(data['uid']))
            user = User.objects.get(pk=uid)
        except:
            raise serializers.ValidationError("Invalid UID")

        if not PasswordResetTokenGenerator().check_token(user, data['token']):
            raise serializers.ValidationError("Invalid or expired token")

        # ✅ PASSWORD VALIDATION AGAIN
        password = data['new_password']

        if len(password) < 6:
            raise serializers.ValidationError("Password must be at least 6 characters")

        if not re.search(r"[A-Z]", password):
            raise serializers.ValidationError("Password must contain uppercase letter")

        if not re.search(r"[a-z]", password):
            raise serializers.ValidationError("Password must contain lowercase letter")

        if not re.search(r"[0-9]", password):
            raise serializers.ValidationError("Password must contain number")

        user.set_password(password)
        user.save()

        return data