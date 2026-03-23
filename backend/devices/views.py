from rest_framework import viewsets
from .models import Device, EventLog, Maintenance
from .serializers import DeviceSerializer, EventLogSerializer, MaintenanceSerializer

class DeviceViewSet(viewsets.ModelViewSet):
    queryset = Device.objects.prefetch_related('logs', 'maintenances').all()
    serializer_class = DeviceSerializer

class EventLogViewSet(viewsets.ModelViewSet):
    queryset = EventLog.objects.all()
    serializer_class = EventLogSerializer

class MaintenanceViewSet(viewsets.ModelViewSet):
    queryset = Maintenance.objects.all()
    serializer_class = MaintenanceSerializer
