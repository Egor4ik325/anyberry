from dj_rest_auth.registration.views import SocialLoginView
from allauth.socialaccount.providers.vk.views import VKOAuth2Adapter
from allauth.socialaccount.providers.google.views import GoogleOAuth2Adapter

class VKLoginView(SocialLoginView):
    adapter_class = VKOAuth2Adapter

class GoogleLoginView(SocialLoginView):
    adapter_class = GoogleOAuth2Adapter