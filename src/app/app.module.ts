import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { ClipboardModule } from '@angular/cdk/clipboard';
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireAuthModule } from '@angular/fire/auth';
import {
  AngularFireAuthGuard,
  redirectLoggedInTo,
  redirectUnauthorizedTo,
} from '@angular/fire/auth-guard';
import { ConfirmationService, SharedModule } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { DataViewModule } from 'primeng/dataview';
import { MultiSelectModule } from 'primeng/multiselect';
import { InputSwitchModule } from 'primeng/inputswitch';
import { TooltipModule } from 'primeng/tooltip';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { CalendarModule } from 'primeng/calendar';
import { ChipsModule } from 'primeng/chips';
import { MenuModule } from 'primeng/menu';
import { SidebarModule } from 'primeng/sidebar';
import { SplitButtonModule } from 'primeng/splitbutton';
import { DividerModule } from 'primeng/divider';
import { ConfirmPopupModule } from 'primeng/confirmpopup';

import { environment } from 'src/environments/environment';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { MainAppComponent } from './main-app/main-app.component';
import { BillComponent } from './bill/bill.component';
import { AddItemComponent } from './add-item/add-item.component';
import { AddBillComponent } from './add-bill/add-bill.component';
import { AddUsersEditorsComponent } from './add-users-editors/add-users-editors.component';
import { CalculateComponent } from './calculate/calculate.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { ItemComponent } from './item/item.component';
import { OrderModule } from 'ngx-order-pipe';

const routes: Routes = [
  {
    path: '',
    component: MainAppComponent,
    canActivate: [AngularFireAuthGuard],
    data: {
      authGuardPipe: () => redirectUnauthorizedTo(['login']),
    },
    children: [{ path: ':billId', component: BillComponent }],
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
  declarations: [
    AppComponent,
    LoginComponent,
    MainAppComponent,
    BillComponent,
    AddItemComponent,
    AddBillComponent,
    AddUsersEditorsComponent,
    CalculateComponent,
    ItemComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    RouterModule.forRoot(routes),
    FormsModule,
    ReactiveFormsModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule.enablePersistence(),
    AngularFireAuthModule,
    SharedModule,
    ButtonModule,
    DropdownModule,
    DataViewModule,
    MultiSelectModule,
    InputSwitchModule,
    TooltipModule,
    DialogModule,
    InputTextModule,
    InputNumberModule,
    CalendarModule,
    ChipsModule,
    MenuModule,
    SidebarModule,
    SplitButtonModule,
    DividerModule,
    ClipboardModule,
    ConfirmPopupModule,
    OrderModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: environment.production,
      // Register the ServiceWorker as soon as the app is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000',
    }),
  ],
  providers: [ConfirmationService],
  bootstrap: [AppComponent],
})
export class AppModule {}
