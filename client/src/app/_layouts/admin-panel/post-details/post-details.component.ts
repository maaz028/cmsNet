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
    private _activatedRoute: ActivatedRoute,
    private _post: PostService,

  ) {}

  idParam = this._activatedRoute.snapshot.paramMap.get("id");
  postDetails$ = this._post.singlePost(this.idParam ? this.idParam : '');
  postImageUrl = this._post.serverImageUrl;

}
