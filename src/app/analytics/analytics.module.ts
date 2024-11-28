import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthGuard } from '../auth.guard';
export const routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'dashboard', loadChildren: './dashboard/dashboard.module#DashboardModule', pathMatch: 'full', data: { breadcrumb: 'Setup Menu Categories & Items' } },
];

@NgModule({
  imports: [
    CommonModule,FormsModule,
    RouterModule.forChild(routes)
  ],
  declarations: []
})
export class AnalyticsModule { }
