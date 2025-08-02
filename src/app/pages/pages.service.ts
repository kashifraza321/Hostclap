import { Injectable } from '@angular/core';
import { HttpcommanService } from '../services/httpshared.service';
import { API_CONSTANTS } from '../Constants/api.constant';

@Injectable({
  providedIn: 'root',
})
export class PagesService {
  constructor(private httpService: HttpcommanService) {}
  createPages(pageData: any) {
    return this.httpService.postCall(`${API_CONSTANTS.CREATE_PAGES}`, pageData);
  }
  getPages() {
    return this.httpService.getCall(`${API_CONSTANTS.GET_PAGES}`);
  }
  getPageDetail(pageId: string) {
    return this.httpService.getCall(
      `${API_CONSTANTS.GET_PAGE_DETAIL}/${pageId}`
    );
  }
  updateHeader(pageId: string, section: string, data: any) {
    return this.httpService.patchCall(
      `${API_CONSTANTS.EDIT_HEADER}/${pageId}`,
      {
        section,
        data,
      }
    );
  }
}
