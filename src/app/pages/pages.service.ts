import { Injectable } from '@angular/core';
import { HttpcommanService } from '../services/httpshared.service';
import { API_CONSTANTS } from '../Constants/api.constant';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PagesService {
  constructor(private httpService: HttpcommanService) {}
  // private stateSubject = new BehaviorSubject<{ pages: any[]; preview: any }>({
  //   pages: [],
  //   preview: {},
  // });
  // public state$ = this.stateSubject.asObservable();
  //  SET PAGES
  // setPages(pages: any[]) {
  //   const current = this.stateSubject.getValue();
  //   this.stateSubject.next({ ...current, pages });
  // }

  //  SET PREVIEW (Live Preview for Section)
  // setPreview(section: string, data: any) {
  //   const current = this.stateSubject.getValue();
  //   this.stateSubject.next({
  //     ...current,
  //     preview: {
  //       ...current.preview,
  //       [section]: data,
  //     },
  //   });
  // }

  // getPagesValue(): any[] {
  //   return this.stateSubject.getValue().pages;
  // }

  // new subject
  private stateSubject = new BehaviorSubject<any>({
    pages: [],
    preview: {
      announcement: {},
      logo: {},
      cover: {},
      titles: {},
      menu: {},
      phone: {},
      address: {},
      offer: {},
      services: {},
    },
  });
  state$ = this.stateSubject.asObservable();

  // Update master object deeply
  updatePreviewSection(section: string, value: any) {
    const current = this.stateSubject.getValue();
    this.stateSubject.next({
      ...current,
      preview: {
        ...current.preview,
        [section]: { ...current.preview[section], ...value },
      },
    });
  }

  updatePages(pages: any[]) {
    const current = this.stateSubject.getValue();
    this.stateSubject.next({ ...current, pages });
  }

  // Add single page
  addPage(page: any) {
    const current = this.stateSubject.getValue();
    this.stateSubject.next({ ...current, pages: [...current.pages, page] });
  }

  // Get current value (rarely used)
  getPreviewValue() {
    return this.stateSubject.getValue().preview;
  }

  // new subject

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
      data
    );
  }
  // updateLogoHeader(pageId: string, file: File) {
  //   const formData = new FormData();
  //   formData.append('image', file);

  //   return this.httpService.patchCall(
  //     `${API_CONSTANTS.EDIT_MEDIA_HEADER}/${pageId}`,
  //     formData
  //   );
  // }
  updateLogoHeader(pageId: string, formData: FormData) {
    return this.httpService.patchCall(
      `${API_CONSTANTS.EDIT_MEDIA_HEADER}/${pageId}`,
      formData,
      true
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
  createSection(data: any) {
    return this.httpService.postCall(`${API_CONSTANTS.CREATE_SECTION}`, data);
  }
  createGroup(data: any) {
    return this.httpService.postCall(`${API_CONSTANTS.CREATE_GROUP}`, data);
  }
  GET_SECTION_DETAIL(pageId: string) {
    return this.httpService.getCall(
      `${API_CONSTANTS.GET_SECTION_DETAIL}/${pageId}/service`
    );
  }
}
