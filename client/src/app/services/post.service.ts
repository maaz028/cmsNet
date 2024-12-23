import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, Subject, map, of, tap } from 'rxjs';

import { cmsEnv } from 'src/environments/environment.development';
import { PhotoImage, Post } from '../models/post.model';
import { PostImage } from '../models/post-image.model';

@Injectable({
  providedIn: 'root',
})
export class PostService {
  serverImageUrl: string = 'https://localhost:49409/';
  constructor(private http: HttpClient) {}

  posts: Post[] = [];
  postsByCategory: Post[] = [];
  useCache = true;

  private _refreshRequired$ = new Subject<void>();

  get refreshRequired$() {
    return this._refreshRequired$;
  }

  uploadPostImage(imageData: FormData): Observable<PhotoImage> {
    return this.http.post<PhotoImage>(
      `${cmsEnv.baseUrl}/Post/Upload-Post-Image`,
      imageData
    );
  }

  addPost(postData: Post): Observable<Post> {
    return this.http
      .post<Post>(`${cmsEnv.baseUrl}/Post`, postData)
      .pipe(tap(() => (this.useCache = false)));
  }

  allPosts(): Observable<Post[]> {
    //caching posts
    if (this.useCache) {
      if (this.posts.length > 0) {
        return of(this.posts);
      }
    }

    return this.http
      .get<Post[]>(`${cmsEnv.baseUrl}/Post/Posts`)
      .pipe(map((posts) => (this.posts = posts))
      ,tap(() => (this.useCache = true)));
  }

  deletePost(id: string): Observable<Post> {
    return this.http
      .delete<Post>(`${cmsEnv.baseUrl}/Post/${id}`)
      .pipe(
        tap(() => {
          this.useCache = false;
          this.refreshRequired$.next();
        })
      );
  }

  singlePost(id: string): Observable<Post> {
    const post = this.posts.find((p) => p.id === id);

    //caching single post
    if (post) {
      return of(post);
    }

    return this.http.get<Post>(`${cmsEnv.baseUrl}/Post`, {
      params: new HttpParams().set('id', id),
    });
  }

  updatePost(post: Post): Observable<Post> {
    return this.http
      .patch<Post>(`${cmsEnv.baseUrl}/Post`, post)
      .pipe(tap(() => (this.useCache = false)));
  }

  managePostFeatured(id: string): Observable<Post> {
    return this.http
      .get<Post>(`${cmsEnv.baseUrl}/Post/Toggle-Feature-Post/${id}`)
      .pipe(
        tap(() => {
          this.useCache = false;
          this.refreshRequired$.next();
        })
      );
  }

  getFeaturedPosts(): Observable<Post[]> {
    if (this.useCache && this.posts.length > 0) {
      return of(this.posts).pipe(
        map((posts) => posts.filter((post) => post.isFeatured))
      );
    }

    return this.http.get<Post[]>(`${cmsEnv.baseUrl}/Post/Featured-Posts`);
  }

  getPostsByCategory<T>(id: T): Observable<Post[]> {
    if (this.postsByCategory.length > 0) {
      if (this.postsByCategory[0].category.catID === id) {
        return of(this.postsByCategory);
      }
    }

    return this.http
      .get<Post[]>(`${cmsEnv.baseUrl}/Post/Categorise-Posts/${id}`)
      .pipe(map((posts) => (this.postsByCategory = posts)));
  }

  geAllPostImages(): Observable<PostImage[]> {
    return this.http.get<PostImage[]>(`${cmsEnv.baseUrl}/Post/Post-Images`);
  }

  deletePostImage(id: string): Observable<PostImage> {
    return this.http
      .delete<PostImage>(`${cmsEnv.baseUrl}/Post/Delete-Post-Image`, {
        params: new HttpParams().set('id', id),
      })
      .pipe(tap(() => this.refreshRequired$.next()));
  }
}
