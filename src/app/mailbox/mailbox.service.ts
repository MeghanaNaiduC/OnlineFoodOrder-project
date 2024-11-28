import { Injectable } from '@angular/core'
import { Mail } from './mail.model';

let Mails = [
    new Mail(
        1, 
        'Envato Market', 
        'assets/img/app/envato.jpg',
        'do-not-reply@market.envato.com', 
        'Your updated item has been approved',
        '4:08 PM',
        '<p>Congratulations! Your update to Azimuth - Angular 2 Admin Template on ThemeForest has been approved. '+
        'You can view your item here: </p>'+
        '<p><a href="http://themeforest.net/item/azimuth-angular-2-admin-template/19182105" target="blank">http://themeforest.net/item/azimuth-angular-2-admin-template/19182105</a></p>' +
        '<p>Thanks for your submission!</p>' +
        '<p>Regards,<br> Envato Market Team</p>', 
        false,
        [],
        true,
        false,
        false,
        false,
        false,
        false 
    ),
    new Mail(
        2,
        'Josiah Fromdahl',
        'assets/img/profile/bruno.jpg',
        'Reekie8647@gmail.com',
        'Useful tool for those who are involved in SEO',
        '9:47 AM',
        '<p>Hi, I want to introduce the Website Reviewer is an incredibly useful tool for those who are involved in SEO and web designing. '+
        'This particular tool will provide you with quick website review and SEO audit of the websites you’ve created so '+
        'you will be able to determine if and where any changes should be made so you can make it as effective '+
        'as possible when it comes to getting visitors and keeping them interested. '+
        'Unlike many similar tools, website reviewer is completely free.</p>',
        true,
        ['assets/img/app/snow.jpg', 'assets/img/app/sample.jpg'],
        true,
        false,
        true,
        false,
        false,
        false 
    ),
    new Mail(
        3,
        'Google Cloud Platform',
        'assets/img/app/google-platform.png',
        'CloudPlatform-noreply@google.com',
        'Lessons from the field: surviving success with Customer Reliability Engineering',
        'Jan 5',
        '<h4>TRENDING</h4>'+
        '<p>For those who missed the early adoption of Infrastructure as a Service circa 2007,' +
        'this in-depth history stresses why businesses need to begin building around "serverless" architectures.</p>' +
        '<p>A stress test led by Pivotal’s Cloud Foundry team ran 250,000 real-life app containers on Google Compute Engine. '+
        'GCP made it possible to stand the environment up in hours, and scaled it without pre-planning.</p>' +
        '<p>Dig in to a new site packed with open-source tools and resources that aims to make it easy for anyone to explore, develop, and share AI creations. '+
        'Play an AI duet, or have your phone guess what you’re drawing.</p>',
        false,
        [],
        false,
        false,
        false,
        false,
        false,
        false
    ),
    new Mail(
        4,
        'Google Cloud Platform',
        'assets/img/plus.png',
        'CloudPlatform-noreply@google.com',
        'Lessons from the field: surviving success with Customer Reliability Engineering',
        'Jan 5',
        '<h4>TRENDING</h4>'+
        '<p>For those who missed the early adoption of Infrastructure as a Service circa 2007,' +
        'this in-depth history stresses why businesses need to begin building around "serverless" architectures.</p>' +
        '<p>A stress test led by Pivotal’s Cloud Foundry team ran 250,000 real-life app containers on Google Compute Engine. '+
        'GCP made it possible to stand the environment up in hours, and scaled it without pre-planning.</p>' +
        '<p>Dig in to a new site packed with open-source tools and resources that aims to make it easy for anyone to explore, develop, and share AI creations. '+
        'Play an AI duet, or have your phone guess what you’re drawing.</p>',
        false,
        [],
        false,
        false,
        false,
        false,
        false,
        false
    )
];
  
@Injectable()
export class MailboxService {

    public getAllMails() {
        return Mails.filter(mail => mail.sent == false && mail.draft == false && mail.trash == false);
    }
    
    public getStarredMails() {
        return Mails.filter(mail => mail.starred == true);
    }

    public getSentMails() {
        return Mails.filter(mail => mail.sent == true);
    }

    public getDraftMails() {
        return Mails.filter(mail => mail.draft == true);
    }

    public getTrashMails() {
        return Mails.filter(mail => mail.trash == true);
    }

    public getMail(id: number | string) {
        return Mails.find(mail => mail.id === +id);
    }
}