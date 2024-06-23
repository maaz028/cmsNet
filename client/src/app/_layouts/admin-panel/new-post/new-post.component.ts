import { Component, OnInit } from '@angular/core';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { FormBuilder, Validators } from '@angular/forms';
import { CategoryService } from 'src/app/services/category.service';
import { lastValueFrom } from 'rxjs';
import { NgxSpinnerService } from 'ngx-spinner';
import { Post } from 'src/app/models/post.model';
import { ToastrService } from 'ngx-toastr';
import { PostService } from 'src/app/services/post.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-new-post',
  templateUrl: './new-post.component.html',
  styleUrls: ['./new-post.component.css'],
})
export class NewPostComponent implements OnInit {
  editorConfig: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    height: '40rem',
    minHeight: '0',
    maxHeight: 'auto',
    width: 'auto',
    minWidth: '0',
    translate: 'yes',
    sanitize: false,
    enableToolbar: true,
    showToolbar: true,
    placeholder: 'Enter text here...',
    fonts: [
      { class: 'arial', name: 'Arial' },
      { class: 'times-new-roman', name: 'Times New Roman' },
      { class: 'calibri', name: 'Calibri' },
      { class: 'comic-sans-ms', name: 'Comic Sans MS' },
    ],
    customClasses: [
      {
        name: 'quote',
        class: 'quote',
      },
      {
        name: 'redText',
        class: 'redText',
      },
      {
        name: 'titleText',
        class: 'titleText',
        tag: 'h1',
      },
    ],
    uploadUrl: 'v1/image',
  };

  postId!: string;

  constructor(
    private fb: FormBuilder,
    private _category: CategoryService,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    private _post: PostService,
    private _activatedRoute: ActivatedRoute,
    private _router: Router
  ) {
    this.formGroup = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(10)]],
      excerpt: ['', [Validators.required, Validators.minLength(50)]],
      category: ['', [Validators.required]],
      content: ['', [Validators.required, Validators.minLength(100)]],
    });

    this._activatedRoute.params.subscribe((res) => {
      this.postId = res?.['id'];
    });
  }

  isPhotoUploaded: boolean = false;
  uploadButtonText: string = 'Upload';
  permalink: string = '';
  imgSrc: string = '';
  formGroup?: any;
  categories$ = this._category.getCategories();
  isEditPost: boolean = false;

  private postDetails!: Post;
  private selectedFile!: File;
  private imagePath!: string;

  async ngOnInit() {
    this.spinner.show();

    if (this.postId) {
      this.isEditPost = true;
      await this.getPostDetailsAsync();
      this.populatePost(this.postDetails);
    }

    this.spinner.hide();
  }

  private populatePost(post: Post): void {
    this.formGroup.patchValue({
      title: post.title,
      excerpt: post.excerpt,
      category: post.category.catID + '@' + post.category.catName,
      content: post.content,
    });

    this.permalink = post.permalink;
    this.imgSrc = this._post.serverImageUrl + post.postImgPath;
    this.imagePath = post.postImgPath;
    this.isPhotoUploaded = true;
  }

  private async getPostDetailsAsync(): Promise<void> {
    const postDetails$ = this._post.singlePost(this.postId);

    await lastValueFrom(postDetails$)
      .then((res) => {
        this.postDetails = res;
      })
      .catch(() => console.error('Internal Server Error...'));
  }

  get fc() {
    return this.formGroup.controls;
  }

  fillPermalink(event: any): void {
    let permalink = event?.target.value.replaceAll(' ', '-');
    this.permalink = permalink;
  }

  async showPreview(event: any): Promise<void> {
    try {
      this.isPhotoUploaded = false;
      this.uploadButtonText = 'Upload';
      this.selectedFile = event.target.files[0];

      const reader = new FileReader();

      reader.onload = (e: any): void => {
        this.imgSrc = e.target.result;
      };

      reader.readAsDataURL(event.target.files[0]);
    } catch (err: any) {
      console.error(err);
      this.imgSrc = '';
    }
  }

  async uploadToServer() {
    if (this.selectedFile) {
      let postImageFormData = new FormData();

      postImageFormData.append('photo', this.selectedFile);
      postImageFormData.append('name', this.selectedFile.name);
      postImageFormData.append('size', this.selectedFile.size.toString());
      postImageFormData.append('type', this.selectedFile.type);

      this.spinner.show();
      const postImageUpload$ = this._post.uploadPostImage(postImageFormData);

      await lastValueFrom(postImageUpload$)
        .then((res) => {
          this.imagePath = res.photoPath;
          this.toastr.success('Image uploaded to the Server');
          this.isPhotoUploaded = true;
          this.uploadButtonText = 'Uploaded';
        })
        .catch(() => this.toastr.error('Internal Server Error...'));

      this.spinner.hide();
    } else this.toastr.warning('Select Image !...');
  }

  async onSubmitAsync(): Promise<void> {
    let category = this.formGroup.value.category.split('@');

    const postData: Post = {
      id: this.postId,
      title: this.formGroup.value.title,
      permalink: this.permalink,
      category: {
        catID: category[0],
        catName: category[1],
      },
      postImgPath: this.imagePath,
      excerpt: this.formGroup.value.excerpt,
      content: this.formGroup.value.content,
    };

    this.spinner.show();

    if (!this.postId) {
      const post$ = this._post.addPost(postData);

      await lastValueFrom(post$)
        .then((res) => {
          if (res?.message) {
            this.toastr.error(res?.message);
          } else {
            this.toastr.success('Post created successfully !');
            this._router.navigate(['/dashboard/manage-posts']);
          }

          this.formGroup.reset();
          this.permalink = '';
          this.imgSrc = '';
        })
        .catch(() => console.error('Internal Server Error...'));
    } else {
      const postEdit$ = this._post.updatePost(postData);

      await lastValueFrom(postEdit$)
        .then((res) => {
          if (res?.message) {
            this.toastr.error(res?.message);
          } else {
            this.toastr.success('Post updated successfully !');
            this._router.navigate(['/dashboard/manage-posts']);
          }

          this._router.navigate(['/dashboard/manage-posts']);
        })
        .catch(() => this.toastr.error('Internal Server Error...'));
    }

    this.spinner.hide();
  }
}
