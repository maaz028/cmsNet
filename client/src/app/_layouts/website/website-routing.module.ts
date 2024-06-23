import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WebsiteComponent } from './website.component';
import { PostsComponent } from 'src/app/_layouts/website/posts/posts.component';
import { AboutComponent } from 'src/app/_layouts/website/about/about.component';
import { SinglePostComponent } from './single-post/single-post.component';
import { CategoryService } from 'src/app/services/category.service';
import { CategorisePostsComponent } from './categorise-posts/categorise-posts.component';

const routes: Routes = [{ path: '', component: WebsiteComponent,
children:[
  {
    path:"home",
    component:PostsComponent,
    title: "Home | Cody Tech"
  },
  {
    path:"about",
    component:AboutComponent,
    title: "About | Cody Tech"
  },
  {
    path:"category/:id",
    component: CategorisePostsComponent,
    title: "Category | Cody Tech"
  },
  {
    path:"category/:id/post/:id",
    component: SinglePostComponent,
    title: "Category | Cody Tech"

  },
  {
    path:"",
    redirectTo:"home",
    pathMatch: "full"
  }
] }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WebsiteRoutingModule {
  constructor (
    private _category: CategoryService
  ){}

  abc = 'sadasd';
}
