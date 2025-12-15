import { Component, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router'; // Importar Router
import { AuthService } from '../../service/auth-service';
import { FormsModule, NgForm } from '@angular/forms';
import { Spinner } from '../../components/spinner/spinner';


@Component({
  selector: 'app-login-page',
  standalone: true, 
  imports: [RouterModule, FormsModule,Spinner ],
  templateUrl: './login-pagina.html',
  styleUrl: './login-pagina.css'
})
export class LoginPagina {
  errorLogin = false;
  authService = inject(AuthService);
  router = inject(Router); 
  isLoading = false;

  async login(form: NgForm) {
    this.errorLogin = false;
    
    // Validaciones básicas
    if (!form.value.restaurantName || !form.value.password) {
      this.errorLogin = true;
      return;
    }

    this.isLoading = true;

    // 1. Llamamos al servicio y esperamos la respuesta (true/false)
    const loginExitoso = await this.authService.login(form.value);
    
    this.isLoading = false;

    if (loginExitoso) {
      // CASO ÉXITO: Redirigir al panel de administración
      // existe? en tu app.routes.ts
      this.router.navigate(['/perfil']); 
    } else {
      //  CASO ERROR: Mostrar mensaje rojo
      this.errorLogin = true;
    }
  }
}