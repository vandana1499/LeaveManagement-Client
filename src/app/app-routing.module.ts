import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProfileComponent } from './profile/profile.component';
import {LoginComponent} from "./feature/auth/login/login.component"
import { NotFoundComponent } from './error/not-found/not-found.component';
import {DataResolver} from "./data.resolver"
import { HomeComponent } from './home/home.component';
import {HttpService} from "./http/http.service"
const routes: Routes = [
  {
    path: '',
    children: [
      {
        path:'',
        component:HomeComponent
      },
      {
        path: 'login',
        component:LoginComponent
      },
      {
        path: 'user-dashboard',
        component: ProfileComponent,
        resolve:{data:DataResolver}

      },
      // {
      //   path:'',
      //   component:BenefitsComponent
      // }
      // {
      //   path: '',
      //   component: HomeComponent
      // },
     
     
    ]
  },
  {
    path: 'admin',
 
    
    loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule)
  },
  {
    path: '**',
    component: NotFoundComponent
  }
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [
    HttpService
  ]
})
export class AppRoutingModule { }
