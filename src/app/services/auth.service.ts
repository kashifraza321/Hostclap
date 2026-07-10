import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { timer, Subscription } from "rxjs";
// import * as jwt from 'jsonwebtoken'

@Injectable({
  providedIn: "root"
})
export class AuthService {
  private inactivityTimer: Subscription | null = null;
  private readonly inactivityDuration = 30 * 60 * 1000; // 30 minutes in milliseconds

  constructor(private router: Router) {
    if (this.isLoggedIn()) {
      this.startInactivityTimer();
      this.setupActivityListeners();
    }
  }

  startTimer(): void {
    this.startInactivityTimer();
    this.setupActivityListeners();
  }

  private setupActivityListeners(): void {
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
    events.forEach(event => {
      document.addEventListener(event, () => this.startInactivityTimer(), true);
    });
  }

  private startInactivityTimer(): void {
    this.inactivityTimer?.unsubscribe();
    this.inactivityTimer = timer(this.inactivityDuration).subscribe(() => {
      this.logout();
    });
  }

  logout(): void {
    localStorage.clear();
    sessionStorage.clear();
    this.inactivityTimer?.unsubscribe();
    this.router.navigate(['/login']);
  }

  private secertKey = 'TapCardiD'

  isLoggedIn(): boolean {
    if (localStorage.getItem("isLoggedIn") == "true") {
      return true;
    } else return false;
  }


  // generateCardData(cardData: any) {
  //   return jwt.sign(cardData, this.secertKey)
  // }




}
