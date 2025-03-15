
import { Injectable } from '@angular/core';
import { API_CONSTANTS } from '../../../Constants/api.constant';
import { HttpcommanService } from '../../../services/httpshared.service';

@Injectable({
  providedIn: 'root'
})
export class ReviewManagementService {
  ///changes
  constructor(private httpService: HttpcommanService) { }


  getOrderList(page: number, limit: number, search: string) {
    let url = `${API_CONSTANTS.ORDER_LIST}?limit=${limit}&page=${page}&search=${search}`;
    return this.httpService.getCall(`${url}`)
  }
}
