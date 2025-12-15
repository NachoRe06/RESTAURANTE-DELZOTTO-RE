import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginPagina } from './login-pagina';

describe('LoginPagina', () => {
  let component: LoginPagina;
  let fixture: ComponentFixture<LoginPagina>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoginPagina]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoginPagina);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
