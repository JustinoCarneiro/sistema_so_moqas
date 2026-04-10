from rest_framework import serializers
from .models import Device, EventLog, Maintenance, MaintenanceUpdate, MaintenancePhoto

class EventLogSerializer(serializers.ModelSerializer):
    class Meta:
        model = EventLog
        fields = '__all__'

class MaintenanceUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = MaintenanceUpdate
        fields = '__all__'

class MaintenancePhotoSerializer(serializers.ModelSerializer):
    class Meta:
        model = MaintenancePhoto
        fields = '__all__'

class MaintenanceSerializer(serializers.ModelSerializer):
    device_moqa_id = serializers.ReadOnlyField(source='device.moqa_id')
    device_legacy_id = serializers.ReadOnlyField(source='device.legacy_id')
    device_zone = serializers.ReadOnlyField(source='device.zone')
    device_neighborhood = serializers.ReadOnlyField(source='device.neighborhood')
    device_reference = serializers.ReadOnlyField(source='device.reference')
    updates = MaintenanceUpdateSerializer(many=True, read_only=True)
    photos = MaintenancePhotoSerializer(many=True, read_only=True)

    class Meta:
        model = Maintenance
        fields = ['id', 'device', 'device_moqa_id', 'device_legacy_id', 'device_zone', 'device_neighborhood', 'device_reference', 'technician', 'description', 'status', 'created_at', 'updated_at', 'updates', 'photos']

class DeviceSerializer(serializers.ModelSerializer):
    logs = EventLogSerializer(many=True, read_only=True)
    maintenances = MaintenanceSerializer(many=True, read_only=True)

    class Meta:
        model = Device
        fields = '__all__'
