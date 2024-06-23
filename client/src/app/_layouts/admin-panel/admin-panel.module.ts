import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminPanelRoutingModule } from './admin-panel-routing.module';
import { AdminPanelComponent } from './admin-panel.component';
import { HeaderComponent } from 'src/app/_layouts/admin-panel/header/header.component';
import { DashboardComponent } from 'src/app/_layouts/admin-panel/dashboard/dashboard.component';
import { CategoriesComponent } from './categories/categories.component';
import { SharedModule } from 'src/app/shared.module';
import { AllPostsComponent } from './all-posts/all-posts.component';
import { NewPostComponent } from './new-post/new-post.component';
import { AngularEditorModule } from '@kolkov/angular-editor';
import {HttpClientModule} from '@angular/common/http';
import { PostDetailsComponent } from './post-details/post-details.component';
import { DataTableComponent } from './categories/data-table/data-table.component';
import { PostDataTableComponent } from './all-posts/post-data-table/post-data-table.component';
import { ProfileComponent } from './profile/profile.component';
import { PostImagesComponent } from './post-images/post-images.component'


@NgModule({
  declarations: [
    AdminPanelComponent,
    HeaderComponent,
    DashboardComponent,
    CategoriesComponent,
    AllPostsComponent,
    NewPostComponent,
    PostDetailsComponent,
    DataTableComponent,
    PostDataTableComponent,
    ProfileComponent,
    PostImagesComponent,
  ],
  imports: [
    CommonModule,
    AdminPanelRoutingModule,
    SharedModule,
    AngularEditorModule,
    HttpClientModule,
  ]
})
export class AdminPanelModule { }
