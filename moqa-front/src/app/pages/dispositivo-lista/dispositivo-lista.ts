import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DispositivoService } from '../../core/services/dispositivo';
import { Dispositivo, LogEvento } from '../../core/models/dispositivo.model';

@Component({
  selector: 'app-dispositivo-lista',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './dispositivo-lista.html',
  styleUrl: './dispositivo-lista.scss'
})
export class DispositivoListaComponent implements OnInit {
  dispositivos: Dispositivo[] = [];

  // Modal de Logs
  modalLogsAberto = false;
  dispositivoSelecionado: Dispositivo | null = null;
  logs: LogEvento[] = [];
  carregandoLogs = false;

  // Modal de Edição
  modalEditarAberto = false;
  editarForm: FormGroup;
  dispositivoEditando: Dispositivo | null = null;
  salvando = false;

  constructor(
    private dispositivoService: DispositivoService,
    private cdr: ChangeDetectorRef,
    private fb: FormBuilder
  ) {
    this.editarForm = this.fb.group({
      zona: ['', Validators.required],
      latitude: [null, Validators.required],
      longitude: [null, Validators.required],
      bairro: [''],
      referencia: [''],
      localizadorGoogle: ['']
    });
  }

  ngOnInit(): void {
    this.carregarDispositivos();
  }

  carregarDispositivos(): void {
    this.dispositivoService.listarTodos().subscribe({
      next: (dados) => {
        this.dispositivos = [...dados];
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Erro ao buscar dispositivos:', err)
    });
  }

  // --- Logs ---
  abrirLogs(dispositivo: Dispositivo): void {
    this.dispositivoSelecionado = dispositivo;
    this.modalLogsAberto = true;
    this.logs = [];
    this.carregandoLogs = true;

    this.dispositivoService.listarLogs(dispositivo.id!).subscribe({
      next: (dados) => {
        this.logs = [...dados];
        this.carregandoLogs = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Erro ao buscar logs:', err);
        this.carregandoLogs = false;
        this.cdr.detectChanges();
      }
    });
  }

  fecharModalLogs(): void {
    this.modalLogsAberto = false;
    this.dispositivoSelecionado = null;
    this.logs = [];
  }

  // --- Editar ---
  abrirEditar(dispositivo: Dispositivo): void {
    this.dispositivoEditando = dispositivo;
    this.editarForm.patchValue({
      zona: dispositivo.zona,
      latitude: dispositivo.latitude,
      longitude: dispositivo.longitude,
      bairro: dispositivo.bairro || '',
      referencia: dispositivo.referencia || '',
      localizadorGoogle: dispositivo.localizadorGoogle || ''
    });
    this.modalEditarAberto = true;
  }

  fecharModalEditar(): void {
    this.modalEditarAberto = false;
    this.dispositivoEditando = null;
    this.editarForm.reset();
  }

  salvarEdicao(): void {
    if (this.editarForm.invalid || !this.dispositivoEditando?.id) return;
    this.salvando = true;

    this.dispositivoService.atualizar(this.dispositivoEditando.id, this.editarForm.value).subscribe({
      next: (atualizado) => {
        this.dispositivos = this.dispositivos.map(d =>
          d.id === atualizado.id ? atualizado : d
        );
        this.salvando = false;
        this.fecharModalEditar();
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Erro ao atualizar:', err);
        this.salvando = false;
        alert('Erro ao guardar as alterações.');
      }
    });
  }

  // --- Remover ---
  remover(id: number | undefined): void {
    if (!id) return;
    const confirmado = confirm(`Tens a certeza que queres remover o Monitor #${id}?`);
    if (!confirmado) return;

    this.dispositivoService.remover(id).subscribe({
      next: () => {
        this.dispositivos = this.dispositivos.filter(d => d.id !== id);
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Erro ao remover:', err);
        alert('Erro ao remover o monitor.');
      }
    });
  }
}