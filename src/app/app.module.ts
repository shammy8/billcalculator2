import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireAuthModule } from '@angular/fire/auth';
import {
  AngularFireAuthGuard,
  redirectLoggedInTo,
  redirectUnauthorizedTo,
} from '@angular/fire/auth-guard';
import { SharedModule } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';

import { environment } from 'src/environments/environment';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { MainAppComponent } from './main-app/main-app.component';

const routes: Routes = [
  {
    path: '',
    component: MainAppComponent,
    canActivate: [AngularFireAuthGuard],
    data: {
      authGuardPipe: () => redirectUnauthorizedTo(['login']),
    },
  },
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [AngularFireAuthGuard],
    data: {
      authGuardPipe: () => redirectLoggedInTo(['']),
    },
  },
  // { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  declarations: [AppComponent, LoginComponent, MainAppComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    RouterModule.forRoot(routes),
    ReactiveFormsModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,
    AngularFireAuthModule,
    SharedModule,
    ButtonModule,
    DropdownModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
