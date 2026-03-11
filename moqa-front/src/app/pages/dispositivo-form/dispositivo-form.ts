import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DispositivoService } from '../../core/services/dispositivo';
import { Dispositivo } from '../../core/models/dispositivo.model';

@Component({
  selector: 'app-dispositivo-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './dispositivo-form.html'
})
export class DispositivoFormComponent {
  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private service: DispositivoService
  ) {
    this.form = this.fb.group({
      zona: ['', Validators.required],
      latitude: [null, Validators.required],
      longitude: [null, Validators.required],
      bairro: [''],
      referencia: [''],
      localizadorGoogle: ['']
    });
  }

  salvar() {
    if (this.form.valid) {
      const novoDispositivo: Dispositivo = this.form.value;
      this.service.salvar(novoDispositivo).subscribe({
        next: (res) => {
          alert('Dispositivo salvo com sucesso!');
          this.form.reset();
        },
        error: (err) => console.error('Erro ao salvar:', err)
      });
    }
  }
}