import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { User } from '../../interfaces/user';
import { Category } from '../../interfaces/Category';
import { Product } from '../../interfaces/product';
import { UsersService } from '../../service/user-service';
import { ProductService } from '../../service/product-service';
import { CategoriesService } from '../../service/category-service';

@Component({
  selector: 'app-ver-restaurante',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './ver-restaurante.html',
  styleUrl: './ver-restaurante.css',
})
export class VerRestaurante implements OnInit {
  
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private usersService = inject(UsersService);
  private restaurantService = inject(ProductService);
  private categoriesService = inject(CategoriesService);

  isLoading = signal<boolean>(true);
  user = signal<User | undefined>(undefined);
  products = signal<Product[]>([]);
  categories = signal<Category[]>([]);
  
  selectedCategoryId = signal<number | null>(null);

  // Esta lista se actualiza sola cuando cambias los productos o la categoría seleccionada
  filteredProducts = computed(() => {
    const selectedId = this.selectedCategoryId();
    const currentProducts = this.products();

    if (selectedId === null) {
      return currentProducts; 
    }
    return currentProducts.filter(p => p.categoryId === selectedId);
  });

  async ngOnInit() {
    const idParam = this.route.snapshot.paramMap.get('idRestaurant');

    if (idParam) {
      const id = Number(idParam); // Convertir texto a número
  
      // Si es un número válido, cargamos los datos
      if (!isNaN(id)) {
        await this.loadData(id);
      } else {
        console.error("El ID de la URL no es un número válido");
        this.isLoading.set(false);
      }
    } else {
      console.error("No se encontró el parámetro 'idRestaurant' en la URL");
      this.isLoading.set(false);
    }
  }

  async loadData(id: number) {
    this.isLoading.set(true);

    try {
      // Cargar Datos del Restaurante (Dueño)
      let restaurantUser = this.usersService.users.find(r => r.id === id);
      
      // Si no está en memoria (ej: entras directo por link o eres invitado), lo pedimos al back
      if (!restaurantUser) {
        restaurantUser = await this.usersService.getUsersbyId(id);
      }
      this.user.set(restaurantUser);

      // Cargar Productos del Restaurante
      const prods = await this.restaurantService.getProductbyrestaurant(id);
      this.products.set(prods || []);

      // Cargar Categorías del Restaurante
      await this.categoriesService.getCategoriesByRestaurant(id);
      this.categories.set(this.categoriesService.categories());

    } catch (error) {
      console.error("Error cargando el menú del restaurante:", error);
    } finally {
    
      this.isLoading.set(false);
    }
  }


  selectCategory(categoryId: number | null) {
    this.selectedCategoryId.set(categoryId);
  }

  calculateFinalPrice(product: Product): number {
    const discount = product.discount || 0;
    if (discount > 0) {
      return product.price - (product.price * (discount / 100));
    }
    return product.price;
  }

  volver() {
    this.router.navigate(['/restaurante']);
  }
}