import { Routes } from '@angular/router';
import { LoginPagina } from './paginas/login-pagina/login-pagina';
import { RegisterPagina } from './paginas/register-pagina/register-pagina';
import { Restaurante } from './paginas/restaurante/restaurante';
import { Home } from './components/home/home';

export const routes: Routes = [
    {
    path:"login",
    component:LoginPagina,
    },
   {
    path:"register",
    component:RegisterPagina,
   },
   {
    path:"restaurants",
    component:Restaurante,
   },
   {
    path:"**",
    component:Home,
   },

];
