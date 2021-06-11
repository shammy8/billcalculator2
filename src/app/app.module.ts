import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router';
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireAuthModule } from '@angular/fire/auth';

import { environment } from 'src/environments/environment';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { MainAppComponent } from './main-app/main-app.component';

const routes: Routes = [
  { path: '', component: MainAppComponent },
  {
    path: 'login',
    component: LoginComponent,
  },
  // { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  declarations: [AppComponent, LoginComponent, MainAppComponent],
  imports: [
    BrowserModule,
    RouterModule.forRoot(routes),
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,
    AngularFireAuthModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
