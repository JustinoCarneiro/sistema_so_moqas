import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DispositivoForm } from './dispositivo-form';

describe('DispositivoForm', () => {
  let component: DispositivoForm;
  let fixture: ComponentFixture<DispositivoForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DispositivoForm],
    }).compileComponents();

    fixture = TestBed.createComponent(DispositivoForm);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
