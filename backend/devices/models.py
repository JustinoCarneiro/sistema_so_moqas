from django.db import models

class Device(models.Model):
    moqa_id = models.CharField(max_length=50, unique=True, null=True, blank=True)
    legacy_id = models.CharField(max_length=50, null=True, blank=True)
    point = models.IntegerField(null=True, blank=True)
    zone = models.CharField(max_length=100)
    latitude = models.FloatField()
    longitude = models.FloatField()
    neighborhood = models.CharField(max_length=150, blank=True, null=True)
    reference = models.CharField(max_length=255, blank=True, null=True)
    google_locator = models.CharField(max_length=255, blank=True, null=True)

    class Meta:
        db_table = 'dispositivos'

    def __str__(self):
        return f"Device {self.moqa_id or self.id} - {self.zone}"

class EventLog(models.Model):
    device = models.ForeignKey(Device, on_delete=models.CASCADE, related_name='logs', null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    event_date = models.DateField(null=True, blank=True)
    event_type = models.CharField(max_length=100, blank=True, null=True)
    location = models.CharField(max_length=255)
    description = models.TextField()
    observations = models.TextField(blank=True, null=True)

    class Meta:
        db_table = 'logs_eventos'

    def __str__(self):
        return f"Log {self.event_type} at {self.event_date or self.created_at}"


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

class MaintenanceUpdate(models.Model):
    maintenance = models.ForeignKey(Maintenance, on_delete=models.CASCADE, related_name='updates', verbose_name="Ordem de Serviço")
    technician = models.CharField(max_length=100, verbose_name="Técnico Responsável")
    description = models.TextField(verbose_name="Descrição da Evolução")
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Data/Hora")

    class Meta:
        db_table = 'manutencao_evolucao'
        ordering = ['-created_at']

    def __str__(self):
        return f"Evolução da Manutenção {self.maintenance.id} em {self.created_at.strftime('%d/%m/%Y %H:%M')}"
