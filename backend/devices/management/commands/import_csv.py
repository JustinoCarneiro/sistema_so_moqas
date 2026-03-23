import csv
import os
import re
from datetime import datetime
from django.core.management.base import BaseCommand
from devices.models import Device, EventLog

class Command(BaseCommand):
    help = 'Import data from CSV files'

    def handle(self, *args, **options):
        # Inside Docker, the base dir for data is /data (mounted in docker-compose)
        base_dir = '/data'

        rede_csv = os.path.join(base_dir, 'Acompanhamento monitoramento QAr - Rede de monitoramento.csv')
        eventos_csv = os.path.join(base_dir, 'Acompanhamento monitoramento QAr - Relatórios de operação externa.csv')


        self.import_rede(rede_csv)
        self.import_eventos(eventos_csv)

    def parse_float(self, value):
        if not value:
            return 0.0
        try:
            return float(value.replace(',', '.'))
        except ValueError:
            return 0.0

    def import_rede(self, file_path):
        self.stdout.write(f'Importing Rede from {file_path}...')
        if not os.path.exists(file_path):
            self.stdout.write(self.style.ERROR(f'File not found: {file_path}'))
            return

        with open(file_path, 'r', encoding='utf-8') as f:
            reader = csv.DictReader(f)
            count = 0
            for row in reader:
                moqa_id = row.get('MoQA_id', '').strip()
                if not moqa_id:
                    continue
                
                Device.objects.update_or_create(
                    moqa_id=moqa_id,
                    defaults={
                        'point': int(row.get('Ponto', 0)) if row.get('Ponto') else None,
                        'zone': row.get('Zona', ''),
                        'latitude': self.parse_float(row.get('Latitude')),
                        'longitude': self.parse_float(row.get('Longitude')),
                        'neighborhood': row.get('Bairro', ''),
                        'reference': row.get('Referência', ''),
                        'google_locator': row.get('Localizador Google', ''),
                    }
                )
                count += 1
            self.stdout.write(self.style.SUCCESS(f'Successfully imported {count} devices'))

    def import_eventos(self, file_path):
        self.stdout.write(f'Importing Eventos from {file_path}...')
        if not os.path.exists(file_path):
            self.stdout.write(self.style.ERROR(f'File not found: {file_path}'))
            return

        with open(file_path, 'r', encoding='utf-8') as f:
            reader = csv.reader(f)
            try:
                next(reader) # Skip title row: ",Log de Eventos,,,,"
                next(reader) # Skip header row: ",Data,Evento,Locais,Descrição,Obs."
            except StopIteration:
                return

            count = 0
            for row in reader:
                if len(row) < 3:
                    continue
                
                date_str = row[1].strip()
                event_type = row[2].strip()
                location = row[3].strip()
                description = row[4].strip()
                obs = row[5].strip() if len(row) > 5 else ''

                if not date_str:
                    continue

                event_date = None
                for fmt in ('%d/%m/%y', '%d/%m/%Y'):
                    try:
                        event_date = datetime.strptime(date_str, fmt).date()
                        break
                    except ValueError:
                        continue

                # Try to link to a device by MoQA_id if mentioned in location
                device = None
                moqa_matches = re.findall(r'\b[A-Z0-9]{6}\b', location)
                if moqa_matches:
                    device = Device.objects.filter(moqa_id=moqa_matches[0]).first()

                EventLog.objects.create(
                    device=device,
                    event_date=event_date,
                    event_type=event_type,
                    location=location,
                    description=description,
                    observations=obs
                )
                count += 1
            self.stdout.write(self.style.SUCCESS(f'Successfully imported {count} event logs'))
