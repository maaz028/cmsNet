import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
  Observable,
  Subject,
  map,
  takeUntil,
} from 'rxjs';
import { Post } from 'src/app/models/post.model';
import { PostService } from 'src/app/services/post.service';

@Component({
  selector: 'app-categorise-posts',
  templateUrl: './categorise-posts.component.html',
  styleUrls: ['./categorise-posts.component.css'],
})
export class CategorisePostsComponent implements OnInit {
  constructor(
    private _post: PostService,
    private _activatedRoute: ActivatedRoute
  ) {}

  page: number = 1;
  tableSize: number = 4;
  serverImageUrl = this._post.serverImageUrl;
  posts!: Observable<Post[]>;

  ngOnInit(): void {
    this._activatedRoute.params.subscribe(async (val) => {
     this.posts =  this._post
        .allPosts()
        .pipe(
          map((posts) =>
            posts.length > 0
              ? posts.filter((post) => post.category.catID === val['id'])
              : posts
          )
        )
    });
  }

  onTableDataChange(event: any) {
    this.page = event;
  }

}
