import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Observable } from 'rxjs';
import { Category } from 'src/app/models/category.model';
import { CategoryService } from 'src/app/services/category.service';

@Component({
  selector: 'app-data-table',
  templateUrl: './data-table.component.html',
  styleUrls: ['./data-table.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DataTableComponent implements OnInit {

  @Input() categories!: Category[];
  @Output() populateCategoryEvent = new EventEmitter<string>();
  @Output() deleteCategoryEvent = new EventEmitter<string>();
  @Output() callCategoriesEvent = new EventEmitter()

  constructor(
    private category: CategoryService
  ) { }
  page: number = 1;
  tableSize: number = 10;

  ngOnInit() {
    this.category.refreshRequired$
      .subscribe(() => {
        this.callCategoriesEvent.emit(null);
      })
  }

  populateCategoryEventEmitter(id: string) {
    this.populateCategoryEvent.emit(id);
  }

  deleteCategoryEventEmitter(id: string) {
    this.deleteCategoryEvent.emit(id);
  }

  onTableDataChange(event: any) {
    this.page = event;
  }

  refereshCategories(index: number, category: Category): string {
    return category.id;
  }
}
