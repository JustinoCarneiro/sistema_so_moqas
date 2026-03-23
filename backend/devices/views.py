from rest_framework import viewsets
from .models import Device, EventLog
from .serializers import DeviceSerializer, EventLogSerializer

class DeviceViewSet(viewsets.ModelViewSet):
    queryset = Device.objects.prefetch_related('logs').all()
    serializer_class = DeviceSerializer

class EventLogViewSet(viewsets.ModelViewSet):
    queryset = EventLog.objects.all()
    serializer_class = EventLogSerializer
