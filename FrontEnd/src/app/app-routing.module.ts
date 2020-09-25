import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SignInFormComponent } from './components/sign-in-form/sign-in-form.component';
import { RegisterFormComponent } from './components/register-form/register-form.component';
import { MainComponent } from './components/main/main.component';
import { ProfilePageComponent } from './components/profile-page/profile-page.component';
import { UpdateProfileComponent } from './components/update-profile/update-profile.component';
import { TasksComponent } from './components/tasks/tasks.component';
import { AddComponent } from './components/tasks/add/add.component';
import { EditComponent } from './components/tasks/edit/edit.component';

const routes: Routes = [
  { path: '', component: MainComponent },
  { path: 'signin', component: SignInFormComponent },
  { path: 'register', component: RegisterFormComponent },
  { path: 'profile', component: ProfilePageComponent },
  { path: 'update', component: UpdateProfileComponent },
  { path: 'tasks', component: TasksComponent },
  { path: 'tasks/add', component: AddComponent },
  { path: 'tasks/:taskId/edit', component: EditComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
