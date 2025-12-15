import { Component, inject, input, OnInit, signal, computed, numberAttribute } from '@angular/core';
import { Router } from '@angular/router';
import { UsersService } from '../../service/user-service';
import { RestaurantService } from '../../service/product-service';
import { CategoriesService } from '../../service/category-service';
import { User } from '../../interfaces/user';
import { Category } from '../../interfaces/Category';
import { Product } from '../../interfaces/product';

@Component({
  selector: 'app-ver-restaurante',
  imports: [],
  templateUrl: './ver-restaurante.html',
  styleUrl: './ver-restaurante.css',
})
export class VerRestaurante {
// Servicios
  private router = inject(Router);
  private usersService = inject(UsersService);
  private restaurantService = inject(RestaurantService);
  private categoriesService = inject(CategoriesService);

// ❌ ANTES: idRestaurant = input.required<number>();
  
  // ✅ AHORA: Usamos 'transform' para convertir el string de la URL en número automáticamente
  // El alias 'idRestaurant' coincide con la ruta que acabamos de arreglar.
  idRestaurant = input.required<number, string>({ transform: numberAttribute });

  // ESTADO (Signals)
  isLoading = signal<boolean>(true);
  user = signal<User | undefined>(undefined);
  products = signal<Product[]>([]);
  categories = signal<Category[]>([]);
  selectedCategoryId = signal<number | null>(null);

  // LÓGICA COMPUTADA (La forma moderna de filtrar)
  // Se actualiza automáticamente si cambia 'products' o 'selectedCategoryId'
  filteredProducts = computed(() => {
    const selectedId = this.selectedCategoryId();
    const currentProducts = this.products();

    if (selectedId === null) {
      return currentProducts;
    }
    return currentProducts.filter(p => p.categoryId === selectedId);
  });

  // async ngOnInit() {
  //   const restaurantId = this.idRestaurant();
    
  //   if (restaurantId) {
  //     this.isLoading.set(true);
      
  //     try {
  //       // 1. Obtener Info del Restaurante
  //       let restaurantUser = this.usersService.users.find(r => r.id === restaurantId);
  //       if (!restaurantUser) {
  //         // Asumiendo que getUsersbyId devuelve una Promesa con el User
  //         restaurantUser = await this.usersService.getUsersbyId(restaurantId);
  //       }
  //       this.user.set(restaurantUser);

  //       // 2. Obtener Productos (Usando el método corregido que devuelve Product[])
  //       const prods = await this.restaurantService.getProductbyrestaurant(restaurantId);
  //       if (prods) {
  //         this.products.set(prods);
  //       }

  //       // 3. Obtener Categorías
  //       await this.categoriesService.getCategoriesByRestaurant(restaurantId);
  //       this.categories.set(this.categoriesService.categories());

  //     } catch (error) {
  //       console.error('Error cargando datos del restaurante:', error);
  //     } finally {
  //       this.isLoading.set(false);
  //     }
  //   }
  // }

// En restaurants-menu.ts

async ngOnInit() {
  // 1. Obtenemos el ID del Input Signal
  const id = this.idRestaurant(); 

  if (id) {
    this.isLoading.set(true); // Activa el spinner

    try {
      // --- A. Cargar Datos del Restaurante (Nombre, Dirección) ---
      // Primero buscamos si ya lo tenemos en memoria
      let restaurantUser = this.usersService.users.find(r => r.id === id);
      
      // Si no está en memoria, lo pedimos al backend
      if (!restaurantUser) {
        restaurantUser = await this.usersService.getUsersbyId(id);
      }
      this.user.set(restaurantUser);

      // --- B. Cargar Productos (SOLUCIÓN AL ERROR) ---
      // Usamos 'id' que definimos arriba, no 'restaurantId'
      const prods = await this.restaurantService.getProductbyrestaurant(id);
      this.products.set(prods);

      // --- C. Cargar Categorías ---
      await this.categoriesService.getCategoriesByRestaurant(id);
      this.categories.set(this.categoriesService.categories());

    } catch (error) {
      console.error("Falló la carga del menú:", error);
    } finally {
      // --- D. Apagar Spinner (SIEMPRE) ---
      this.isLoading.set(false);
    }
  }
}

  selectCategory(categoryId: number | null) {
    this.selectedCategoryId.set(categoryId);
  }

  calculateFinalPrice(product: Product): number {
    const discount = product.discount || 0;
    return product.price - (product.price * (discount / 100));
  }

  volver() {
    this.router.navigate(['/restaurants']);
  }
}
