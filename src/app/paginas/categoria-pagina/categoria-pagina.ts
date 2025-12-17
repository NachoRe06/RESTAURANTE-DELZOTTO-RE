import { Component, inject, input, viewChild, OnInit } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Router, RouterLink } from '@angular/router'; 
import { CommonModule } from '@angular/common';
import { Spinner } from '../../components/spinner/spinner';
import { AuthService } from '../../service/auth-service';
import { CategoriesService } from '../../service/category-service';
import { NewCategory, Category } from '../../interfaces/Category';

@Component({
  selector: 'app-categoria-pagina',
  imports: [FormsModule, Spinner, CommonModule, RouterLink],
  templateUrl: './categoria-pagina.html',
  styleUrl: './categoria-pagina.css',
})
export class CategoriaPagina {
  private authService = inject(AuthService);
  private categoryService = inject(CategoriesService);
  private router = inject(Router);
  idCategory = input<string>();
  
  form = viewChild<NgForm>("newCategoryForm");
  
  categoryOriginal: Category | undefined = undefined;
  isLoading = false;
  errorBack = false;
  isEditing = false;

  async ngOnInit() {
    this.isLoading = true;
    try {
      const userId = this.authService.getUserId();
      if (!userId) {
        this.router.navigate(['/login']);
        return;
      }

      await this.categoryService.getCategoriesByRestaurant(userId);
      const allCategories = this.categoryService.categories();


      const idParam = this.idCategory();
      
      if (idParam && idParam !== 'nuevo') {
        this.isEditing = true;

        this.categoryOriginal = allCategories.find(c => c.id === Number(idParam));

        if (this.categoryOriginal) {
          setTimeout(() => {
            this.form()?.setValue({
              name: this.categoryOriginal!.name,
            });
          });
        }
      }
    } catch (error) {
      console.error(error);
    } finally {
      this.isLoading = false;
    }
  }

  async handleFormSubmission(form: NgForm) {
    if (form.invalid) return;

    this.isLoading = true;
    this.errorBack = false;
    let res;

    try {
      const userId = this.authService.getUserId();
      
      if (this.isEditing) {
        //MODO EDICIÓN
        const updateData = { name: form.value.name };
       
        res = await this.categoryService.updateCategory(Number(this.idCategory()), updateData);
      } else {
        // MODO CREACIÓN
        const nuevaCategory: NewCategory = {
          name: form.value.name,
          restaurantId: userId,
        };
        res = await this.categoryService.addCategory(nuevaCategory);
      }

      if (res) {
        this.router.navigate(["/perfiles"]);
      } else {
        this.errorBack = true;
      }

    } catch (error) {
      console.error(error);
      this.errorBack = true;
    } finally {
      this.isLoading = false;
    }
  }
}
