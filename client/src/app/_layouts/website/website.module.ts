import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import {WebsiteRoutingModule} from "./website-routing.module"
import { WebsiteComponent } from './website.component';
import { HeaderComponent } from 'src/app/_layouts/website/header/header.component';
import { PostsComponent } from 'src/app/_layouts/website/posts/posts.component';
import { SharedModule } from 'src/app/shared.module';
import { FooterComponent } from './footer/footer.component';
import { CategorisePostsComponent } from './categorise-posts/categorise-posts.component';
import { SinglePostComponent } from './single-post/single-post.component';

@NgModule({
  declarations: [
    WebsiteComponent,
    HeaderComponent,
    PostsComponent,
    FooterComponent,
    CategorisePostsComponent,
    SinglePostComponent
  ],
  imports: [
    CommonModule,
    WebsiteRoutingModule,
    SharedModule
       ],

})
export class WebsiteModule { }
