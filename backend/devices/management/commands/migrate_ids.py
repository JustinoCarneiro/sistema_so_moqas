import csv
import os
from django.core.management.base import BaseCommand
from devices.models import Device

class Command(BaseCommand):
    help = 'Migrates existing opacity MoQa IDs to semantic IDs and generates a mapping CSV'

    def generate_bairro_abbrev(self, bairro_name):
        mapping = {
            "Jardim Iracema": "JIR",
            "Praia de Iracema": "PRI",
            "Carlito Pamplona": "CPA",
            "Mucuripe": "MUC",
            "Cais do Porto": "CDP",
            "Aldeota / Praça Portugal": "ALD",
            "Beira Mar": "BMA",
            "Centro / Praça da Lagoinha": "CEN",
            "Bairro de Fátima": "FAT",
            "Farias Brito": "FBR",
            "Siqueira": "SIQ",
            "Aracapé": "ARA",
            "José Walter": "JWA",
            "Itaperi": "ITA",
            "Passaré": "PAS",
            "Centro / Paço Municipal": "CEN",
            "SCSP": "SCS",
            "Messejana": "MES",
            "Pici": "PIC",
            "Parque do Cocó": "COC",
            "CIDADE 2.000": "C2K",
            "Aerolândia / Rotatória": "AER",
            "São João do Tauape": "SJT",
            "MANUEL DIAS BRANCO": "MDB",
            "Cocó": "COC",
            "Dionísio Torres / Face de Cristo": "DIO",
            "EDSON QUEIROZ/CENTRO DE EVENTOS": "EQC",
            "EDSON QUEIROZ/IGUATEMI": "EQI",
            "Aerolândia / Polo de lazer": "AER",
            "EDSON QUEIROZ": "EDQ",
            "SEUMA": "SEU"
        }
        bairro_name = (bairro_name or "").strip()
        if not bairro_name:
            return "XXX"
        if bairro_name in mapping:
            return mapping[bairro_name]
        
        # Fallback heuristic
        words = [w for w in bairro_name.replace('/', ' ').replace('-', ' ').split() if len(w) > 2]
        if len(words) == 1:
            return words[0][:3].upper()
        elif len(words) >= 3:
            return (words[0][0] + words[1][0] + words[2][0]).upper()
        elif len(words) == 2:
            return (words[0][0] + words[1][:2]).upper()
        else:
            return bairro_name[:3].upper()

    def generate_zone_abbrev(self, zone_name):
        z = str(zone_name).strip().upper()
        if "NORTE" in z: return "N"
        if "SUL" in z: return "S"
        if "VERDE" in z: return "V"
        return "X"

    def handle(self, *args, **kwargs):
        devices = Device.objects.all()
        
        csv_path = 'Mapeamento_MoQa_IDs.csv'
        
        rows = []
        rows.append(['Ponto', 'legacy_id', 'novo_moqa_id', 'Zona', 'Bairro'])
        
        updated_count = 0
        
        for device in devices:
            # Skip if already migrated or hasn't got an opaque ID
            if device.legacy_id:
                self.stdout.write(self.style.WARNING(f'Device Ponto {device.point} already migrated.'))
                continue
                
            old_id = device.moqa_id or f"OLD-{device.id}"
            device.legacy_id = old_id
            
            z_abr = self.generate_zone_abbrev(device.zone)
            b_abr = self.generate_bairro_abbrev(device.neighborhood)
            p_num = int(device.point) if device.point else device.id
            
            new_id = f"MQ{z_abr}-{b_abr}-{p_num:02d}"
            
            device.moqa_id = new_id
            device.save()
            updated_count += 1
            
            rows.append([
                device.point, 
                old_id, 
                new_id, 
                device.zone, 
                device.neighborhood
            ])
            self.stdout.write(self.style.SUCCESS(f'Migrated: {old_id} -> {new_id}'))
            
        with open(csv_path, mode='w', newline='', encoding='utf-8') as f:
            writer = csv.writer(f)
            writer.writerows(rows)
            
        self.stdout.write(self.style.SUCCESS(f'Successfully migrated {updated_count} devices and generated {csv_path}'))
