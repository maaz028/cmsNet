import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Observable, lastValueFrom, map } from 'rxjs';
import { Post } from 'src/app/models/post.model';
import { PostService } from 'src/app/services/post.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-all-posts',
  templateUrl: './all-posts.component.html',
  styleUrls: ['./all-posts.component.css'],
})
export class AllPostsComponent implements OnInit {
  constructor(private post: PostService, private toastr: ToastrService) {}

  posts$!: Observable<Post[]>;

  async ngOnInit(): Promise<void> {
    window.scrollTo(0, 0);
    await this.getPostsAsync();
  }

  async getPostsAsync() {
    this.posts$ = this.post.allPosts()
    .pipe(map((res:any) => {
      if (res?.['statusCode'] === 404) {
        this.toastr.error(res?.['message'], res?.['statusCode']);
      }
      return res;
    }));
  }

  deletePostAsync(id: any) {
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
        this.post.deletePost(id).subscribe({
          next: (res) => {
            this.toastr.success(
              `Post having ID: ${res.id} is deleted successfully!`
            );
          },
        });
      }
    });
  }

  async featurePostAsync(id: string) {
    if (confirm('Are you sure ?')) {
      const post$ = this.post.managePostFeatured(id);

      await lastValueFrom(post$)
        .then((res) => {
          this.toastr.success(
            `Post having ID: ${res.id} is Featured successfully!`
          );
        })
        .catch(() => this.toastr.error('Internal Server Error...'));
    }
  }
}
