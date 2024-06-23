import { NgModule } from '@angular/core';
import { RouterModule, Routes, provideRouter, withHashLocation } from '@angular/router';
import { ExceptionsComponent } from './exceptions/exceptions.component';
import { LoginComponent } from './login/login.component';
import { NotFoundComponent } from './not-found/not-found.component';

const routes: Routes = [
  {
    path: 'dashboard',
    loadChildren: () =>
      import('./_layouts/admin-panel/admin-panel.module').then(
        (m) => m.AdminPanelModule
      ),
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: '',
    loadChildren: () =>
    import('./_layouts/website/website.module')
    .then(m => m.WebsiteModule)
  },
  {
    path: "exceptions",
    component: ExceptionsComponent
  },
  {
    path: '**',
    redirectTo : '/home',
    pathMatch: "full"
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [
    provideRouter(routes,withHashLocation())
  ]
})
export class AppRoutingModule {}
