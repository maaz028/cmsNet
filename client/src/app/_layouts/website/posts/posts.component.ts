import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Observable, combineLatest, map } from 'rxjs';
import { PostsData } from 'src/app/models/post.model';
import { PostService } from 'src/app/services/post.service';

@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PostsComponent implements OnInit {
  constructor(private post: PostService,
    private toastr: ToastrService
  ) {}

  serverImageUrl = this.post.serverImageUrl;

  page: number = 1;
  tableSize: number = 3;

  postsData$!: Observable<PostsData>;
  onTableDataChange(event: any) {
    this.page = event;
  }

  ngOnInit() {
    const featuredPosts$ = this.post.getFeaturedPosts();
    const posts$ = this.post.allPosts()
    .pipe(map((res:any) => {
      if (res?.['statusCode'] === 404) {
        this.toastr.error(res?.["message"], res?.["statusCode"])
      }
      return res;
    }));

    this.postsData$ = combineLatest([posts$, featuredPosts$]).pipe(
      map(([posts, featuredPosts]) => {
        return { posts, featuredPosts };
      })
    );
  }
}
