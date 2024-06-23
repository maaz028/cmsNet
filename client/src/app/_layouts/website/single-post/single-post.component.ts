import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  Observable,
  combineLatest,
  map,
} from 'rxjs';
import { PostsDetailsData } from 'src/app/models/post.model';
import { PostService } from 'src/app/services/post.service';

@Component({
  selector: 'app-single-post',
  templateUrl: './single-post.component.html',
  styleUrls: ['./single-post.component.css'],
})
export class SinglePostComponent implements OnInit {
  constructor(
    private _activatedRoute: ActivatedRoute,
    private _post: PostService,
    private _route: Router
  ) {}

  serverImageUrl = this._post.serverImageUrl;
  categoryId = this._route.url.split('/')[2];
  page: number = 1;
  tableSize: number = 3;
  postImageUrl = this._post.serverImageUrl;

  postDetailsData$!: Observable<PostsDetailsData>;

  onTableDataChange(event: any) {
    this.page = event;
  }

  async ngOnInit() {
    this._activatedRoute.params.subscribe((res) => {
      const postDetails$ = this._post.singlePost(res['id'] ? res['id'] : '');

      const nextPosts$ = this._post
        .getPostsByCategory(this.categoryId)
        .pipe(
          map((posts) =>
            posts.length > 0
              ? posts.filter((post) => post.id !== res['id'])
              : posts
          )
        );

      this.postDetailsData$ = combineLatest([postDetails$, nextPosts$]).pipe(
        map(([postDetails, nextPosts]) => {
          return { postDetails, nextPosts };
        })
      );
    });
  }
}
