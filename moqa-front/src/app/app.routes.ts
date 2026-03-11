import { Routes } from '@angular/router';
import { DispositivoFormComponent } from './pages/dispositivo-form/dispositivo-form';
import { DispositivoListaComponent } from './pages/dispositivo-lista/dispositivo-lista';

export const routes: Routes = [
  { path: 'dispositivos', component: DispositivoListaComponent },
  { path: 'novo-dispositivo', component: DispositivoFormComponent },
  { path: '', redirectTo: 'dispositivos', pathMatch: 'full' }
];