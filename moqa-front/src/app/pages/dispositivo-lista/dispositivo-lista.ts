import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DispositivoService } from '../../core/services/dispositivo'; //
import { Dispositivo } from '../../core/models/dispositivo.model'; //

@Component({
  selector: 'app-dispositivo-lista',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './dispositivo-lista.html',
  styleUrl: './dispositivo-lista.scss'
})
export class DispositivoListaComponent implements OnInit {
  dispositivos: Dispositivo[] = [];

  constructor(private dispositivoService: DispositivoService) {}

  ngOnInit(): void {
    this.carregarDispositivos();
  }

  carregarDispositivos(): void {
    this.dispositivoService.listarTodos().subscribe({
      next: (dados) => {
        this.dispositivos = dados;
      },
      error: (err) => console.error('Erro ao buscar dispositivos:', err)
    });
  }
}