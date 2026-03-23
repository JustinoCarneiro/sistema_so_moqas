from rest_framework import serializers
from .models import Device, EventLog

class EventLogSerializer(serializers.ModelSerializer):
    class Meta:
        model = EventLog
        fields = '__all__'

class DeviceSerializer(serializers.ModelSerializer):
    logs = EventLogSerializer(many=True, read_only=True)

    class Meta:
        model = Device
        fields = '__all__'
