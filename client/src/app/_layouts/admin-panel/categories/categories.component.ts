import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormBuilder, NgForm, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Subject, delay, lastValueFrom, map, takeUntil } from 'rxjs';
import { Category } from 'src/app/models/category.model';
import { CategoryService } from 'src/app/services/category.service';
import { PostService } from 'src/app/services/post.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.css'],
})
export class CategoriesComponent implements OnInit, OnDestroy {
  @ViewChild('closeBtn') closeBtn!: ElementRef<any>;

  formGroup: any;

  constructor(
    private _category: CategoryService,
    private toastr: ToastrService,
    private _spinner: NgxSpinnerService,
    private _formBuilder: FormBuilder,
    private _post: PostService
  ) {
    this.formGroup = this._formBuilder.group({
      IDDisabled: [
        {
          value: '',
          disabled: true,
        },
        [Validators.required],
      ],
      ID: ['', [Validators.required]],
      name: ['', [Validators.required, Validators.maxLength(20)]],
    });
  }

  private readonly onDestroy = new Subject<void>();
  categories!: Category[];

  async ngOnInit(): Promise<void> {
    window.scrollTo(0, 0);
    await this.getCategoriesAsync();
  }

  get categoryFC() {
    return this.formGroup.controls;
  }

  async getCategoriesAsync() {
    const categories = this._category.getCategories();

    await lastValueFrom(categories).then((res) => {
      if (res.length > 0) {
        this.categories = res;
      } else {
        this.categories = [];
      }
    });
  }

  async addCategoryAsync(form: NgForm): Promise<void> {
    const categoryAdded$ = this._category.addCategory({
      name: form.value.category,
    });

    this._spinner.show();
    await lastValueFrom(categoryAdded$)
      .then((res) => {
        if (res?.available) {
          this.toastr.error('Category already available!');
        } else this.toastr.success('Data inserted Successfully!');
      })
      .catch(() => {
        this._spinner.hide();
        throw new Error('Server error occurred.');
      });

    form.reset();
    this._spinner.hide();
  }

  deleteCategoryAsync(id: string): void {
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
        this._spinner.show();

        const isCategoryUsed$ = this._post
          .allPosts()
          .pipe(
            map((posts) =>
              posts.length > 0
                ? posts.filter((post) => post.category.catID === id)
                : posts
            )
          );
        await lastValueFrom(isCategoryUsed$).then((res) => {
          if (res.length > 0) {
            this.toastr.warning('Category is being used!');
            this._spinner.hide();
          } else {
            this._category
              .deleteCategory(id)
              .pipe(takeUntil(this.onDestroy))
              .subscribe({
                next: async () => {
                  this.toastr.success(
                    `Data having ID: ${id} deleted Successfully!`
                  );

                  this._spinner.hide();
                },
                error: () => {
                  this.toastr.error('Internal Server Error ocurred.');
                },
              });
          }
        });
      }
    });
  }

  populateCategory(id: string) {
    const singleCategory = this.categories?.filter((res): boolean => {
      return res.id === id;
    });

    this.formGroup.patchValue({
      IDDisabled: singleCategory ? singleCategory[0]?.id : null,
      ID: singleCategory ? singleCategory[0]?.id : null,
      name: singleCategory ? singleCategory[0]?.name : null,
    });
  }

  async updateCategoryAsync(): Promise<void> {
    this._spinner.show();

    const category: Category = {
      id: this.formGroup.value.ID,
      name: this.formGroup.value.name,
    };

    const category$ = this._category.updateCategory(category);

    await lastValueFrom(category$)
      .then((res: any) => {
        if (res?.available) {
          this.toastr.error('Category already available!');
        } else {
          this.toastr.success(
            `Category having ID: ${res.id} is updated Successfully!`
          );
          this.closeBtn.nativeElement?.click();
          this.formGroup.reset();
        }
      })
      .catch(() => this.toastr.error('Internal Server Error...'));

    this._spinner.hide();
  }

  ngOnDestroy(): void {
    this.onDestroy.next();
    this.onDestroy.unsubscribe();
  }
}