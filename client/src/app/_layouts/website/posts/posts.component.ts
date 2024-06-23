import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Observable, combineLatest, map } from 'rxjs';
import { PostsData } from 'src/app/models/post.model';
import { PostService } from 'src/app/services/post.service';

@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})


export class PostsComponent implements OnInit{

  constructor (
    private _post: PostService,
  ) {}

  serverImageUrl = this._post.serverImageUrl;

  page: number = 1;
  tableSize: number = 3;

  postsData$ !: Observable<PostsData>
  onTableDataChange(event: any) {
    this.page = event;
  }

   ngOnInit(){
    const featuredPosts$ = this._post.getFeaturedPosts();
    const   posts$ = this._post.allPosts();

    this.postsData$ = combineLatest([posts$, featuredPosts$]).pipe(
      map(([posts, featuredPosts])=> {
        return  {posts, featuredPosts}
      })
    )

  }
}
