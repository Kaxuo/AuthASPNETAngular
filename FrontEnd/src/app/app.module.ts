import { BrowserModule } from '@angular/platform-browser';
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
import { MainComponent } from './components/main/main.component';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { BearerTokenInterceptor } from './services/bearer-token.interceptor';
import { AuthService } from './services/auth.service';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    SignInFormComponent,
    RegisterFormComponent,
    MainComponent,
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
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: BearerTokenInterceptor,
      multi: true,
    },
    AuthService,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
