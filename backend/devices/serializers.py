from rest_framework import serializers
from .models import Device, EventLog, Maintenance

class EventLogSerializer(serializers.ModelSerializer):
    class Meta:
        model = EventLog
        fields = '__all__'

class MaintenanceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Maintenance
        fields = '__all__'

class DeviceSerializer(serializers.ModelSerializer):
    logs = EventLogSerializer(many=True, read_only=True)
    maintenances = MaintenanceSerializer(many=True, read_only=True)

    class Meta:
        model = Device
        fields = '__all__'
