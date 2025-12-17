import { Component, inject, input, viewChild } from '@angular/core';
import { UsersService } from '../../service/user-service';
import { ProductService } from '../../service/product-service';
import { AuthService } from '../../service/auth-service';
import { CategoriesService } from '../../service/category-service';
import { Router, RouterLink } from '@angular/router';
import { NewCategory, Category } from '../../interfaces/Category';
import { NewProduct, Product } from '../../interfaces/product';
import { FormsModule, NgForm } from '@angular/forms';
import { Spinner } from '../../components/spinner/spinner';

@Component({
  selector: 'app-productos',
  imports: [FormsModule, Spinner,],
  templateUrl: './productos.html',
  styleUrl: './productos.css',
})
export class Productos {
  restaurantService = inject(UsersService)
  productService = inject(ProductService)
  authService = inject(AuthService)
  categoriesService = inject(CategoriesService)
  idProduct = input<number>();
  router = inject(Router)
  productoOriginal: Product | undefined = undefined;
  categories: Category[] = [];
  form = viewChild<NgForm>(`newProductForm`);
  errorBack = false;
  isLoading = false;


  async ngOnInit() {
    if (this.idProduct()) {
      this.productoOriginal = await this.productService.getProductById(this.idProduct()!);
      this.form()?.setValue({
        Name: this.productoOriginal!.name,
        Descripcion: this.productoOriginal!.description,
        Price: this.productoOriginal!.price,
        Destacado: this.productoOriginal!.featured,
        Recomendado: this.productoOriginal!.recommendedFor,
        Descuento: this.productoOriginal!.discount,
        HappyHour: this.productoOriginal!.hasHappyHour,
      })
    }
    await this.categoriesService.getCategoriesByRestaurant(this.authService.getUserId());
  }
  async handleFormSubmission(form: NgForm) {

    this.errorBack = false;
    const nuevoProducto: NewProduct = {
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
    this.isLoading = true;
    if (this.idProduct()) {
      if (this.productoOriginal && parseInt(form.value.discount) !== this.productoOriginal.discount) {
         await this.productService.toggleDiscount(this.idProduct()!, { discount: parseInt(form.value.discount) });
      }
      if (this.productoOriginal && (form.value.hasHappyHour === true) !== this.productoOriginal.hasHappyHour) {
         await this.productService.toggleHappyHour(this.idProduct()!, { toggleHappyHour: form.value.hasHappyHour === true });
      }
      if (this.productoOriginal && (form.value.featured === true) !== this.productoOriginal.isDestacado) {
        await this.productService.toggleDestacado(this.idProduct()!, { isDestacado: form.value.featured === true });
      }
      res = await this.productService.editProduct({
        ...nuevoProducto,
        id: this.idProduct()!
      });
    } else {
      res = await this.productService.addProduct(nuevoProducto);
    }

    this.isLoading = false;

    if (!res) {
      this.errorBack = true;
      return
    };

    this.router.navigate(["/perfiles"]);
  }
}
