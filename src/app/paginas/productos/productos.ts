import { Component, inject, OnInit, viewChild } from '@angular/core';
import { UsersService } from '../../service/user-service';
import { ProductService } from '../../service/product-service';
import { AuthService } from '../../service/auth-service';
import { CategoriesService } from '../../service/category-service';
import { Router, ActivatedRoute } from '@angular/router'; // <--- IMPORTANTE: ActivatedRoute
import { NewCategory, Category } from '../../interfaces/Category';
import { NewProduct, Product } from '../../interfaces/product';
import { FormsModule, NgForm } from '@angular/forms';
import { Spinner } from '../../components/spinner/spinner';

@Component({
  selector: 'app-productos',
  imports: [FormsModule, Spinner],
  templateUrl: './productos.html',
  styleUrl: './productos.css',
})
export class Productos implements OnInit {
  restaurantService = inject(UsersService);
  productService = inject(ProductService);
  authService = inject(AuthService);
  categoriesService = inject(CategoriesService);
  router = inject(Router);
  route = inject(ActivatedRoute); // <--- Inyectamos esto para leer bien la URL

  // Usamos una variable normal en vez de input signal para controlarlo mejor
  currentIdProduct: number | null = null; 

  productoOriginal: Product | undefined = undefined;
  categories: Category[] = [];
  form = viewChild<NgForm>('newProductForm');
  errorBack = false;
  isLoading = false;

  async ngOnInit() {
    this.isLoading = true; // Iniciamos cargando
    try {
      // 1. Cargar Categorías (Siempre necesario)
      await this.categoriesService.getCategoriesByRestaurant(this.authService.getUserId());

      // 2. Leer la URL manualmente
      const idParam = this.route.snapshot.paramMap.get('idProduct');

      // 3. LA CORRECCIÓN CLAVE:
      // Solo buscamos datos si hay ID y NO es la palabra "nuevo"
      if (idParam && idParam !== 'nuevo') {
        const id = Number(idParam);
        
        if (!isNaN(id)) {
          this.currentIdProduct = id; // Guardamos el ID numérico real
          this.productoOriginal = await this.productService.getProductById(id);
        }
      }
      // Si el ID es "nuevo", currentIdProduct se queda en null, y eso está bien.
      
    } catch (e) {
      console.error(e);
    } finally {
      this.isLoading = false;
    }
  }

  async handleFormSubmission(form: NgForm) {
    this.errorBack = false;
    this.isLoading = true;

    // Preparamos el objeto (Asegúrate que los nombres coincidan con tu HTML)
    const nuevoProducto: NewProduct = {
      // Si cambiaste el name en HTML a "nombreProducto", usa form.value.nombreProducto
      // Si sigue siendo "name", usa form.value.name
      name: form.value.name, 
      description: form.value.description,
      price: parseInt(form.value.price),
      featured: form.value.featured === true,
      recommendedFor: parseInt(form.value.recommendedFor),
      discount: parseInt(form.value.discount),
      hasHappyHour: form.value.hasHappyHour === true,
      categoryId: parseInt(form.value.categoryId),
      restaurantId: this.authService.getUserId(),
      labels: [],
      isDestacado: form.value.featured === true 
    };

    let res;

    try {
      // Usamos currentIdProduct para decidir si editamos o creamos
      if (this.currentIdProduct) {
        // --- MODO EDICIÓN ---
        
        // Logica Descuento
        if (this.productoOriginal && parseInt(form.value.discount) !== this.productoOriginal.discount) {
           await this.productService.toggleDiscount(this.currentIdProduct, { discount: parseInt(form.value.discount) });
        }
        
        // Logica Happy Hour
        if (this.productoOriginal && (form.value.hasHappyHour === true) !== this.productoOriginal.hasHappyHour) {
           await this.productService.toggleHappyHour(this.currentIdProduct, { toggleHappyHour: form.value.hasHappyHour === true });
        }
        
        // Logica Destacado
        if (this.productoOriginal && (form.value.featured === true) !== this.productoOriginal.isDestacado) {
          await this.productService.toggleDestacado(this.currentIdProduct, { isDestacado: form.value.featured === true });
        }

        // Editar producto general
        res = await this.productService.editProduct({
          ...nuevoProducto,
          id: this.currentIdProduct
        });

      } else {
        // --- MODO CREACIÓN ---
        // Al ser currentIdProduct null, entra aquí y hace POST (Crear)
        res = await this.productService.addProduct(nuevoProducto);
      }

      this.isLoading = false;

      if (!res) {
        this.errorBack = true;
        return;
      }

      this.router.navigate(["/perfiles"]);

    } catch (error) {
      console.error(error);
      this.isLoading = false;
      this.errorBack = true;
    }
  }
}