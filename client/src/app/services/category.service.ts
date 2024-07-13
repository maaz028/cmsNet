import { Injectable } from '@angular/core';
import { cmsEnv } from '../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject, catchError, map, of, tap } from 'rxjs';
import { Category } from '../models/category.model';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  constructor(private http: HttpClient) {}

  private _refreshRequired$ = new Subject<void>();
  useCache = true;
  categories: Category[] = []
  get refreshRequired$(): any {
    return this._refreshRequired$;
  }

  getCategories(): Observable<Category[]> {
    if (this.useCache) {
      if (this.categories.length > 0) {
        return of(this.categories);
      }
    }

    return this.http
      .get<Category[]>(`${cmsEnv.baseUrl}/Category/Categories`)
      .pipe(
        map((categories) => {
          return this.categories = categories;
          }),tap(() => this.useCache = true)
      );
  }

  addCategory(category: object): Observable<Category> {
    return this.http
      .post<Category>(`${cmsEnv.baseUrl}/Category`, category)
      .pipe(tap(() => {
        this.useCache = false;
        this.refreshRequired$.next()
      }));
  }

  deleteCategory(id: string): Observable<Category> {
    return this.http
      .delete<Category>(`${cmsEnv.baseUrl}/Category/${id}`)
      .pipe(tap(() => {
        this.useCache = false;
        this.refreshRequired$.next()
      }));
  }

  updateCategory(category: Category): Observable<Category> {
    return this.http
      .patch<Category>(`${cmsEnv.baseUrl}/Category`, category)
      .pipe(tap(() => {
        this.useCache = false;
        this.refreshRequired$.next()
      }));
  }

  categoryDetails(id: string): Observable<Category> {
    return this.http.get<Category>(`${cmsEnv.baseUrl}/Category/${id}`);
  }
}
