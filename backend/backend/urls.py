from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from devices.views import DeviceViewSet, EventLogViewSet, MaintenanceViewSet, MaintenanceUpdateViewSet, MaintenancePhotoViewSet

router = DefaultRouter()
router.register(r'devices', DeviceViewSet, basename='device')
router.register(r'logs', EventLogViewSet, basename='log')
router.register(r'maintenances', MaintenanceViewSet, basename='maintenance')
router.register(r'maintenance-updates', MaintenanceUpdateViewSet, basename='maintenance-update')
router.register(r'maintenance-photos', MaintenancePhotoViewSet, basename='maintenance-photo')

from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include(router.urls)),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
