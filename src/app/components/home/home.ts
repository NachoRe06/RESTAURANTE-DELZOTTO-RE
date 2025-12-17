import { Component, inject } from '@angular/core';
import {Router} from '@angular/router'
@Component({
  selector: 'app-home',
  imports: [],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
  router= inject(Router);
  
  Login() {
    this.router.navigate(['/login'])
  }

  VerRestaurantes(){
    this.router.navigate(['/restaurante'])
  }

  Register(){
    this.router.navigate(['/register'])
  }

  Home(){
    this.router.navigate(['/home'])
  }
}
