import { Component } from '@angular/core';
import { ActivatedRoute, Router, ActivatedRouteSnapshot, UrlSegment, NavigationEnd } from "@angular/router";
import { Title } from '@angular/platform-browser';
import { AppSettings } from '../../../app.settings';
import { Settings } from '../../../app.settings.model';

@Component({
    selector: 'app-breadcrumb',
    templateUrl: './breadcrumb.component.html',
    styleUrls: ['./breadcrumb.component.scss']
})
export class BreadcrumbComponent {

    public pageTitle: string;
    public moduleTitle: string;
    public subTitle: string="test";
    public description: {};
    public breadcrumbs: {
        name: string;
        url: string
    }[] = [];

    public settings: Settings;
    constructor(public appSettings: AppSettings,
        public router: Router,
        public activatedRoute: ActivatedRoute,
        public title: Title) {
        this.settings = this.appSettings.settings;
        this.description = {
            "Surveys": "This page is used to view surveys performed by course",
            "Setup Locations": "Categories and items for different menu locations, Member requests and Course orders can be managed here.",
            "Manage Courses": "Here you can manage all the golf courses.",
            "Member Orders": "Here you can see all the golf courses member orders.",
            "Manage Members": "Here you can manage all the golf course member requests",
            "Idea-Log":"This page is used to add and execute new ideas to the project",
            "Alerts": "The alerts as reminders for the Marketing and Sales process can be viewed from here.",
            "Campaigns": {
                'Grid View': "Companies targeted through initial marketing campaigns are captured here.",
                'Map View': "Companies targeted through initial marketing campaigns are captured here."
            },
            "Prospects": "List of all potential customers and their flow through the Marketing process can be managed here.",
            "Leads": "Lead is the identification data gathered from a prospective buyer of a product or service.",
            "Opportunities": "The sales process flow of the prospects can be managed here.",
            "Accounts": "List of accounts coming from an opportunity are listed here.",
            "Contacts": "Contacts of Leads/Prospects can be added here.",
            "Exclusions": "List of excluded leads can be managed here.",
            //"Steps": "The flow of the Marketing and Sales process can be defined in terms of templates.",
            "Lookup Options": "This page is used to manage lookups.",
            "Settings": "Here the default settings can be managed for the whole of the applciation.",
            "Referral": "Potential business from the existing customers can be managed here.",
            "Calendar": 'List of meetings scheduled are highlighted in this page.',
            "Updates": 'This page shows list of meetings scheduled.',
            "Users":"This page is used to manage users",
            "Permissions":"This page is used to manage user permissions",
            "Prospect Dashboard": {
                "TIMELINE" : " The data for the Prospects gets highlighted based on the selected tab.",
                "ANY" : " The data for the Prospects gets highlighted based on the selected tab.",
                "NOTES" : " The data for the Prospects gets highlighted based on the selected tab.",
                "EMAILS" : " The data for the Prospects gets highlighted based on the selected tab.",
                "MESSAGES" : " The data for the Prospects gets highlighted based on the selected tab.",
                "LINKEDIN" : " The data for the Prospects gets highlighted based on the selected tab.",
                "CALLS" : " The data for the Prospects gets highlighted based on the selected tab.",
                "OPPORTUNTIES" : " The data for the Prospects gets highlighted based on the selected tab.",
                "LEADS" : " The data for the Prospects gets highlighted based on the selected tab.",
                "CONTACTS" : " The data for the Prospects gets highlighted based on the selected tab.",
                "MEETINGS" : " The data for the Prospects gets highlighted based on the selected tab.",
                "ALERTS" : " The data for the Prospects gets highlighted based on the selected tab.",
                "QUALIFICATION" : "The data for the Prospects gets highlighted based on the selected tab.",
            },
            "Task Manager": {
                "OPPORTUNTIES": 'Realtime updates in the opportunities list and the alerts are highlighted here.',
                "PROSPECTS": 'Realtime updates in the prospects list and the alerts are highlighted here.'
            },
            "Kanban": {
                "OPPORTUNTIES": 'Customize  Sales/Marketing steps as per the requirement',
                "PROSPECTS": 'Customize  Sales/Marketing steps as per the requirement'
            },
            'Checklists': 'This page is used to create a checklist for qualification of lead.',
            'Color Codes': 'This page is used to manage  the color codes',
            'Subscription Fees': 'This page is used to manage  the subscription fees',
            'Contract': 'This page is used to manage the contract information',
            'Taxes': 'This page is used to manage canada state wise taxes',
            'Time Zones': 'This page is used to manage timezones'
            // "Users": {
            //     "Users": "This page is used to manage Users.",
            //     "Permissions": "This page is used to manage permissions."
            // }

        };
        this.router.events.subscribe(event => {
            if (event instanceof NavigationEnd) {
                this.breadcrumbs = [];
                this.parseRoute(this.router.routerState.snapshot.root);
                this.pageTitle = "";
                this.breadcrumbs.forEach(breadcrumb => {
                    this.pageTitle += ' | ' + breadcrumb.name;
                })
                this.pageTitle ? null : this.pageTitle = " | Dashboard";
                var temp = this.pageTitle.split(' | ');
                if(temp.length > 4) {
                    this.subTitle =  temp.pop();
                    this.moduleTitle = temp[temp.length-1];
                } else if(temp.length > 3) {
                    this.subTitle =  temp.pop();
                    this.moduleTitle = temp[temp.length-1];
                } else {
                    this.moduleTitle = temp.pop();
                }
                if(this.subTitle === 'Permissions') {
                    this.moduleTitle = "Permissions";
                    this.subTitle = "test";
                }
                this.title.setTitle(this.settings.name + this.pageTitle);
            }
        })
    }

    private parseRoute(node: ActivatedRouteSnapshot) {
        if (node.data['breadcrumb']) {
            if (node.url.length) {
                let urlSegments: UrlSegment[] = [];
                node.pathFromRoot.forEach(routerState => {
                    urlSegments = urlSegments.concat(routerState.url);
                });
                let url = urlSegments.map(urlSegment => {
                    return urlSegment.path;
                }).join('/');
                this.breadcrumbs.push({
                    name: node.data['breadcrumb'],
                    url: '/' + url
                })
            }
        }
        if (node.firstChild) {
            this.parseRoute(node.firstChild);
        }
    }

    public closeSubMenus() {
        let menu = document.querySelector(".sidenav-menu-outer");
        if (menu) {
            for (let i = 0; i < menu.children[0].children.length; i++) {
                let child = menu.children[0].children[i];
                if (child) {
                    if (child.children[0].classList.contains('expanded')) {
                        child.children[0].classList.remove('expanded');
                        child.children[1].classList.remove('show');
                    }
                }
            }
        }
    }
}


