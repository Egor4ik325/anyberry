from django.urls import path, include, re_path
from dj_rest_auth.registration.views import LoginView, RegisterView, VerifyEmailView

from .views import VKLoginView, GoogleLoginView

# API url routes
urlpatterns = [
    path('', include('berries.urls')),
    path('users/', include('users.urls')),
    path('', include('carts.urls')),
    path('', include('orders.urls')),
    path('auth/', include('dj_rest_auth.urls')),
    path('auth/registration/', include('dj_rest_auth.registration.urls')),

    # allauth-specific
    path('auth/login/', LoginView.as_view(), name='account_login'),
    path('auth/registration/', RegisterView.as_view(), name='account_signup'),
    re_path(r'^auth/registration/account-confirm-email/', VerifyEmailView.as_view(), name='account_email_verification_sent'),
    re_path(r'^auth/registration/account-confirm-email/(?P<key>[-:\w]+)/$', VerifyEmailView.as_view(), name='account_confirm_email'),

    path("accounts/", include("allauth.urls")),

    # Social auth
    # path('auth/vk/', VKLoginView.as_view(), name='vk_login'),
    # path('auth/google/', GoogleLoginView.as_view(), name='google_login'),
]
