from django.contrib.auth.forms import UserCreationForm, UserChangeForm

from .models import CustomUser


class CustomUserCreationForm(UserCreationForm):
    """Custom form for CREATEing new user."""
    class Meta:
        model = CustomUser
        fields = ('email', 'username',)


class CustomUserChangeForm(UserChangeForm):
    """Custom form for UPDATEing new user."""
    class Meta:
        model = CustomUser
        fields = ('email', 'username',)
