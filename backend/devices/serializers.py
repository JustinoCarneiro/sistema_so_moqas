from rest_framework import serializers
from .models import Device, EventLog, Maintenance, MaintenanceUpdate

class EventLogSerializer(serializers.ModelSerializer):
    class Meta:
        model = EventLog
        fields = '__all__'

class MaintenanceUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = MaintenanceUpdate
        fields = '__all__'

class MaintenanceSerializer(serializers.ModelSerializer):
    device_moqa_id = serializers.ReadOnlyField(source='device.moqa_id')
    updates = MaintenanceUpdateSerializer(many=True, read_only=True)

    class Meta:
        model = Maintenance
        fields = ['id', 'device', 'device_moqa_id', 'technician', 'description', 'status', 'photo', 'created_at', 'updated_at', 'updates']

class DeviceSerializer(serializers.ModelSerializer):
    logs = EventLogSerializer(many=True, read_only=True)
    maintenances = MaintenanceSerializer(many=True, read_only=True)

    class Meta:
        model = Device
        fields = '__all__'
