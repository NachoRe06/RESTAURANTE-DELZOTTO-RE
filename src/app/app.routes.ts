import { Routes } from '@angular/router';
import { LoginPagina } from './paginas/login-pagina/login-pagina';
import { RegisterPagina } from './paginas/register-pagina/register-pagina';
import { Home } from './components/home/home';
import { Restaurante } from './paginas/restaurante/restaurante';
import { Perfiles } from './paginas/perfiles/perfiles';
import { onlyLoggedUserGuard } from './guards/only-logged-user-guard';
import { Productos } from './paginas/productos/productos';
import { CategoriaPagina } from './paginas/categoria-pagina/categoria-pagina';
import { VerRestaurante } from './paginas/ver-restaurante/ver-restaurante';


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
    path:"restaurante",
    component:Restaurante,
   },
     {
    path:"ver-restaurante/:idRestaurant",
    component:VerRestaurante,
   },
    {
    path:"perfiles",
    component:Perfiles,
    canActivate: [onlyLoggedUserGuard]
   },
   {
    path: 'categoria-pagina/edit/:idCategory', 
    component: CategoriaPagina,
    canActivate: [onlyLoggedUserGuard] 
  },
  {
    path: 'productos/edit/:idProduct', 
    component: Productos,
    canActivate: [onlyLoggedUserGuard]
  },
   {
    path: 'perfiles/edit',
    component: RegisterPagina,
    canActivate: [onlyLoggedUserGuard]
  },
   {
    path:"**",
    component:Home,
   },

];
