import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet], // Essencial para as rotas funcionarem
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class AppComponent {
  title = 'moqa-front';
}