import { Routes, RouterModule, PreloadAllModules  } from '@angular/router';
import { ModuleWithProviders } from '@angular/core';
import { LayoutComponent } from './layout/layout.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { AuthGuard } from './auth.guard';
import { DashboardComponent } from './analytics/dashboard/dashboard.component';
import { SuperAdminComponent } from './super-admin/super-admin.component';
import { AdminLayoutComponent } from './admin-layout/admin-layout.component';

export const routes: Routes = [
    {
        path:'oFo',
        component: LayoutComponent, children: [
            { path: '', loadChildren: './mailbox/mailbox.module#MailboxModule', canActivate:[AuthGuard]},
            { path: 'admin', loadChildren: './super-admin/super-admin.module#SuperAdminModule'},
        ]
    },
    { path: '', loadChildren:'./logins/logins.module#LoginsModule', data: { breadcrumb: 'Login' } },
    { path: 'admin', loadChildren:'./super-admin/super-admin.module#SuperAdminModule', data: { breadcrumb: 'Login' } },
    { path: 'survey', loadChildren:'./survey/survey.module#SurveyModule', data: { breadcrumb: 'Login' } },
    { path: '**', component: NotFoundComponent, data: { breadcrumb: 'Not found' }  }
];

export const routing: ModuleWithProviders = RouterModule.forRoot(routes, {
   preloadingStrategy: PreloadAllModules,  // <- comment this line for activate lazy load
   // useHash: true
});