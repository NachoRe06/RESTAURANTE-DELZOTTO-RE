import { inject, Injectable, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoginData } from '../interfaces/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthService implements OnInit{
  router = inject(Router);
  token : null|string = localStorage.getItem("token");
  revisionTokenInterval: number|undefined;

  ngOnInit(): void {
    if(this.token){
      this.revisionTokenInterval = this.revisionToken()
    }
  }
  


async login(loginData: LoginData): Promise<boolean> {
    try {
      const res = await fetch("https://w370351.ferozo.com/api/Authentication/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(loginData)
      });

      if (res.ok) {

        const responseData = await res.json();
        this.token = responseData.token;

        if (this.token) {
          localStorage.setItem("token", this.token);
        }

        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.error("Error en login:", error);
      return false;
    }
  }

    logout(){
      this.token = null;
      localStorage.removeItem("token");
      this.router.navigate(["/login"]);
    }

  parseJwt(token: string) {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
  };

  revisionToken(){
    return setInterval(() => {
      if(this.token){
        const claims = this.parseJwt(this.token);
        if(new Date(claims.exp * 1000) < new Date()) {
          this.logout()
        }
      }
    }, 600)
  }

  getUserId() {
    if(this.token){
      const claims = this.parseJwt(this.token);
      return claims.sub;
    }
    return null;
  }
}