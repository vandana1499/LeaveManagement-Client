import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ProfileComponent } from './profile/profile.component';
import { LoginComponent } from './feature/auth/login/login.component';
import { NotFoundComponent } from './error/not-found/not-found.component';
import { SharedModuleModule } from './shared-module/shared-module.module';
import {ReactiveFormsModule} from "@angular/forms";
import { HomeComponent } from './home/home.component'
import {HttpClientModule} from "@angular/common/http";
import { SchedulerModule } from '@progress/kendo-angular-scheduler';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TreeViewModule } from '@progress/kendo-angular-treeview';






@NgModule({
  declarations: [
    AppComponent,
    ProfileComponent,
    LoginComponent,
    NotFoundComponent,
    HomeComponent,
   
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    SharedModuleModule,
    ReactiveFormsModule,
    HttpClientModule,
    SchedulerModule,
    BrowserAnimationsModule,
    TreeViewModule,

  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
