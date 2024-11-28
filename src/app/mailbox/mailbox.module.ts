import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { SharedModule } from '../shared/shared.module';
import { PipesModule } from '../theme/pipes/pipes.module';
import { MailboxComponent } from './mailbox.component';
import { MembersComponent } from './members/members.component';
import { OrdersComponent } from './orders/orders.component';
import { TabsModule } from 'ngx-bootstrap';
import { AddCategoryDialogComponent } from './add-category-dialog/add-category-dialog.component';
import { AddItemDialogComponent } from './add-item-dialog/add-item-dialog.component';
import { MatFormFieldModule, MatInputModule } from '@angular/material';
import { ConfirmationPopoverModule } from 'angular-confirmation-popover';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';
import { AuthGuard } from '../auth.guard';

export const routes = [
  { path: '', redirectTo: 'locations', pathMatch: 'full'},
  { path: 'locations', component: MailboxComponent, pathMatch: 'full', data: { breadcrumb: 'Setup Locations'} },
  { path: 'members', component: MembersComponent, pathMatch: 'full', data: { breadcrumb: 'Manage Members'} },
  { path: 'orders', component: OrdersComponent, pathMatch: 'full', data: { breadcrumb: 'Member Orders'} }
];

@NgModule({
  imports: [
    ConfirmationPopoverModule,
    CommonModule,
    TabsModule,
    OwlDateTimeModule, 
    OwlNativeDateTimeModule,
    RouterModule.forChild(routes),
    FormsModule,
    ReactiveFormsModule,
    PerfectScrollbarModule,
    SharedModule,
    PipesModule,
    MatFormFieldModule,
    MatInputModule 
  ],
  declarations: [
    MailboxComponent,
    MembersComponent,
    OrdersComponent,
    AddCategoryDialogComponent,
    AddItemDialogComponent,
  ],
  entryComponents:[AddCategoryDialogComponent,AddItemDialogComponent]
})
export class MailboxModule { }