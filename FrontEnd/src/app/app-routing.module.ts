import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SignInFormComponent } from './components/authentication/sign-in-form/sign-in-form.component';
import { RegisterFormComponent } from './components/authentication/register-form/register-form.component';
import { MainComponent } from './components/Manager/main/main.component';
import { ProfilePageComponent } from './components/users/profile-page/profile-page.component';
import { UpdateProfileComponent } from './components/users/update-profile/update-profile.component';
import { TasksComponent } from './components/users/tasks/tasks.component';
import { AddComponent } from './components/users/tasks/add/add.component';
import { EditComponent } from './components/users/tasks/edit/edit.component';
import { UserDetailsComponent } from './components/manager/user-details/user-details.component';
import { AddTasksComponent } from './components/manager/add-tasks/add-tasks.component';
import { UserTasksComponent } from './components/manager/user-tasks/user-tasks.component';
import { AdminPrivileges } from './services/can-activate.guard';
import { NotFoundComponent } from './components/errorsPages/not-found/not-found.component';
import { UsersNotFoundComponent } from './components/errorsPages/users-not-found/users-not-found.component';
import { TaskNotFoundComponent } from './components/errorsPages/task-not-found/task-not-found.component';
import { ServerDownComponent } from './components/errorsPages/server-down/server-down.component';
import { NoPrivilegesComponent } from './components/errorsPages/no-privileges/no-privileges.component';
import { ProjectsComponent } from './components/manager/projects/allProjects/projects.component';
import { ProjectDetailsComponent } from './components/manager/projects/project-details/project-details.component';
import { AddProjectComponent } from './components/manager/projects/add-project/add-project.component';

const routes: Routes = [
  { path: '', redirectTo: 'signin', pathMatch: 'full' },
  { path: 'users', component: MainComponent, canActivate: [AdminPrivileges] },
  { path: 'signin', component: SignInFormComponent },
  { path: 'register', component: RegisterFormComponent },
  { path: 'profile', component: ProfilePageComponent },
  { path: 'update', component: UpdateProfileComponent },
  { path: 'projects', component: ProjectsComponent },
  { path: 'projects/add', component: AddProjectComponent },
  { path: 'projects/:id', component: ProjectDetailsComponent },
  { path: 'tasks', component: TasksComponent },
  { path: 'tasks/add', component: AddComponent },
  { path: 'tasks/:taskId/edit', component: EditComponent },
  {
    path: 'manage/users/:id',
    component: UserDetailsComponent,
    canActivate: [AdminPrivileges],
  },
  {
    path: 'manage/users/:id/add',
    component: AddTasksComponent,
    canActivate: [AdminPrivileges],
  },
  {
    path: 'manage/users/:id/tasks',
    component: UserTasksComponent,
    canActivate: [AdminPrivileges],
  },
  { path: '404', component: UsersNotFoundComponent },
  { path: 'NoTask', component: TaskNotFoundComponent },
  { path: 'DeadServer', component: ServerDownComponent },
  { path: 'NoPrivileges', component: NoPrivilegesComponent },
  { path: '**', component: NotFoundComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
