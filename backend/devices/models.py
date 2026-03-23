from django.db import models

class Device(models.Model):
    zone = models.CharField(max_length=100)
    latitude = models.FloatField()
    longitude = models.FloatField()
    neighborhood = models.CharField(max_length=150, blank=True, null=True)
    reference = models.CharField(max_length=255, blank=True, null=True)
    google_locator = models.CharField(max_length=255, blank=True, null=True)

    class Meta:
        db_table = 'dispositivos'

    def __str__(self):
        return f"Device {self.id} - {self.zone}"

class EventLog(models.Model):
    device = models.ForeignKey(Device, on_delete=models.CASCADE, related_name='logs')
    created_at = models.DateTimeField(auto_now_add=True)
    location = models.CharField(max_length=255)
    description = models.TextField()
    observations = models.TextField(blank=True, null=True)

    class Meta:
        db_table = 'logs_eventos'

    def __str__(self):
        return f"Log for Device {self.device_id} at {self.created_at}"
