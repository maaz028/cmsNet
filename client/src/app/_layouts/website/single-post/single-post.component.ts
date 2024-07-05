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
    private activatedRoute: ActivatedRoute,
    private post: PostService,
    private route: Router
  ) {}

  serverImageUrl = this.post.serverImageUrl;
  categoryId = this.route.url.split('/')[2];
  page: number = 1;
  tableSize: number = 3;
  postImageUrl = this.post.serverImageUrl;

  postDetailsData$!: Observable<PostsDetailsData>;

  onTableDataChange(event: any) {
    this.page = event;
  }

  async ngOnInit() {
    this.activatedRoute.params.subscribe((res) => {
      const postDetails$ = this.post.singlePost(res['id'] ? res['id'] : '');

      const nextPosts$ = this.post
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
