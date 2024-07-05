import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PostService } from 'src/app/services/post.service';

@Component({
  selector: 'app-post-details',
  templateUrl: './post-details.component.html',
  styleUrls: ['./post-details.component.css'],
})
export class PostDetailsComponent {
  constructor(
    private activatedRoute: ActivatedRoute,
    private post: PostService,

  ) {}

  idParam = this.activatedRoute.snapshot.paramMap.get("id");
  postDetails$ = this.post.singlePost(this.idParam ? this.idParam : '');
  postImageUrl = this.post.serverImageUrl;

}
