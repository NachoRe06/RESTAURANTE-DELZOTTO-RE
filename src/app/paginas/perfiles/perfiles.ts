import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common'; 
import { AuthService } from '../../service/auth-service';
import { UsersService } from '../../service/user-service';
import { ProductService } from '../../service/product-service';
import { CategoriesService } from '../../service/category-service';
import { User } from '../../interfaces/user';
import { Product } from '../../interfaces/product';
import { Category } from '../../interfaces/Category';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [RouterModule, RouterLink, CommonModule],
  templateUrl: './perfiles.html',
  styleUrl: './perfiles.css'
})
export class Perfiles implements OnInit {
  private userService = inject(UsersService);
  private authService = inject(AuthService);
  private productService = inject(ProductService);
  private categoriesService = inject(CategoriesService);
  public router = inject(Router);

  user: User | undefined = undefined;
  products: Product[] = [];     
  categories: Category[] = [];  
  
  cargando = true;
  error = '';
  
  showDeleteConfirm = false;
  isDeleting = false;

  async ngOnInit() {
  await this.loadAllData();
}

async loadAllData() {
  this.cargando = true;
  try {
    const userId = this.authService.getUserId();
    console.log("Cargando datos para usuario ID:", userId);

    if (!userId) { 
      this.error = "Sesión expirada"; 
      return; 
    }

    this.user = await this.userService.getUsersbyId(userId);

    const prods = await this.productService.getProductbyrestaurant(userId);
    this.products = prods || [];

    await this.categoriesService.getCategoriesByRestaurant(userId);
    this.categories = this.categoriesService.categories();

  } catch (err) {
    console.error(err);
    this.error = 'Error cargando datos';
  } finally {
    this.cargando = false;
  }
}

  openDeleteConfirm() { this.showDeleteConfirm = true; }
  closeDeleteConfirm() { this.showDeleteConfirm = false; }

  async deleteUser() {
    if (!this.user) return;
    this.isDeleting = true;
    try {
      const result = await this.userService.deleteUser(this.user.id);
      if (result) {
        this.authService.logout();
      } else {
        this.error = 'No se pudo eliminar la cuenta';
        this.isDeleting = false;
      }
    } catch (err) {
      this.error = 'Error al eliminar la cuenta';
      this.isDeleting = false;
    }
  }

  async deleteProduct(id: number) {
    if(!confirm('¿Estás seguro de borrar este producto?')) return;

    const success = await this.productService.deleteProduct(id);
    if(success) {
      this.products = this.products.filter(p => p.id !== id);
    } else {
      alert('Error al eliminar producto');
    }
  }
  async deleteCategory(id: number) {
    if(!confirm('¿Borrar categoría? Esto podría afectar productos asociados.')) 
      return;

    const success = await this.categoriesService.deleteCategory(id);
    if(success) {
      this.categories = this.categories.filter(c => c.id !== id);
    } else {
      alert('Error al eliminar categoría');
    }
  }
}
