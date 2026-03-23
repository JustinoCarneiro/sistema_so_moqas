from django.test import TestCase
from rest_framework.test import APITestCase
from rest_framework import status
from .models import Device, Maintenance

class DeviceAPITests(APITestCase):
    def test_create_device(self):
        """Teste de criação de um novo monitor via API"""
        data = {
            "zone": "ZONA SUL - TESTE",
            "latitude": -23.5505,
            "longitude": -46.6333,
            "neighborhood": "Interlagos",
            "reference": "Perto do Autódromo"
        }
        response = self.client.post('/api/devices/', data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Device.objects.count(), 1)
        self.assertEqual(Device.objects.get().zone, "ZONA SUL - TESTE")

    def test_list_devices(self):
        """Teste de listagem de monitores"""
        Device.objects.create(zone="Z1", latitude=0, longitude=0)
        response = self.client.get('/api/devices/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)

class MaintenanceAPITests(APITestCase):
    def setUp(self):
        # Criar um monitor para associar às manutenções
        self.device = Device.objects.create(zone="MONITOR 01", latitude=10, longitude=20)

    def test_create_maintenance(self):
        """Teste de criação de uma ordem de serviço"""
        data = {
            "device": self.device.id,
            "technician": "João Técnico",
            "description": "Troca de cabo de rede",
            "status": "pending"
        }
        response = self.client.post('/api/maintenances/', data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Maintenance.objects.count(), 1)
        
    def test_filter_maintenance_by_status(self):
        """Teste se o status padrão é pendente"""
        m = Maintenance.objects.create(
            device=self.device,
            technician="T1",
            description="D1"
        )
        self.assertEqual(m.status, 'pending')
