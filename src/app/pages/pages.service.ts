import { Injectable } from '@angular/core';
import { HttpcommanService } from '../services/httpshared.service';
import { API_CONSTANTS } from '../Constants/api.constant';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PagesService {
  constructor(private httpService: HttpcommanService) {}
  private stateSubject = new BehaviorSubject<{ pages: any[]; preview: any }>({
    pages: [],
    preview: {},
  });
  public state$ = this.stateSubject.asObservable();
  //  SET PAGES
  setPages(pages: any[]) {
    const current = this.stateSubject.getValue();
    this.stateSubject.next({ ...current, pages });
  }

  //  SET PREVIEW (Live Preview for Section)
  setPreview(section: string, data: any) {
    const current = this.stateSubject.getValue();
    this.stateSubject.next({
      ...current,
      preview: {
        ...current.preview,
        [section]: data,
      },
    });
  }

  getPagesValue(): any[] {
    return this.stateSubject.getValue().pages;
  }
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
  editPages(pageId: string, data: any) {
    return this.httpService.patchCall(
      `${API_CONSTANTS.EDIT_PAGES}/${pageId}`,
      data
    );
  }
  deletePages(pageId: string) {
    return this.httpService.deleteCall(`${API_CONSTANTS.DELETE_PAGES}`, pageId);
  }
}
