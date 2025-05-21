import { Component, HostListener } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-insight-header',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './insight-header.component.html',
  styleUrl: './insight-header.component.css',
})
export class InsightHeaderComponent {
  constructor(private _router: Router) {}

  isScrolled = false;
  menuOpen = false;

  // toggleMobileMenu() {
  //   this.isMobileMenuOpen = !this.isMobileMenuOpen;
  // }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.isScrolled = window.scrollY > 0;
  }

  logout(): void {
    this.clearToken();
  }
  clearToken(): void {
    const tokenKey = 'token';
    localStorage.removeItem(tokenKey);
    console.log('Token cleared from local storage.');
    this._router.navigate(['/']); 
  }
  // Check if a token exists
  isAuthenticated(): boolean {
    return !!this.getToken();
  }
  // Retrieve token from local storage
  getToken(): string | null {
    const tokenKey = 'token';
    return localStorage.getItem(tokenKey);
  }
  onHeaderClick(): void {
    this.clearToken(); // Clear the token
    this._router.navigate(['/login']);
  }
}
