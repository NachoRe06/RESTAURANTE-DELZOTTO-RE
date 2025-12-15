import { inject, Injectable } from "@angular/core";
import { NewUser, User } from "../interfaces/user";
import { AuthService } from "./auth-service";

@Injectable({
    providedIn: 'root'
})
export class UsersService{
authService = inject(AuthService);


    async register(registerData: NewUser){
       return await fetch("https://w370351.ferozo.com/api/users",
            {
                method: "POST",
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(registerData)
            });
            
    }
    users: User[] = []
    
      /** Obtiene los restaurantes del backend */
      async getusers() {
        const res = await fetch("https://w370351.ferozo.com/api/users",
          {
            headers:{
              Authorization: "Bearer "+ this.authService.token,
            }
          }
        )
        const resJson: User[] = await res.json()
        this.users = resJson;
      }
      async getUsersbyId(id: string | number) {
        const res = await fetch("https://w370351.ferozo.com/api/users/" + id,
          {
            method: 'GET',
            headers: {
              'Authorization': 'Bearer ' + this.authService.token,
              'Content-Type': 'application/json'
            }
          });
        if (!res.ok) return;
        const user: User = await res.json();
        return user;
      }
      async deleteUser(id: string | number) {
        const res = await fetch("https://w370351.ferozo.com/api/users/" + id,
           {
          method: 'DELETE',
          headers: {
            'Authorization': 'Bearer ' + this.authService.token,
          }
        });
        if (!res.ok) return false;
        this.users = this.users.filter(user => user.id !== id);
        return true;
      }
      // En user-service.ts

// En user-service.ts

  async updateUser(user: any): Promise<boolean> {
    try {
      // ✅ CORRECCIÓN: Agregamos la 's' -> /api/Users/
      const res = await fetch(`https://w370351.ferozo.com/api/Users/${user.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer " + this.authService.token 
        },
        body: JSON.stringify(user)
      });

      if (!res.ok) {
        console.error("Error al actualizar perfil:", res.status);
        return false;
      }

      return true;
    } catch (error) {
      console.error("Error de red al actualizar usuario:", error);
      return false;
    }
  }
}