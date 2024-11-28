import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { Menu } from './menu.model';
//import { verticalMenuItems, horizontalMenuItems } from './menu';

@Injectable()
export class MenuService {

  verticalMenuItems : any;
  horizontalMenuItems : any;

  constructor(private location:Location,private router:Router){
    let permissions = [];
    let showMainMenus = {"locations":false, "members":false,"orders":false,"admin_locations":false, "admin_orders":false,"admin_configure": false,"admin_idealog":false};
    if(localStorage.getItem('usertype')) {
      let usertype = localStorage.getItem('usertype');
      if(usertype == 'user') {
        showMainMenus['locations'] = true;
        showMainMenus['members'] = true;
        showMainMenus['orders'] = true;
      } else if(usertype == 'admin') {
        showMainMenus['admin_locations'] = true;
        showMainMenus['admin_orders'] = true;
        showMainMenus['admin_configure'] = true;
        showMainMenus['admin_idealog'] = true;
      }
    }

    let temp =[];
    temp.push(
        new Menu(1, 'Setup Locations', '/oFo/locations', null, 'edit_location', null, false, 0, "white", showMainMenus['locations']),
        new Menu(2, 'Manage Members', '/oFo/members', null, 'group', null, false, 0, "white", showMainMenus['members']),
        new Menu(3, 'Member Orders', '/oFo/orders', null, 'shopping_cart', null, false, 0, "white", showMainMenus['orders']),
        new Menu(18, 'Manage Courses', '/oFo/admin/courses', null, 'edit_location', null, false, 0, "white", showMainMenus['admin_locations']),
        new Menu(19, 'Member Orders', '/oFo/admin/orders', null, 'shopping_cart', null, false, 0, "white", showMainMenus['admin_orders']),
        new Menu(20, 'Configurations', '/oFo/admin/fees', null, 'build', null, true, 0, "white", showMainMenus['admin_configure']),
        new Menu(21, 'Manage Fees', '/oFo/admin/fees', null, 'attach_money', null, false, 20, "white", showMainMenus['admin_configure']),
        new Menu(22, 'Manage Contract', '/oFo/admin/contracts', null, 'wc', null, false, 20, "white", showMainMenus['admin_configure']),
        new Menu(23, 'Manage Taxes', '/oFo/admin/taxes', null, 'find_in_page', null, false, 20, "white", showMainMenus['admin_configure']),
        new Menu(24, 'Idea Log', '/oFo/admin/idea-log', null, 'highlight', null, false, 0, "white", showMainMenus['admin_idealog']),
        //new Menu(4, 'Admin', '/salesglobal/admin', null, 'person', null, true, 0, "white", showMainMenus['admin']),

        //new Menu(5, 'Dashboard', '/salesglobal/analytics/dashboard', null, 'dashboard', null, false, 1, "white", permissions[0]),
        // new Menu(6, 'Task Manager', '/salesglobal/analytics/taskmanager', null, 'list', null, false, 1, "white", permissions[1]),

        // new Menu(7, 'Kanban', '/salesglobal/admin/steps', null, 'swap_horiz', null, false, 4, "white", permissions[10]),
        // new Menu(8, 'Lookup Options', '/salesglobal/admin/lookup', null, 'zoom_in', null, false, 4, "white", permissions[13]),
        // new Menu(9, 'Settings', '/salesglobal/admin/settings', null, 'settings_applications', null, false, 4, "white", permissions[11]),
        // new Menu(10, 'Users', '/salesglobal/admin/users', null, 'group_add', null, false, 4, "white", permissions[12]),

        // new Menu(11, 'Campaigns', '/salesglobal/marketing/campaigns', null, 'public', null, false, 2, "white", permissions[2]),
        // new Menu(12, 'Leads', '/salesglobal/marketing/leads', null, 'group', null, false, 2, "white", permissions[7]),
        // new Menu(13, 'Prospects', '/salesglobal/marketing/prospects', null, 'outlined_flag', null, false, 2, "white", permissions[3]),
        
        // new Menu(14, 'Accounts', '/salesglobal/sales/accounts', null, 'monetization_on', null, false, 3, "white", permissions[5]),
        // new Menu(15, 'Contacts', '/salesglobal/marketing/contacts', null, 'contacts', null, false, 2, "white", permissions[6]),
        // new Menu(16, 'Opportunities', '/salesglobal/sales/opportunities', null, 'highlight', null, false, 3, "white", permissions[4]),
        // new Menu(17, 'Referral', '/salesglobal/referral/gridview', null, 'gradient', null, false, 3, "white", permissions[8]),
        // new Menu(17, 'Checklists', '/salesglobal/admin/checklist', null, 'check_circle', null, false, 4, "white", permissions[14]),
        // new Menu(18, 'Color Codes', '/salesglobal/admin/colorcode', null, 'format_color_fill', null, false,4,"white", permissions[15]),
        // new Menu(19,'Locations', '/salesglobal/admin/location', null,'edit_location', null, false, 4,"white", permissions[16]),
        // new Menu(20, 'Time Zones', '/salesglobal/admin/timezone', null, 'access_time', null, false,4,"white", permissions[18]),
        // new Menu(21, 'Exclusions', '/salesglobal/marketing/exclusions', null, 'person_add_disabled', null, false,2,"white", permissions[19]),
    );

    this.verticalMenuItems = temp;
    this.horizontalMenuItems = temp;
  } 
    
  public getVerticalMenuItems():Array<Menu> {
    return this.verticalMenuItems;
  }

  public getHorizontalMenuItems():Array<Menu> {
    return this.horizontalMenuItems;
  }

  public expandActiveSubMenu(menu:Array<Menu>){
      let url = this.location.path();
      let routerLink = url; // url.substring(1, url.length);
      let activeMenuItem = menu.filter(item => item.routerLink === routerLink);
      if(activeMenuItem[0]){
        let menuItem = activeMenuItem[0];
        while (menuItem.parentId != 0){  
          let parentMenuItem = menu.filter(item => item.id == menuItem.parentId)[0];
          menuItem = parentMenuItem;
          this.toggleMenuItem(menuItem.id);
        }
      }
  }

  public toggleMenuItem(menuId){
    let menuItem = document.getElementById('menu-item-'+menuId);
    let subMenu = document.getElementById('sub-menu-'+menuId);  
    if(subMenu){
      if(subMenu.classList.contains('show')){
        subMenu.classList.remove('show');
        menuItem.classList.remove('expanded');
      }
      else{
        subMenu.classList.add('show');
        menuItem.classList.add('expanded');
      }      
    }
  }

  public closeOtherSubMenus(menu:Array<Menu>, menuId){
    let currentMenuItem = menu.filter(item => item.id == menuId)[0]; 
    if(currentMenuItem.parentId == 0 && !currentMenuItem.target){
      menu.forEach(item => {
        if(item.id != menuId){
          let subMenu = document.getElementById('sub-menu-'+item.id);
          let menuItem = document.getElementById('menu-item-'+item.id);
          if(subMenu){
            if(subMenu.classList.contains('show')){
              subMenu.classList.remove('show');
              menuItem.classList.remove('expanded');
            }              
          } 
        }
      });
    }
  }
  

}
