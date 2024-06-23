import { Injectable } from '@angular/core';
import { cmsEnv } from '../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject, catchError, of, tap } from 'rxjs';
import { Category } from '../models/category.model';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  constructor(private http: HttpClient) {}

  private _refreshRequired$ = new Subject<void>();

  get refreshRequired$(): any {
    return this._refreshRequired$;
  }

  getCategories(): Observable<Category[]> {
    return this.http
      .get<Category[]>(`${cmsEnv.baseUrl}/Category/GetCategories`)
      .pipe(
        catchError(() => {
          return of([]);
        })
      );
  }

  addCategory(category: object): Observable<Category> {
    return this.http
      .post<Category>(`${cmsEnv.baseUrl}/Category/CreateCategory`, category)
      .pipe(tap(() => this.refreshRequired$.next()));
  }

  deleteCategory(id: string): Observable<Category> {
    return this.http
      .delete<Category>(`${cmsEnv.baseUrl}/Category/DeleteCategory?id=${id}`)
      .pipe(tap(() => this.refreshRequired$.next()));
  }

  updateCategory(category: Category): Observable<Category> {
    return this.http
      .patch<Category>(`${cmsEnv.baseUrl}/Category/UpdateCategory`, category)
      .pipe(tap(() => this.refreshRequired$.next()));
  }

  categoryDetails(id: string): Observable<Category> {
    return this.http.get<Category>(`${cmsEnv.baseUrl}/Category//api/Category/GetSingleCategory/${id}`);
  }
}
