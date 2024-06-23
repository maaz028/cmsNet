import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Observable, lastValueFrom } from 'rxjs';
import { PostImage } from 'src/app/models/post-image.model';
import { PostService } from 'src/app/services/post.service';

@Component({
  selector: 'app-post-images',
  templateUrl: './post-images.component.html',
  styleUrls: ['./post-images.component.css'],
})
export class PostImagesComponent implements OnInit{
  constructor (
    private _post: PostService,
    private _toastr: ToastrService,
    private _spinner: NgxSpinnerService
  ){}

  postImages$ !: Observable<PostImage[]>;
  page: number = 1;
  tableSize: number = 10;
  serverUrl: string = this._post.serverImageUrl;

  onTableDataChange(event: any) {
    this.page = event;
  }

  getAllPostImages() {
    this.postImages$ = this._post.geAllPostImages();
  }

  ngOnInit(): void {
    this.getAllPostImages();
  }

  async deleteImage(id: string) {
    if (confirm('Are You sure you want to delete?')){
      const model$ =  this._post.deletePostImage(id);

      this._spinner.show();
      await lastValueFrom(model$).then((res)=>{
        if (res) {
          this._toastr.success(
            `Post Image having ID: ${res.id} is deleted successfully!`
          );
        } else {
          console.error("Internal server error ocurred.")
        }
      })
      .catch((err)=> console.error(err))
      this._spinner.hide();

      this.getAllPostImages();
    }

  }

}
