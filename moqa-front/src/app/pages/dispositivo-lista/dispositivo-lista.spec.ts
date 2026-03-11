import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DispositivoLista } from './dispositivo-lista';

describe('DispositivoLista', () => {
  let component: DispositivoLista;
  let fixture: ComponentFixture<DispositivoLista>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DispositivoLista],
    }).compileComponents();

    fixture = TestBed.createComponent(DispositivoLista);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
