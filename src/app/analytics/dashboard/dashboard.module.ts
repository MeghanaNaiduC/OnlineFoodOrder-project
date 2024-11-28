import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { SharedModule } from '../../shared/shared.module';
import { DashboardComponent } from './dashboard.component';
import { AngularMultiSelectModule } from 'angular2-multiselect-dropdown';
import { AddCategoryDialogComponent } from './add-category-dialog/add-category-dialog.component';
import { AddCategoryOnlyDialogComponent } from './add-category-only-dialog/add-category-only-dialog.component';

export const routes = [
  { path: '', component: DashboardComponent, pathMatch: 'full' }
];

@NgModule({
  imports: [
    CommonModule,
    AngularMultiSelectModule,
    RouterModule.forChild(routes),
    FormsModule,
    ReactiveFormsModule,
    PerfectScrollbarModule,
    SharedModule,
  ],
  providers: [],
  declarations: [
    DashboardComponent,
    AddCategoryDialogComponent,
    AddCategoryOnlyDialogComponent
  ],
  entryComponents:[AddCategoryDialogComponent, AddCategoryOnlyDialogComponent]
})
export class DashboardModule { }
