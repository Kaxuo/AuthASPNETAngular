import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { SignInFormComponent } from './components/sign-in-form/sign-in-form.component';
import { RegisterFormComponent } from './components/register-form/register-form.component';
import { MDBBootstrapModule } from 'angular-bootstrap-md';
import {
  NavbarModule,
  WavesModule,
  ButtonsModule,
  TableModule,
} from 'angular-bootstrap-md';
import { MainComponent } from './components/Manager/main/main.component';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { BearerTokenInterceptor } from './services/bearer-token.interceptor';
import { NgxWebstorageModule } from 'ngx-webstorage';
import { ProfilePageComponent } from './components/profile-page/profile-page.component';
import { UpdateProfileComponent } from './components/update-profile/update-profile.component';
import { TasksComponent } from './components/tasks/tasks.component';
import { AddComponent } from './components/tasks/add/add.component';
import { EditComponent } from './components/tasks/edit/edit.component';
import { UserDetailsComponent } from './components/manager/user-details/user-details.component';
import { AddTasksComponent } from './components/manager/add-tasks/add-tasks.component';
import { UserTasksComponent } from './components/manager/user-tasks/user-tasks.component';
import { NotFoundComponent } from './components/errorsPages/not-found/not-found.component';
import { UsersNotFoundComponent } from './components/errorsPages/users-not-found/users-not-found.component';
import { TaskNotFoundComponent } from './components/errorsPages/task-not-found/task-not-found.component';
import { ServerDownComponent } from './components/errorsPages/server-down/server-down.component';
import { NoPrivilegesComponent } from './components/errorsPages/no-privileges/no-privileges.component';
import { SpinnerComponent } from './components/spinner/spinner.component';
import { NgxSpinnerModule } from "ngx-spinner";

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    SignInFormComponent,
    RegisterFormComponent,
    MainComponent,
    ProfilePageComponent,
    UpdateProfileComponent,
    TasksComponent,
    AddComponent,
    EditComponent,
    UserDetailsComponent,
    AddTasksComponent,
    UserTasksComponent,
    NotFoundComponent,
    UsersNotFoundComponent,
    TaskNotFoundComponent,
    ServerDownComponent,
    NoPrivilegesComponent,
    SpinnerComponent,
  ],
  imports: [
    BrowserModule,
    MDBBootstrapModule.forRoot(),
    NavbarModule,
    WavesModule.forRoot(),
    ButtonsModule.forRoot(),
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    TableModule,
    NgxSpinnerModule,
    BrowserAnimationsModule,
    NgxWebstorageModule.forRoot()
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: BearerTokenInterceptor,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
