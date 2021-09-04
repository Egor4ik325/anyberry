from django.urls import path, include

# API url routes
urlpatterns = [
    path('', include('berries.urls')),
    path('users/', include('users.urls')),
    path('auth/', include('dj_rest_auth.urls')),
    path('auth/registration/', include('dj_rest_auth.registration.urls')),
]
