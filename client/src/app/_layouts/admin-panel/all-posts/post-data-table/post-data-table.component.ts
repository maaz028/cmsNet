import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Observable } from 'rxjs';
import { Post } from 'src/app/models/post.model';
import { PostService } from 'src/app/services/post.service';

@Component({
  selector: 'app-post-data-table',
  templateUrl: './post-data-table.component.html',
  styleUrls: ['./post-data-table.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class PostDataTableComponent implements OnInit {
  @Input() posts$!: Observable<Post[]>;
  @Output() deletePostEvent = new EventEmitter<string>();
  @Output() featurePostEvent = new EventEmitter<string>();
  @Output() getPostsEvent = new EventEmitter();

  constructor(private _post: PostService) {}

  postImageUrl!: string;
  page: number = 1;
  tableSize: number = 10;

  onTableDataChange(event: any) {
    this.page = event;
  }
  checkRender(): void {
    console.log("check render");
  }

  ngOnInit(): void {
    this._post.refreshRequired$.subscribe(() => this.getPostsEvent.emit());
    this.postImageUrl = this._post.serverImageUrl;
  }

  deletePostEventEmitter<T extends string | undefined>(id: T) {
    this.deletePostEvent.emit(id);
  }

  featurePostEventEmitter<T extends string | undefined>(id: T) {
    this.featurePostEvent.emit(id);
  }
}
