import { Component, inject, input, OnInit } from '@angular/core';
import { AuthService } from '../../service/auth-service';
import { Router, RouterModule } from '@angular/router';
import { UsersService } from '../../service/user-service';
import { FormsModule } from '@angular/forms';
import { User } from '../../interfaces/user';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-restaurants-page',
  imports: [RouterModule, FormsModule ],
  templateUrl: './restaurante.html',
  styleUrl: './restaurante.css',
})
export class Restaurante implements OnInit{
 
    ngOnInit(): void {
      this.userService.getusers();
    }
    authservice = inject(AuthService);
    userService = inject(UsersService);
    user = input.required<User>();
    router = inject (Router)
  
  

  viewMenu(id: number) {
    Swal.fire({
      title: " ¿Desea ver el menu?",
      showCancelButton: true,
      showConfirmButton: true,
      confirmButtonText: "Sí, ver menú",
      cancelButtonText: "Cancelar"
    }).then((result) => {
      if (result.isConfirmed) {
        this.router.navigate(['/ver-restaurante', id]);
      }
    });


  }
}