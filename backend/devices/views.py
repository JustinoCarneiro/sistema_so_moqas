from rest_framework import viewsets, status
from rest_framework.response import Response
from .models import Device, EventLog, Maintenance, MaintenanceUpdate, MaintenancePhoto
from .serializers import DeviceSerializer, EventLogSerializer, MaintenanceSerializer, MaintenanceUpdateSerializer, MaintenancePhotoSerializer

class DeviceViewSet(viewsets.ModelViewSet):
    queryset = Device.objects.prefetch_related('logs', 'maintenances').all()
    serializer_class = DeviceSerializer

class EventLogViewSet(viewsets.ModelViewSet):
    queryset = EventLog.objects.all()
    serializer_class = EventLogSerializer

class MaintenanceViewSet(viewsets.ModelViewSet):
    queryset = Maintenance.objects.all()
    serializer_class = MaintenanceSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        maintenance = serializer.save()
        for f in request.FILES.getlist('photos'):
            MaintenancePhoto.objects.create(maintenance=maintenance, photo=f)
        return Response(self.get_serializer(maintenance).data, status=status.HTTP_201_CREATED)

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        maintenance = serializer.save()
        for f in request.FILES.getlist('photos'):
            MaintenancePhoto.objects.create(maintenance=maintenance, photo=f)
        return Response(self.get_serializer(maintenance).data)

class MaintenanceUpdateViewSet(viewsets.ModelViewSet):
    queryset = MaintenanceUpdate.objects.all()
    serializer_class = MaintenanceUpdateSerializer

class MaintenancePhotoViewSet(viewsets.ModelViewSet):
    queryset = MaintenancePhoto.objects.all()
    serializer_class = MaintenancePhotoSerializer
