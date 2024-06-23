import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule} from "@angular/forms"
import { NgxPaginationModule } from 'ngx-pagination';
import { LimitTextPipe } from './pipes/limit-text.pipe';
import { LoadingSpinnerComponent } from './loading-spinner/loading-spinner.component';


@NgModule({
  declarations: [
    LimitTextPipe,
    LoadingSpinnerComponent
  ],
  imports: [],
  exports:[
    FormsModule,
    ReactiveFormsModule,
    NgxPaginationModule,
    LimitTextPipe,
    LoadingSpinnerComponent

  ],
  providers: [],
})
export class SharedModule { }
