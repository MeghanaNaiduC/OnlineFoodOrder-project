import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { OverlayContainer } from '@angular/cdk/overlay';
import { CustomOverlayContainer } from './theme/utils/custom-overlay-container';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { PERFECT_SCROLLBAR_CONFIG } from 'ngx-perfect-scrollbar';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';

import { SharedModule } from './shared/shared.module';
import { PipesModule } from './theme/pipes/pipes.module';
import { routing } from './app.routing';

import { AppComponent } from './app.component';
import { LayoutComponent } from './layout/layout.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { AppSettings } from './app.settings';
import { SidenavComponent } from './theme/components/sidenav/sidenav.component';
import { VerticalMenuComponent } from './theme/components/menu/vertical-menu/vertical-menu.component';
import { HorizontalMenuComponent } from './theme/components/menu/horizontal-menu/horizontal-menu.component';
import { BreadcrumbComponent } from './theme/components/breadcrumb/breadcrumb.component';
import { FlagsMenuComponent } from './theme/components/flags-menu/flags-menu.component';
import { FullScreenComponent } from './theme/components/fullscreen/fullscreen.component';
import { ApplicationsComponent } from './theme/components/applications/applications.component';
import { MessagesComponent } from './theme/components/messages/messages.component';
import { UserMenuComponent } from './theme/components/user-menu/user-menu.component';
import { ModalModule } from 'ngx-bootstrap';
import { HashLocationStrategy, LocationStrategy, PathLocationStrategy } from '@angular/common';
import { HttpClientModule, HttpClientJsonpModule  } from '@angular/common/http';
import { ConfirmationPopoverModule } from 'angular-confirmation-popover';
import { ConfirmDialogComponent } from './shared/confirm-dialog/confirm-dialog.component';
import { PasswordDialogComponent } from './theme/components/user-menu/password-dialog/password-dialog.component';
import { MglTimelineModule } from 'angular-mgl-timeline';
import { LoginService } from './logins/login.service';
import { ToasterModule } from 'angular2-toaster';
import {TableModule} from 'primeng/table';
import {TooltipModule} from "ngx-tooltip";
import { AppInterceptorService } from './shared/services/app-interceptor.service';
import { LoaderService } from './shared/services/loader.service';
import { XHRBackend,HttpModule } from '@angular/http';
import { AlertService } from './shared/services/alert.service';
import { DatePipe } from '@angular/common';
import { CookieService, CookieOptions } from 'angular2-cookie/core';
import { TabsModule } from 'ngx-bootstrap';
import { ProfileDialogComponent } from './theme/components/user-menu/profile-dialog/profile-dialog.component';
import { AdminLayoutComponent } from './admin-layout/admin-layout.component';
import { ExcelService } from './shared/services/excel.service';
import { ConfirmSubscriptionCancelDialogComponent } from './theme/components/user-menu/confirm-subscription-cancel-dialog/confirm-subscription-cancel-dialog.component';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';
//import { NgbPopoverModule } from '@ng-bootstrap/ng-bootstrap';

const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  wheelPropagation: true,
  suppressScrollX: true
};

@NgModule({
  imports: [
    //NgbPopoverModule,
    BrowserModule, BrowserAnimationsModule,
    FormsModule,
    TabsModule.forRoot(),
    ReactiveFormsModule,
    TooltipModule,
    PerfectScrollbarModule,
    ToasterModule.forRoot(),
    SharedModule,
    PipesModule,
    routing,
    ModalModule.forRoot(),
    HttpModule,
    HttpClientModule,
    MglTimelineModule,
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
    HttpClientJsonpModule,
    TableModule,
    ConfirmationPopoverModule.forRoot({
      confirmButtonType: 'danger' // set defaults here
    })
  ],
  declarations: [
    AppComponent,
    LayoutComponent,
    ConfirmDialogComponent,
    NotFoundComponent,
    SidenavComponent,
    VerticalMenuComponent,
    HorizontalMenuComponent,
    BreadcrumbComponent,
    FlagsMenuComponent,
    FullScreenComponent,
    ApplicationsComponent,
    MessagesComponent,
    UserMenuComponent,
    PasswordDialogComponent,
    ProfileDialogComponent,
    AdminLayoutComponent,
    ConfirmSubscriptionCancelDialogComponent
  ],
  entryComponents: [
    VerticalMenuComponent,
    PasswordDialogComponent,
    ProfileDialogComponent,
    ConfirmDialogComponent,
    ConfirmSubscriptionCancelDialogComponent
  ],
  providers: [{ provide: LocationStrategy, useClass: PathLocationStrategy },
    AppSettings,
    LoginService,
    ExcelService,
    LoaderService,
    AlertService,
    CookieService,
    AppInterceptorService,
    DatePipe,
    { provide: CookieOptions, useValue: false },
  { provide: PERFECT_SCROLLBAR_CONFIG, useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG },
  { provide: OverlayContainer, useClass: CustomOverlayContainer },
  { provide: XHRBackend, useClass: AppInterceptorService }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }   

//ng module InMemoryWebApiModule.forFeature(Data, { delay: 500 })