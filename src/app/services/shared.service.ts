import { Injectable, signal } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "../../environments/environment";
import { HttpcommanService } from "./httpshared.service";
@Injectable({
  providedIn: "root"
})
export class CommanService {
  constructor(
  ) { }
}

@Injectable({ providedIn: 'root' })
export class SharedService {
  logoUrl = signal<string>('');

  setLogoUrl(url: string) { debugger
    this.logoUrl.set(url);
  }
}
