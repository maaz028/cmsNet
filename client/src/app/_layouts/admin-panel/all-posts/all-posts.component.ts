import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Observable, delay, lastValueFrom } from 'rxjs';
import { Post } from 'src/app/models/post.model';
import { PostService } from 'src/app/services/post.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-all-posts',
  templateUrl: './all-posts.component.html',
  styleUrls: ['./all-posts.component.css'],
})
export class AllPostsComponent implements OnInit {
  constructor(
    private _post: PostService,
    private _toastr: ToastrService,
    private _spinner: NgxSpinnerService,
  ) {}

  posts$ !: Observable<Post[]>;

  async ngOnInit(): Promise<void> {
    window.scrollTo(0,0)
    await this.getPostsAsync();
  }

  async getPostsAsync() {
     this.posts$ = this._post.allPosts();
  }

  deletePostAsync(id: any) {
    this._spinner.show();

    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    }).then(async (result) => {
      if (result.isConfirmed) {
        this._post.deletePost(id).subscribe({
          next: (res) => {
            this._toastr.success(
              `Post having ID: ${res.id} is deleted successfully!`
            );
          },
          error: () => this._toastr.error('Internal Server Error ocurred.'),
        });
      }
    });

    this._spinner.hide();
  }

  async featurePostAsync(id: string) {
    if (confirm('Are you sure ?')) {
      this._spinner.show();

      const post$ = this._post.managePostFeatured(id);

      await lastValueFrom(post$)
        .then((res) => {
          this._toastr.success(
            `Post having ID: ${res.id} is Featured successfully!`
          );
        })
        .catch(() => this._toastr.error('Internal Server Error...'));

      this._spinner.hide();
    }
  }
}
