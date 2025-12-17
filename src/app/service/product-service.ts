import { inject, Injectable } from '@angular/core';
import { AuthService } from './auth-service';
import { NewProduct, Product } from '../interfaces/product';

@Injectable({
  providedIn: 'root'
})

export class ProductService {
  aleatorio = Math.random();
  authService = inject(AuthService);

  Product: Product[] = [];
  async addProduct (NewProduct:NewProduct) {
    const res = await fetch("https://w370351.ferozo.com/api/products",
      {
        method: "POST",
        headers: {
          Authorization: "Bearer "+this.authService.token,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(NewProduct)
        });

    if (!res.ok) return;
    const resProduct:Product = await res.json();
    this.Product.push(resProduct);
    return resProduct;

}

  async getProductbyrestaurant(restaurantId: number | string): Promise<Product[]> {
    try {
      const url = `https://w370351.ferozo.com/api/Users/${restaurantId}/products`;


      const headers: any = {
        "Content-Type": "application/json"
      };

      if (this.authService.token) {
        headers["Authorization"] = "Bearer " + this.authService.token;
      }

      const res = await fetch(url, {
        method: "GET",
        headers: headers
      });

      if (!res.ok) {
        console.error(`Error ${res.status} obteniendo menú`);
        return [];
      }

      const data = await res.json();
      return data;

    } catch (err) {
      console.error("Error de conexión:", err);
      return [];
    }
  }
  


  async getProductById(id: string | number) {
    const res = await fetch(`https://w370351.ferozo.com/api/products/${id}`, {
      headers: {
        "Authorization": "Bearer " + this.authService.token,
      },
    });

    if (!res.ok) return undefined;
    const resProduct: Product = await res.json();
    return resProduct;
  }
 
  async editProduct(productoEditado: Product) {
    const res = await fetch(`https://w370351.ferozo.com/api/products/${productoEditado.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + this.authService.token,
      },
      body: JSON.stringify(productoEditado)
    });

    if (!res.ok) return undefined;
    return productoEditado;
  }


  async deleteProduct(id: string | number) {
    const res = await fetch(`https://w370351.ferozo.com/api/products/${id}`, { 
      method: "DELETE",
      headers: {
        "Authorization": "Bearer " + this.authService.token,
      },
    });
    return res.ok;
  }

async toggleDestacado(id: string | number, p0: { isDestacado: boolean; }) { 
  const res = await fetch(`https://w370351.ferozo.com/api/products/${id}/destacado`, 
    {
      method: "POST",
      headers:{
        'Content-Type': 'application/json',
        Authorization: "Bearer "+this.authService.token,
      },
      body: JSON.stringify(p0)
    });
  if (!res.ok) return;

this.Product = this.Product.map(Product =>{
if (Product.id === id) {
  return {...Product, isDestacado: !Product.isDestacado};
};
return Product;
});
return true;
}
async toggleHappyHour(id: string | number, p0: { toggleHappyHour: boolean; }) { 
  const res = await fetch("https://w370351.ferozo.com/api/products" + id + "/hayppyhour",
    {
      method: "PUT",
      headers:{
        Authorization: "Bearer "+this.authService.token,
      },
    });
  if (!res.ok) return;

this.Product = this.Product.map(Product =>{
if (Product.id === id) {
  return {...Product, hasHappyHour: !Product.hasHappyHour};
};
return Product;
});
return true;
}
async toggleDiscount(id: string | number, p0: { discount: number; }) { 
  const res = await fetch("https://w370351.ferozo.com/api/products" + id + "/discount",
    {
      method: "PUT",
      headers:{
        Authorization: "Bearer "+this.authService.token,
      },
    });
  if (!res.ok) return;

this.Product = this.Product.map(Product =>{
if (Product.id === id) {
  return {...Product, hasDiscount: !Product.discount}; 
};
return Product;
});
return true;
}
} 