import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminPanelComponent } from './admin-panel.component';
import { CategoriesComponent } from './categories/categories.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AllPostsComponent } from './all-posts/all-posts.component';
import { NewPostComponent } from './new-post/new-post.component';
import { PostDetailsComponent } from './post-details/post-details.component';
import { ProfileComponent } from './profile/profile.component';
import { authGuard } from 'src/app/guards/auth.guard';
import { PostImagesComponent } from './post-images/post-images.component';

const routes: Routes = [
  {
    path: '',
    component: AdminPanelComponent,
    children: [
      {
        path: 'categories',
        component: CategoriesComponent,
      },
      {
        path: 'manage-posts',
        children: [
          {
            path: '',
            component: AllPostsComponent,
            title: 'Posts | Cody Tech',
          },
          {
            path: 'new',
            component: NewPostComponent,
            title: 'New Post | Cody Tech',
          },
          {
            path: 'edit/:id',
            component: NewPostComponent,
            title: 'Edit Post | Cody Tech',
          },
          {
            path: 'images',
            component: PostImagesComponent,
          },
          {
            path: ':id',
            component: PostDetailsComponent,
            title: 'Post | Cody Tech',
          },
        ],
      },
      {
        path: 'settings',
        component: ProfileComponent,
        title: 'Settings | Cody Tech',
      },
      {
        path: '',
        component: DashboardComponent,
        title: 'Dashboard | Cody Tech',
      },
    ],
    canActivate: [authGuard],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminPanelRoutingModule {}
