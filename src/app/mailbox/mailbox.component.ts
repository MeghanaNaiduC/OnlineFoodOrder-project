import { Component, OnInit, ViewChild, HostListener, ElementRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar, MatDialog } from '@angular/material';
import { AppSettings } from '../app.settings';
import { Settings } from '../app.settings.model';
import { Mail } from './mail.model';
import { MailboxService } from './mailbox.service';
import { DashboardService } from '../analytics/dashboard/dashboard.service';
import { AlertService } from '../shared/services/alert.service';
import { AddCategoryDialogComponent } from './add-category-dialog/add-category-dialog.component';
import { Menu } from '../theme/components/menu/menu.model';
import { AddItemDialogComponent } from './add-item-dialog/add-item-dialog.component';
import { ConfirmDialogComponent } from '../shared/confirm-dialog/confirm-dialog.component';
import { ProfileDialogComponent } from '../theme/components/user-menu/profile-dialog/profile-dialog.component';
import { TabsetComponent } from 'ngx-bootstrap';
import { Router } from '@angular/router';

@Component({
  selector: 'app-mailbox',
  templateUrl: './mailbox.component.html',
  styleUrls: ['./mailbox.component.scss'],
  providers: [MailboxService]
})

export class MailboxComponent implements OnInit {
  @ViewChild('sidenav') sidenav: any;
  public settings: Settings;
  public sidenavOpen: boolean = true;
  public mails: Array<Mail>;
  public mail: Mail;
  public menus: any;
  public newMail: boolean;
  public type: string = 'all';
  public searchText: string;
  public form: FormGroup;
  public categories: any;
  public items: any;
  public categoryItems: any = [];
  public menuSectionCategories: any = [];
  public user: any;
  public passService: boolean = false;
  public menuSectionIds = [];
  message:string;
  //public activeTab: any = 0;
  @ViewChild('staticTabs') staticTabs: TabsetComponent;
  constructor(public appSettings: AppSettings, public dialog: MatDialog,
    public alertService: AlertService,
    public dashboardService: DashboardService,
    public formBuilder: FormBuilder,
    public snackBar: MatSnackBar,
    public router: Router,
    private mailboxService: MailboxService) {
    this.settings = this.appSettings.settings;
  }


  ngOnInit() {
      this.user = JSON.parse(localStorage.getItem('login_user_info'));
      if(this.user && !this.user.courseData.is_signup_completed) {
        this.user.canCancel = 0;
        this.openProfileDialog(this.user);
      } else {
        if (window.innerWidth <= 992) {
          this.sidenavOpen = false;
        }
        this.form = this.formBuilder.group({
          'to': ['', Validators.required],
          'cc': null,
          'subject': null,
          'message': null
        });
        this.getMenuSections({ "courseId": this.user.courseId });
        this.getMails();
        this.dashboardService.currentMessage.subscribe(message => {
  
          this.getMenuSections({ "courseId": this.user.courseId });
          this.getMails();
        });
  
        this.user = JSON.parse(localStorage.getItem('login_user_info'));
        this.getMenuSections({ "courseId": this.user.courseId });
        this.getMails();    
        if (window.innerWidth <= 992) {
          this.sidenavOpen = false;
        }
        this.form = this.formBuilder.group({
          'to': ['', Validators.required],
          'cc': null,
          'subject': null,
          'message': null
        });
      }
  }

  public openProfileDialog(id) {
    let dialogRef = this.dialog.open(ProfileDialogComponent, {
      data: id,
      height: 'auto',
      width: '65%',
      autoFocus: false
    });
    dialogRef.afterClosed().subscribe(data => {
      this.router.navigate(['/']);
    });
  }


  
  public addCategory(userInfo) {
    let dialogRef = this.dialog.open(AddCategoryDialogComponent, {
      data: userInfo,
      height: 'auto',
      width: '600px',
      autoFocus: false
    });
    dialogRef.afterClosed().subscribe(data => {
      if (data === "save") {
        this.getMenuSections({ "courseId": this.user.courseId });
      }
    });
  }

  public addItem(userInfo) {
    if(userInfo.menuSectionId)
      userInfo.category_id = userInfo.id;
    userInfo.courseId = this.user.courseId;
    let dialogRef = this.dialog.open(AddItemDialogComponent, {
      data: userInfo,
      height: 'auto',
      width: '300px',
      autoFocus: false
    });
    dialogRef.afterClosed().subscribe(data => {
      if (data === "save") {
        this.getMenuSections({ "courseId": this.user.courseId });
      }
    });
  }

  getMenuSections(obj) {
    this.menuSectionIds = [];
    this.dashboardService.getMenuSections(obj).then(data => {
      if (data.success) {
        this.menus = data.results;
        if (this.menus) {
          this.menuSectionIds = this.menus.map(t => t._id);
        }
        this.getMenuCategories(this.menus[0]);
        //this.getItems({});
      }
      else {
        this.alertService.createAlert(data.message, 0);
      }
    });
  }

  getMenuCategories(obj) {
    this.dashboardService.getMenuCategories(obj).then(data => {
      if (data.success) {
        this.categories = data.results;
/*populating no.of popular items beside category name*/
        let ab = [];
        this.categories.forEach((val, key) => {
          if (val) {
            ab[key] = val.tbl_items.filter((item, itemkey) => {
              return item.is_popular && item.is_popular == true;
            });
            if (ab[key].length > 0) {
              this.categories[key].popular_item_num = '(' + ab[key].length + ')';
            } else {
              this.categories[key].popular_item_num = '(0)';
            }
          }
        });

        this.categories.push({ 'category_name': "+", 'menuSectionId': null, '_id': "5cede5343e971c01c5bbcd7c" });
      }
    });

  }

  getCategories(obj) {
    this.dashboardService.getCategories(obj).then(data => {
      if (data.success) {
        this.categories = data.results;
      }
      else {
        this.alertService.createAlert(data.message, 0);
      }
    })
  }

  updateMenuStatus(type, status) {
    this.dashboardService.updateMenuStatus(type, status).then(data => {
      if (data.success) {
        this.alertService.createAlert("Menu item updated successfully", 1);
        this.getMenuSections({ "courseId": this.user.courseId });
        //this.getItems({});
      }
      else {
        this.alertService.createAlert(data.message, 0);
      }
    })
  }

  getItems(obj) {
    this.dashboardService.getItems(obj).then(data => {
      if (data.success) {
        this.items = data.results;

        if (this.menus) {
          this.menus.forEach((val, key) => {
            if (val.is_default == 1) {
              this.selectTab(key);
            }
          });
        }

      }
      else {
        this.alertService.createAlert(data.message, 0);
      }
    })
  }

  public openConfirmDialog(action, value, name, id, delValue) {
    let dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: { 'action': action, 'value': value, 'name': name }
    });

    dialogRef.afterClosed().subscribe(account => {
      if (account) {
        if (delValue == 'category') {
          let obj = {};
          obj['id'] = id;
          console.log(obj);
          this.dashboardService.deleteCategory(obj).then(data => {
            if (data.success) {
              this.alertService.createAlert("Category deleted", 1);
              this.getMenuSections({ "courseId": this.user.courseId });
            }
            else {
              this.alertService.createAlert(data.message, 0);
            }
          })
        }
        if (delValue == 'item') {
          let obj = {};
          obj['id'] = id;
          this.dashboardService.deleteItem(obj).then(data => {
            if (data.success) {
              this.alertService.createAlert("Item deleted", 1);
              this.getMenuSections({ "courseId": this.user.courseId });
            }
            else {
              this.alertService.createAlert(data.message, 0);
            }
          })
        }

      } else {
        //this.getAccounts({},'initial');
        this.dialog.closeAll();
      }
    });
  }

  @HostListener('window:resize')
  public onWindowResize(): void {
    (window.innerWidth <= 992) ? this.sidenavOpen = false : this.sidenavOpen = true;
  }

  public getMails() {
    switch (this.type) {
      case 'all':
        this.mails = this.mailboxService.getAllMails();
        break;
      case 'starred':
        this.mails = this.mailboxService.getStarredMails();
        break;
      case 'sent':
        this.mails = this.mailboxService.getSentMails();
        break;
      case 'drafts':
        this.mails = this.mailboxService.getDraftMails();
        break;
      case 'trash':
        this.mails = this.mailboxService.getTrashMails();
        break;
      default:
        this.mails = this.mailboxService.getDraftMails();
    }
  }

  public viewDetail(mail) {
    this.mail = this.mailboxService.getMail(mail.id);
    this.mails.forEach(m => m.selected = false);
    this.mail.selected = true;
    this.mail.unread = false;
    this.newMail = false;
    if (window.innerWidth <= 992) {
      this.sidenav.close();
    }
  }

  public compose() {
    this.mail = null;
    this.newMail = true;
  }

  public setAsRead() {
    this.mail.unread = false;
  }

  public setAsUnRead() {
    this.mail.unread = true;
  }

  public delete() {
    this.mail.trash = true;
    this.mail.sent = false;
    this.mail.draft = false;
    this.mail.starred = false;
    this.getMails();
    this.mail = null;
  }

  public changeStarStatus() {
    this.mail.starred = !this.mail.starred;
    this.getMails();
  }

  public restore() {
    this.mail.trash = false;
    this.type = 'all';
    this.getMails();
    this.mail = null;
  }

  public onSubmit(mail) {
    if (this.form.valid) {
      this.snackBar.open('Mail sent to ' + mail.to + ' successfully!', null, {
        duration: 2000,
      });
      this.form.reset();
    }
  }


  selectTab(tabId: number) {
    this.staticTabs.tabs[tabId].active = true;
  }

}
