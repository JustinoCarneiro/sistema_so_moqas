import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Dispositivo } from '../models/dispositivo.model';

@Injectable({
  providedIn: 'root'
})
export class DispositivoService {
  private readonly API = 'api/dispositivos';

  constructor(private http: HttpClient) { }

  listarTodos(): Observable<Dispositivo[]> {
    return this.http.get<Dispositivo[]>(this.API);
  }

  salvar(dispositivo: Dispositivo): Observable<Dispositivo> {
    return this.http.post<Dispositivo>(this.API, dispositivo);
  }
}