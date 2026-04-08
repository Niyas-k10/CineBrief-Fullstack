from celery import shared_task
from django.core.mail import send_mail

@shared_task
def send_welcome_email(email):
    send_mail(
        subject="Welcome to MovieHub",
        message="Thank you for registering!",
        from_email="your_email@gmail.com",
        recipient_list=[email],
        fail_silently=False,
    )

@shared_task
def send_password_reset_email(email, reset_link):
    send_mail(
        subject="Password Reset Request",
        message=f"Click the link to reset your password:\n{reset_link}",
        from_email="your_email@gmail.com",
        recipient_list=[email],
        fail_silently=False,
    )