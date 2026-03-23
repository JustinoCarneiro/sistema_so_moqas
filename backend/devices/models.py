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

class Maintenance(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pendente'),
        ('in_progress', 'Em Andamento'),
        ('completed', 'Concluído'),
        ('canceled', 'Cancelado'),
    ]

    device = models.ForeignKey(Device, on_delete=models.CASCADE, related_name='maintenances', verbose_name="Monitor")
    technician = models.CharField(max_length=100, verbose_name="Técnico")
    description = models.TextField(verbose_name="Descrição do Serviço")
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending', verbose_name="Status")
    photo = models.ImageField(upload_to='maintenance_photos/', null=True, blank=True, verbose_name="Foto")
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Data de Entrada")
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'manutencoes'

    def __str__(self):
        return f"Manutenção {self.id} - {self.device.zone}"
