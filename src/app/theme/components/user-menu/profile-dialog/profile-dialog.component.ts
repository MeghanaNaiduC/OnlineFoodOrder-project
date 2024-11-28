import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA , MatDialog } from '@angular/material';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { AlertService } from '../../../../shared/services/alert.service';
import { DashboardService } from '../../../../analytics/dashboard/dashboard.service';
import { Router } from '@angular/router';
import { emailValidator, matchingPasswords } from '../../../utils/app-validators';
import { LoginService } from '../../../../logins/login.service';
import { Location } from '@angular/common';
import { DatePipe } from '@angular/common';
import { MustMatch } from '../../../../shared/must-match.validator';
//import { MailboxComponent } from '../../../../mailbox/mailbox.component';

@Component({
  selector: 'app-profile-dialog',
  templateUrl: './profile-dialog.component.html',
  styleUrls: ['./profile-dialog.component.scss']
})

export class ProfileDialogComponent implements OnInit {
  isOneLetter = false;
  isOneCapitalLetter = false;
  isOneNumber = false;
  isOneSpecialCaharacter = false;
  isMinLength = false;
  isValidate = false;
  addUserForm: FormGroup;
  courseAddressForm: FormGroup;
  //courseBankForm: FormGroup;
  menuLocations: FormGroup;
  taxForm: FormGroup;
  provinces: any;
  cities: any;
  countries: any;
  bankProvinces : any;
  bankCities : any;
  provinceId: any;
  isValidZipcode = 0;
  showCancel : any;
  zipCords : any = [];
  message:String;
  userType = 'admin';
  canadaProvinces = [{id:1,province:"Alberta", shortCode : "AB"},{id:2,province:"British Columbia", shortCode : "BC"},{id:3,province:"Manitoba", shortCode : "MB"},{id:4,province:"New Brunswick", shortCode : "NB"},{id:5,province:"Newfoundland and Labrador", shortCode : "NL"},{id:6,province:"Nova Scotia", shortCode : "NS"},{id:7,province:"Ontario", shortCode : "ON"},{id:8,province:"Prince Edward Island", shortCode : "PE"},{id:9,province:"Quebec", shortCode : "QC"},{id:10,province:"Saskatchewan", shortCode : "SK"},{id:11,province:"Yukon", shortCode : "YT"},{id:12,province:"Nunavut", shortCode : "NU"},{id:13,province:"Northwest Territories", shortCode : "NT"}];
  formObject = [{id:0,length:"One"},{id:1,length:"Two"},{id:2,length:"Three"}]
  classes = [{id:"PERSONAL",name:"Personal"},{id:"CORPORATE",name:"Corporate"},{id:"INTERNATIONAL",name:"International"} ]
  types = [{id:"CHECKING",name:"Checking"},{id:"SAVINGS",name:"Savings"}];
  currDate = new Date();
  public maxDate = new Date(this.currDate.getFullYear(), this.currDate.getMonth(), this.currDate.getDate());

  onKeyPress(e) {
    var pswd = e.value;
    //validate the length
    if (pswd.length < 8) {
      this.isMinLength = false;
    } else {
      this.isMinLength = true;
    }

    //validate letter
    if (pswd.match(/[A-z]/)) {
      if (pswd != '_') {
        this.isOneLetter = true;
      } else {
        this.isOneLetter = false;
      }
    } else {
      this.isOneLetter = false;
    }

    //validate uppercase letter
    if (pswd.match(/[A-Z]/)) {
      this.isOneCapitalLetter = true;
    } else {
      this.isOneCapitalLetter = false;
    }

    //validate special character
    if (pswd.match(/[!@#\$%\^&\_\+\<\>\.\,\=\:\;\'\?\(\)\[\]\\\/\|\*{}-]/)) {
      this.isOneSpecialCaharacter = true;
    } else {
      this.isOneSpecialCaharacter = false;
    }

    //validate number
    if (pswd.match(/\d/)) {
      this.isOneNumber = true;
    } else {
      this.isOneNumber = false;
    }

  }


  triggerSomeEventOne() {
    if(!this.menuLocations.value.locationOneCheck) {
      this.menuLocations.controls['locationOne'].disable();
    }
    else {
      this.menuLocations.controls['locationOne'].enable();
    }
  }
  
  triggerSomeEventTwo() {
    if(!this.menuLocations.value.locationTwoCheck) {
      this.menuLocations.controls['locationTwo'].disable();
    }
    else {
      this.menuLocations.controls['locationTwo'].enable();
    }
  }
  
  triggerSomeEventThree() {
    if(!this.menuLocations.value.locationThreeCheck) {
      this.menuLocations.controls['locationThree'].disable();
    }
    else {
      this.menuLocations.controls['locationThree'].enable();
    }
  }
  
  triggertaxCheckOne() {
    if(!this.taxForm.value.gstCheck) {
      this.taxForm.controls['gstValue'].disable();
    }
    else {
      this.taxForm.controls['gstValue'].enable();
    }
  }
  
  triggertaxCheckTwo() {
    if(!this.taxForm.value.pstCheck) {
      this.taxForm.controls['pstValue'].disable();
    }
    else {
      this.taxForm.controls['pstValue'].enable();
    }
  }
  
  triggertaxCheckThree() {
    if(!this.taxForm.value.hstCheck) {
      this.taxForm.controls['hstValue'].disable();
    }
    else {
      this.taxForm.controls['hstValue'].enable();
    }
  }

  triggertaxCheckFour() {
    if(!this.taxForm.value.liquorCheck) {
      this.taxForm.controls['liquorValue'].disable();
    }
    else {
      this.taxForm.controls['liquorValue'].enable();
    }
  }
  
  // triggertaxCheckFour() {
  //   if(!this.taxForm.value.liquorCheck) {
  //     this.taxForm.controls['liquorValue'].disable();
  //   }
  //   else {
  //     this.taxForm.controls['liqourValue'].enable();
  //   }
  // }
  
  constructor(public datepipe: DatePipe, public dashboardService : DashboardService,public dialogRef: MatDialogRef<ProfileDialogComponent>, @Inject(MAT_DIALOG_DATA) public course: any,private alertService: AlertService,public fb : FormBuilder) {
    if(this.course)
    this.showCancel = this.course.canCancel;
    this.dialogRef.disableClose = true;
    this.getCourseData();
    this.createUserForm();
    this.createCourseForm();
    this.createMenuLocationsForm();
    this.createTaxesForm();
  }

  getCourseData() {
    if(!this.course.courseId)
      return;
    this.dashboardService.getCourses({"courseId":this.course.courseId}).then(data => {
      if(data.success) {
        this.course = data.results[0];
        this.getCountriesDropdown({});
        this.getProvincesDropdown(this.course.tbl_admin_users[0].country, 1);
        this.getCitiesDropdown(this.course.tbl_admin_users[0].state, 1, 0);
        // if(this.course && this.course.is_signup_completed) {
        //   this.getProvincesDropdown(this.course.tbl_course_bluesnap_details[0].country, 2);
        //   this.getCitiesDropdown(this.course.tbl_course_bluesnap_details[0].state, 2, 0);
        // }
      }
      else {
        this.course = {};
        this.alertService.createAlert(data.message,0);
      }
    })
  }
  
  createUserForm() {
      this.addUserForm = this.fb.group({
        addCourseName : new FormControl('', [Validators.required]),
        firstName : new FormControl('', [Validators.required]),
        /* lastName : new FormControl('', [Validators.required]), */
        addContact : new FormControl('', [Validators.required]),
        addEmail : new FormControl('', [Validators.required]),
      })
  }
  
  createCourseForm() {
    this.courseAddressForm = this.fb.group({
      country : new FormControl('', [Validators.required]),
      province : new FormControl('', [Validators.required]),
      city : new FormControl('', [Validators.required]),
      courseAddress : new FormControl('', [Validators.required]),
      postal : new FormControl('', [Validators.required]),
      latitude : new FormControl('', [Validators.required]),
      longitude : new FormControl('', [Validators.required]),
      radius : new FormControl('', [Validators.required]),
      url : new FormControl('', [Validators.required]),
    })
  }

  // createBankForm() {
  //   this.courseBankForm = this.fb.group({
  //     bankName : new FormControl('', [Validators.required]),
  //     bankCountry : new FormControl('', [Validators.required]),
  //     bankProvince : new FormControl('', [Validators.required]),
  //     BankCity : new FormControl('', [Validators.required]),
  //     bankAddress : new FormControl('', [Validators.required]),
  //     bankPostal : new FormControl('', [Validators.required]),
  //     accName : new FormControl('', [Validators.required]),
  //     bankClass : new FormControl('', [Validators.required]),
  //     bankType : new FormControl('', [Validators.required]),
  //     bankId : new FormControl('', [Validators.required]),
  //     bankAccountId : new FormControl('', [Validators.required]),
  //     commissionPerc : new FormControl('', [Validators.required]),
  //     passport : new FormControl('', [Validators.required]),
  //     dob : new FormControl('', [Validators.required]),
  //     pinNo : new FormControl('', [Validators.required]),
  //     driverLicenseNumber : new FormControl('', [Validators.required]),
  //   })
  // }
  
  createMenuLocationsForm() {
    this.menuLocations = this.fb.group({
      alias : new FormControl('', [Validators.required]),
      maxItems : new FormControl('', [Validators.required]),
      coursePin : new FormControl('', [Validators.required]),
      locationOne : new FormControl(''),
      locationTwo : new FormControl(''),
      locationThree : new FormControl(''),
      locationOneCheck : new FormControl(''),
      locationTwoCheck : new FormControl(''),
      locationThreeCheck : new FormControl(''),
      locationOne_id : new FormControl(''),
      locationOne_is_deleted : new FormControl(''),
      locationTwo_is_deleted : new FormControl(''),
      locationThree_is_deleted : new FormControl(''),
      locationTwo_id : new FormControl(''),
      locationThree_id : new FormControl(''),
      defaultRadio: new FormControl('')
    })
  }

  accept_only_numbers(event) {
    var k;
    k=event.charCode;
    return ((k > 47 && k < 58));
  }

  accept_float_numbers(event) {
    var k;
    k=event.charCode;
    return ((k > 47 && k < 58) || (k == 46));
  }

  accept_alpha_numeric(event) {
    var k;
    k=event.charCode;
    return ((k > 47 && k < 58) || (k > 64 && k < 91) || (k > 96 && k < 123) || (k == 32));
  }

  bank_address_validation(event) {
    var k;
    k=event.charCode;
    return ((k > 43 && k < 58) || (k > 64 && k < 91) || (k > 96 && k < 123) || (k == 32) || (k == 40) || (k == 41));
  }
  
  createTaxesForm() {
    this.taxForm = this.fb.group({
      serviceFee : new FormControl('', [Validators.required]),
      creditFee : new FormControl('', [Validators.required]),
      tipPerc1 : new FormControl('', [Validators.required]),
      tipPerc2 : new FormControl('', [Validators.required]),
      tipPerc3 : new FormControl('', [Validators.required]),
      gstCheck : new FormControl(''),
      pstCheck : new FormControl(''),
      hstCheck : new FormControl(''),
      liquorCheck : new FormControl(''),
      gstValue : new FormControl(''),
      pstValue : new FormControl(''),
      hstValue : new FormControl(''),
      liquorValue : new FormControl(''),
      gstManOpt : new FormControl(''),
      pstManOpt : new FormControl(''),
      hstManOpt : new FormControl(''),
      liquorManOpt : new FormControl(''),
    })
  }
  
  ngOnInit() {
    console.log(this.course);
    this.getProvincesDropdown(this.course.country, 1);
    this.userType = localStorage.getItem("usertype");
  }

  populateData() {
    if(this.course && this.course.is_signup_completed) {
      let tips = this.course.tipPerc.split(',');
      console.log('vijay')
      this.addUserForm.controls['addCourseName'].setValue(this.course.name);
      this.addUserForm.controls['firstName'].setValue(this.course.tbl_admin_users[0].name);
      this.addUserForm.controls['addContact'].setValue(this.course.tbl_admin_users[0].phone);
      this.addUserForm.controls['addEmail'].setValue(this.course.tbl_admin_users[0].email);
      this.menuLocations.controls['coursePin'].setValue(this.course.coursePin);
      // this.courseBankForm.controls['dob'].setValue( new Date(this.course.tbl_course_bluesnap_details.length ? this.course.tbl_course_bluesnap_details[0].dob : '')); 
      // this.courseBankForm.controls['passport'].setValue(this.course.tbl_course_bluesnap_details.length ? this.course.tbl_course_bluesnap_details[0].passportNumber : ''); 
      // this.courseBankForm.controls['pinNo'].setValue(this.course.tbl_course_bluesnap_details.length ? this.course.tbl_course_bluesnap_details[0].personalIdentificationNumber : ''); 
      // this.courseBankForm.controls['driverLicenseNumber'].setValue(this.course.tbl_course_bluesnap_details.length ? this.course.tbl_course_bluesnap_details[0].driverLicenseNumber : ''); 
      this.courseAddressForm.controls['province'].setValue(this.course.tbl_admin_users[0].state);
      this.courseAddressForm.controls['country'].setValue(this.course.tbl_admin_users[0].country);
      this.courseAddressForm.controls['city'].setValue(this.course.tbl_admin_users[0].city);
      this.courseAddressForm.controls['courseAddress'].setValue(this.course.tbl_admin_users[0].address);
      this.courseAddressForm.controls['postal'].setValue(this.course.tbl_admin_users[0].zip);
      let value = (this.course.radius * 69.0585729 * 2).toFixed(0);
      this.courseAddressForm.controls['radius'].setValue(value);
      if(this.course.geometry) {
        this.courseAddressForm.controls['latitude'].setValue(this.course.geometry.coordinates[0]);
        this.courseAddressForm.controls['longitude'].setValue(this.course.geometry.coordinates[1]);
      }
      this.courseAddressForm.controls['url'].setValue(this.course.tbl_admin_users[0].url);
        for(let i = 0; i < this.course.tbl_menu_sections.length; i++) {
          this.menuLocations.controls['location'+this.formObject[i].length+'_id'].setValue(this.course.tbl_menu_sections[i].id);
          this.menuLocations.controls['location'+this.formObject[i].length].setValue(this.course.tbl_menu_sections[i].name);
          this.menuLocations.controls['location'+this.formObject[i].length+'_is_deleted'].setValue(this.course.tbl_menu_sections[i].is_deleted); 
          this.menuLocations.controls['location'+this.formObject[i].length+'Check'].setValue(true);
          if(this.course.tbl_menu_sections[i].is_default) {
            this.menuLocations.controls['defaultRadio'].setValue('location'+this.formObject[i].length+'Radio');  
          }  
        }
      this.menuLocations.controls['alias'].setValue(this.course.alias);
      this.menuLocations.controls['maxItems'].setValue(this.course.maxItems);
      this.taxForm.controls['gstCheck'].setValue(this.course.is_gst);
      this.taxForm.controls['pstCheck'].setValue(this.course.is_pst);
      this.taxForm.controls['hstCheck'].setValue(this.course.is_hst);
      this.taxForm.controls['liquorCheck'].setValue(this.course.is_liquor);
      this.taxForm.controls['gstValue'].setValue(this.course.gst);
      this.taxForm.controls['pstValue'].setValue(this.course.pst);
      this.taxForm.controls['hstValue'].setValue(this.course.hst);
      this.taxForm.controls['liquorValue'].setValue(this.course.liquor);
      if(this.course.gst_is_mandatory) 
        this.taxForm.controls['gstManOpt'].setValue('man');
      else 
        this.taxForm.controls['gstManOpt'].setValue('opt');  
      if(this.course.pst_is_mandatory) 
        this.taxForm.controls['pstManOpt'].setValue('man');
      else 
        this.taxForm.controls['pstManOpt'].setValue('opt');
      if(this.course.hst_is_mandatory) 
        this.taxForm.controls['hstManOpt'].setValue('man');
      else 
        this.taxForm.controls['hstManOpt'].setValue('opt');  
      if(this.course.liquor_is_mandatory) 
        this.taxForm.controls['liquorManOpt'].setValue('man');
      else 
        this.taxForm.controls['liquorManOpt'].setValue('opt');
      this.taxForm.controls['serviceFee'].setValue(this.course.serviceFee);
      this.taxForm.controls['tipPerc1'].setValue(tips.length >= 1 ? tips[0] : 5);
      this.taxForm.controls['tipPerc2'].setValue(tips.length >= 2 ? tips[1] : 10);
      this.taxForm.controls['tipPerc3'].setValue(tips.length >= 3 ? tips[2] : 15);
      this.taxForm.controls['creditFee'].setValue(this.course.creditcardFee);

      // this.courseBankForm.controls['bankName'].setValue(this.course.tbl_course_bluesnap_details.length ? this.course.tbl_course_bluesnap_details[0].bankName : '');
      // this.courseBankForm.controls['bankAddress'].setValue(this.course.tbl_course_bluesnap_details.length ? this.course.tbl_course_bluesnap_details[0].address : '');
      // this.courseBankForm.controls['bankCountry'].setValue(this.course.tbl_course_bluesnap_details.length ? this.course.tbl_course_bluesnap_details[0].country : '');
      // this.courseBankForm.controls['bankProvince'].setValue(this.course.tbl_course_bluesnap_details.length ? this.course.tbl_course_bluesnap_details[0].state : '');
      // this.courseBankForm.controls['BankCity'].setValue(this.course.tbl_course_bluesnap_details.length ? this.course.tbl_course_bluesnap_details[0].city : '');
      // this.courseBankForm.controls['bankPostal'].setValue(this.course.tbl_course_bluesnap_details.length ? this.course.tbl_course_bluesnap_details[0].zip : '');
      // this.courseBankForm.controls['accName'].setValue(this.course.tbl_course_bluesnap_details.length ? this.course.tbl_course_bluesnap_details[0].nameOnAccount : '');
      // this.courseBankForm.controls['bankClass'].setValue(this.course.tbl_course_bluesnap_details.length ? this.course.tbl_course_bluesnap_details[0].bankAccountClass : '');
      // this.courseBankForm.controls['bankType'].setValue(this.course.tbl_course_bluesnap_details.length ? this.course.tbl_course_bluesnap_details[0].bankAccountType : '');
      // this.courseBankForm.controls['bankId'].setValue(this.course.tbl_course_bluesnap_details.length ? this.course.tbl_course_bluesnap_details[0].bankId : '');
      // this.courseBankForm.controls['bankAccountId'].setValue(this.course.tbl_course_bluesnap_details.length ? this.course.tbl_course_bluesnap_details[0].bankAccountId : '');
      // this.courseBankForm.controls['commissionPerc'].setValue(this.course.tbl_course_bluesnap_details.length ? this.course.tbl_course_bluesnap_details[0].commissionPercent : '');
    }
    else {
      console.log('kumar')
    this.addUserForm.controls['addCourseName'].setValue(this.course.name);
    this.addUserForm.controls['firstName'].setValue(this.course.tbl_admin_users[0].name);
    this.courseAddressForm.controls['province'].setValue(this.course.tbl_admin_users[0].state);
    this.courseAddressForm.controls['country'].setValue(this.course.tbl_admin_users[0].country);
    this.courseAddressForm.controls['city'].setValue(this.course.tbl_admin_users[0].city);
    this.courseAddressForm.controls['courseAddress'].setValue(this.course.tbl_admin_users[0].address);
    this.addUserForm.controls['addContact'].setValue(this.course.tbl_admin_users[0].phone);
    this.addUserForm.controls['addEmail'].setValue(this.course.tbl_admin_users[0].email);
    this.menuLocations.controls['defaultRadio'].setValue('locationOneRadio');
    this.menuLocations.controls['alias'].setValue('Popular Items');
    this.menuLocations.controls['maxItems'].setValue(6);
    this.taxForm.controls['gstCheck'].setValue(true);
    this.taxForm.controls['pstCheck'].setValue(true);
    this.taxForm.controls['hstCheck'].setValue(true);
    this.taxForm.controls['liquorCheck'].setValue(true);
    this.taxForm.controls['gstManOpt'].setValue('man');
    this.taxForm.controls['pstManOpt'].setValue('opt');
    this.taxForm.controls['hstManOpt'].setValue('opt');
    this.taxForm.controls['liquorManOpt'].setValue('opt');
    this.taxForm.controls['gstValue'].setValue(5);
    this.taxForm.controls['pstValue'].setValue(7);
    this.taxForm.controls['hstValue'].setValue(13);
    this.taxForm.controls['liquorValue'].setValue(10);
    this.taxForm.controls['serviceFee'].setValue(7);
    this.taxForm.controls['creditFee'].setValue(3);
    this.taxForm.controls['tipPerc1'].setValue(5);
    this.taxForm.controls['tipPerc2'].setValue(10);
    this.taxForm.controls['tipPerc3'].setValue(15);
    // this.courseBankForm.controls['commissionPerc'].setValue(7);
    }
  }
  
  get addCourseName() {return this.addUserForm.get('addCourseName'); }
  
  get firstName() {return this.addUserForm.get('firstName'); }

  // get dob() {return this.courseBankForm.get('dob'); }

  // get passport() {return this.courseBankForm.get('passport'); }

  // get pinNo() {return this.courseBankForm.get('pinNo'); }

  // get driverLicenseNumber() {return this.courseBankForm.get('driverLicenseNumber'); }
  
  get lastName() {return this.addUserForm.get('lastName'); }
  
  get addContact() {return this.addUserForm.get('addContact'); }
  
  get addEmail() {return this.addUserForm.get('addEmail'); }

  get addPassword() {return this.addUserForm.get('addPassword'); }

  get addConfirmPassword() {return this.addUserForm.get('addConfirmPassword'); }
  
  get province() {return this.courseAddressForm.get('province'); }

  get country() {return this.courseAddressForm.get('country'); }
  
  get city() {return this.courseAddressForm.get('city'); }
  
  get courseAddress() {return this.courseAddressForm.get('courseAddress'); }
  
  get postal() {return this.courseAddressForm.get('postal'); }

  get latitude() {return this.courseAddressForm.get('latitude'); }

  get radius() {return this.courseAddressForm.get('radius'); }

  get longitude() {return this.courseAddressForm.get('longitude'); }
  
  get url() {return this.courseAddressForm.get('url'); }
  
  get alias() {return this.menuLocations.get('alias'); }
  
  get locationOne() {return this.menuLocations.get('locationOne'); }
  
  get locationTwo() {return this.menuLocations.get('locationTwo'); }
  
  get locationThree() {return this.menuLocations.get('locationThree'); }
  
  get maxItems() {return this.menuLocations.get('maxItems'); }

  get coursePin() {return this.menuLocations.get('coursePin'); }
  
  get serviceFee() {return this.taxForm.get('serviceFee'); }
  
  get creditFee() {return this.taxForm.get('creditFee'); }

  get tipPerc1() {return this.taxForm.get('tipPerc1'); }

  get tipPerc2() {return this.taxForm.get('tipPerc2'); }

  get tipPerc3() {return this.taxForm.get('tipPerc3'); }
  
  get gstCheck() {return this.taxForm.get('gstCheck'); }
  
  get pstCheck() {return this.taxForm.get('pstCheck'); }
  
  get hstCheck() {return this.taxForm.get('hstCheck'); }
  
  get liquorCheck() {return this.taxForm.get('liquorCheck'); }
  
  get gstValue() {return this.taxForm.get('gstValue'); }
  
  get pstValue() {return this.taxForm.get('gstValue'); }
  
  get hstValue() {return this.taxForm.get('gstValue'); }
  
  get liquorValue() {return this.taxForm.get('liquorValue'); }
  
  get gstManOpt() {return this.taxForm.get('gstManOpt'); }
  
  get pstManOpt() {return this.taxForm.get('pstManOpt'); }
  
  get hstManOpt() {return this.taxForm.get('hstManOpt'); }
  
  get liquorManOpt() {return this.taxForm.get('liquorManOpt'); }
  
  get locationOne_id() {return this.addUserForm.get('locationOne_id'); }

  get locationOne_is_deleted() {return this.addUserForm.get('locationOne_is_deleted'); }

  get locationTwo_is_deleted() {return this.addUserForm.get('locationOne_is_deleted'); }

  get locationThree_is_deleted() {return this.addUserForm.get('locationOne_is_deleted'); }

  get locationTwo_id() {return this.addUserForm.get('locationTwo_id'); }

  get locationThree_id() {return this.addUserForm.get('locationThree_id'); }

  // get bankName() {return this.courseBankForm.get('bankName'); }

  // get bankAddress() {return this.courseBankForm.get('bankAddress'); }

  // get bankProvince() {return this.courseBankForm.get('bankProvince'); }

  // get bankCountry() {return this.courseBankForm.get('bankCountry'); }

  // get BankCity() {return this.courseBankForm.get('BankCity'); }

  // get bankPostal() {return this.courseBankForm.get('bankPostal'); }

  // get accName() {return this.courseBankForm.get('accName'); }

  // get bankClass() {return this.courseBankForm.get('bankClass'); }

  // get bankType() {return this.courseBankForm.get('bankType'); }

  // get bankId() {return this.courseBankForm.get('bankId'); }

  // get bankAccountId() {return this.courseBankForm.get('bankAccountId'); }

 // get commissionPerc() {return this.courseBankForm.get('commissionPerc'); }

  close(): void {
    this.dialogRef.close();
  }

  getCountriesDropdown(filters) {
    this.dashboardService.getCountriesDropdown(filters).then(data => {
      if(data.success) {
        this.countries = data.results;
      }
      else {
        this.countries = [];
        this.alertService.createAlert(data.message,0);
      }
    })
  }

  getCitiesDropdown(filters, type, from) {
    console.log(filters,type,from)
    if(!filters)
      return;
    let obj = {"stateId":filters};
    this.dashboardService.getCitiesDropdown(obj).then(data => {
      if(data.success) {
          this.cities = data.results;
           this.populateData();
      }
      else {
        this.cities = [];
        this.alertService.createAlert(data.message,0);
      }
    })
  }

  getProvincesDropdown(filters, type) {
    if(!filters)
      return;
    let obj = {"countryId":filters};
    this.dashboardService.getProvinces(obj).then(data => {
      if(data.success) {
        if(type ==1)
          this.provinces = data.results;
        else
          this.bankProvinces = data.results;
      }
      else {
        this.provinces = [];
        this.alertService.createAlert(data.message,0);
      }
    })
  }

  zipcodeChange(zipcode) {
    this.dashboardService.verifyAddress(zipcode).subscribe(responseList => {
        if(responseList['status'] == 'OK') {
          this.isValidZipcode = 0;
        } else {
          this.isValidZipcode = 1;
        } 
    });
  }

  sortFloat(a,b) { return a - b; }
  
  saveCourse() {
    
    let finalObj = {};
    let adminUser = {};
    let course = {};
    let vendor = {};
    let  vendorBlueSnapObj = {};
    vendorBlueSnapObj['vendorPrincipal'] = {};
    let menu = [];
    let taxes = [];
    let tax = {};
  
      vendor['vendorBlueSnapId'] = this.course.vendorBlueSnapId;
   
      course['name'] = this.addUserForm.value.addCourseName;
      menu['courseName'] = this.addUserForm.value.addCourseName;
      course['courseEmail'] = this.addUserForm.value.addEmail;
      vendorBlueSnapObj['name'] = this.addUserForm.value.addCourseName;
      vendorBlueSnapObj['email'] = this.addUserForm.value.addEmail;
      vendorBlueSnapObj['phone'] = this.addUserForm.value.addContact;
      vendorBlueSnapObj['vendorPrincipal']['email'] = this.addUserForm.value.addEmail;
      adminUser['phone'] = this.addUserForm.value.addContact;
      adminUser['email'] = this.addUserForm.value.addEmail;
     
    if(this.course.tbl_admin_users[0].phone != this.addUserForm.value.addContact)
      adminUser['phoneChanged'] = 1;
    if(this.course.tbl_admin_users[0].email != this.addUserForm.value.addEmail)
      adminUser['emailChanged'] = 1;
    vendorBlueSnapObj['country'] = this.countries.find(o => o.id == this.courseAddressForm.value.country).sortname;
    vendorBlueSnapObj['address'] = this.courseAddressForm.value.courseAddress;
    vendorBlueSnapObj['city'] = this.courseAddressForm.value.city;
    vendorBlueSnapObj['zip'] = this.courseAddressForm.value.postal;
    vendorBlueSnapObj['frequency'] = 'WEEKLY';   //'DAILY';
    vendorBlueSnapObj['state'] = this.provinces.find(o => o.id == this.courseAddressForm.value.province).shortCode;
    vendorBlueSnapObj["defaultPayoutCurrency"] = "CAD";
    adminUser['name'] = this.addUserForm.value.firstName;
    vendorBlueSnapObj['vendorPrincipal']['firstName'] = this.addUserForm.value.firstName;
    vendorBlueSnapObj['vendorPrincipal']['lastName'] = ' ';
    vendorBlueSnapObj['vendorPrincipal']['address'] = this.courseAddressForm.value.courseAddress;
    vendorBlueSnapObj['vendorPrincipal']['city'] = this.cities.find(o => o.id == this.courseAddressForm.value.city).name;
    // vendorBlueSnapObj['vendorPrincipal']['zip'] = this.courseAddressForm.value.postal;
    // vendorBlueSnapObj['vendorPrincipal']['dob'] = this.datepipe.transform(this.courseBankForm.value.dob, 'dd-MM-yyyy');
    // vendorBlueSnapObj['vendorPrincipal']['personalIdentificationNumber'] = this.courseBankForm.value.pinNo;
    // vendorBlueSnapObj['vendorPrincipal']['driverLicenseNumber'] = this.courseBankForm.value.driverLicenseNumber;
    // vendorBlueSnapObj['vendorPrincipal']['passportNumber'] = this.courseBankForm.value.passport;
    vendorBlueSnapObj['vendorPrincipal']['country'] = this.countries.find(o => o.id == this.courseAddressForm.value.country).sortname;

    adminUser['address'] = this.courseAddressForm.value.courseAddress
    adminUser['city'] = this.courseAddressForm.value.city;
    adminUser['state'] = this.courseAddressForm.value.province;
    adminUser['country'] = this.courseAddressForm.value.country;
    adminUser['zip'] = this.courseAddressForm.value.postal;
    course['radius'] = ((this.courseAddressForm.value.radius / 2 )/69.0585729);
    //if(this.zipCords.length) {
    course['is_signup_completed'] = 1;
    course['geometry'] = this.courseAddressForm.value.latitude + ' '+  this.courseAddressForm.value.longitude;
    //}
    adminUser['url'] = this.courseAddressForm.value.url;
    course['serviceFee'] = this.taxForm.value.serviceFee;
    course['tipPerc'] = [this.taxForm.value.tipPerc1, this.taxForm.value.tipPerc2, this.taxForm.value.tipPerc3].sort(this.sortFloat).join(',');
    course['creditcardFee'] = this.taxForm.value.creditFee;
    course['alias'] = this.menuLocations.value.alias;
    course['maxItems'] = this.menuLocations.value.maxItems;
    course['coursePin'] = this.menuLocations.value.coursePin;
    vendorBlueSnapObj['vendorAgreement'] = {};
    vendorBlueSnapObj['payoutInfo'] = [];
    // vendorBlueSnapObj['vendorAgreement']['commissionPercent'] = (100 - parseFloat(this.courseBankForm.value.commissionPerc));
    // vendor['bankName'] = this.courseBankForm.value.bankName;
    // vendor['address'] = this.courseBankForm.value.bankAddress;
    // vendor['state_id'] = this.courseBankForm.value.bankProvince;
    // vendor['city'] = this.bankCities.find(o => o.id == this.courseBankForm.value.BankCity).name;
    // vendor['city_id'] = this.courseBankForm.value.BankCity;
    // vendor['zip'] = this.courseBankForm.value.bankPostal;
    // vendor['nameOnAccount'] = this.courseBankForm.value.accName;
    // vendor['bankAccountClass'] = this.courseBankForm.value.bankClass;
    // vendor['bankAccountType'] = this.courseBankForm.value.bankType;
    // vendor['bankId'] = this.courseBankForm.value.bankId;
    // vendor['bankAccountId'] = this.courseBankForm.value.bankAccountId;
    // vendor['commissionPercent'] = this.courseBankForm.value.commissionPerc;
    // vendor['payoutType'] = "WIRE";
    // vendor['baseCurrency'] = "CAD";
    // vendor['country_id'] = this.courseBankForm.value.bankCountry;
    // vendor['country'] = this.countries.find(o => o.id == this.courseBankForm.value.bankCountry).sortname;
    // if(vendor['country'] == 'US' || vendor['country'] == 'CA')
    //   vendor['state'] = this.bankProvinces.find(o => o.id == this.courseBankForm.value.bankProvince).shortCode;
    // vendor['minimalPayoutAmount'] = 25;
    // let sd = new Date(this.courseBankForm.value.dob);
    // vendor["dob"] = sd.setTime(sd.getTime() + (330 * 60 * 1000));
    // vendor['personalIdentificationNumber'] = this.courseBankForm.value.pinNo;
    // vendor['driverLicenseNumber'] = this.courseBankForm.value.driverLicenseNumber;
    // vendor['passportNumber'] = this.courseBankForm.value.passport;
    // vendorBlueSnapObj['payoutInfo'].push(vendor);
    if(this.menuLocations.value.locationOneCheck) {
      let obj = {};
      obj['menu'] = this.menuLocations.value.locationOne;
      if(this.course) {
        obj['id'] = this.menuLocations.value.locationOne_id;
        obj['is_deleted'] = this.menuLocations.value.locationOne_is_deleted;
        console.log('data',this.menuLocations.value.locationOne_id,this.menuLocations.value.locationOne_is_deleted)
      }
      if(this.menuLocations.value.defaultRadio == 'locationOneRadio') {
        obj['is_default'] = true;
      }
      else {
        obj['is_default'] = false;
      }
      obj['is_active'] = true;
      menu.push(obj);
    }
    
    if(this.menuLocations.value.locationTwoCheck) {
      let obj = {};
      obj['menu'] = this.menuLocations.value.locationTwo;
      if(this.course) {
        obj['id'] = this.menuLocations.value.locationTwo_id;
        obj['is_deleted'] = this.menuLocations.value.locationTwo_is_deleted;
        console.log('data',this.menuLocations.value.locationOne_id,this.menuLocations.value.locationOne_is_deleted)
      }
      if(this.menuLocations.value.defaultRadio == 'locationTwoRadio') {
        obj['is_default'] = true;
      }
      else {
        obj['is_default'] = false;
      }
      obj['is_active'] = true;
      menu.push(obj);
    }
    
    if(this.menuLocations.value.locationThreeCheck) {
      let obj = {};
      obj['menu'] = this.menuLocations.value.locationThree;
      
      if(this.course) {
        obj['id'] = this.menuLocations.value.locationThree_id;
        obj['is_deleted'] = this.menuLocations.value.locationThree_is_deleted;
        console.log('data',this.menuLocations.value.locationOne_id,this.menuLocations.value.locationOne_is_deleted)
      }
      if(this.menuLocations.value.defaultRadio == 'locationThreeRadio') {
        obj['is_default'] = true;
      }
      else {
        obj['is_default'] = false;
      }
      obj['is_active'] = true;
      menu.push(obj);
    }
    
    if(this.taxForm.value.gstCheck) {
      let obj = {};
      tax['is_gst'] = true;
      tax['gst'] = this.taxForm.value.gstValue;
      if(this.taxForm.value.gstManOpt == "man") {
        tax['gst_is_mandatory'] = true;
      }
      else {
        tax['gst_is_mandatory'] = false;
      }
      //taxes.push(obj);
    }
    
    if(!this.taxForm.value.gstCheck) {
      let obj = {};
      tax['is_gst'] = false;
      tax['gst'] = 0;
      tax['gst_is_mandatory'] = false;
      //taxes.push(obj);
    }
    
    if(this.taxForm.value.pstCheck) {
      let obj = {};
      tax['is_pst'] = true;
      tax['pst'] = this.taxForm.value.pstValue;
      if(this.taxForm.value.pstManOpt == "man") {
        tax['pst_is_mandatory'] = true;
      }
      else {
        tax['pst_is_mandatory'] = false;
      }
      //taxes.push(obj);
    }
    
    if(!this.taxForm.value.pstCheck) {
      let obj = {};
      tax['is_pst'] = false;
      tax['pst'] = 0;
      tax['pst_is_mandatory'] = false;
      //taxes.push(obj);
    }
    
    if(this.taxForm.value.hstCheck) {
      let obj = {};
      tax['is_hst'] = true;
      tax['hst'] = this.taxForm.value.hstValue;
      if(this.taxForm.value.hstManOpt == "man") {
        tax['hst_is_mandatory'] = true;
      }
      else {
        tax['hst_is_mandatory'] = false;
      }
      //taxes.push(obj);
    }
    
    if(!this.taxForm.value.hstCheck) {
      let obj = {};
      tax['is_hst'] = false;
      tax['hst'] = 0;
      tax['hst_is_mandatory'] = false;
      //taxes.push(obj);
    }
    
    if(this.taxForm.value.liquorCheck) {
      let obj = {};
      tax['is_liquor'] = true;
      tax['liquor'] = this.taxForm.value.liquorValue;
      if(this.taxForm.value.liquorManOpt == "man") {
        tax['liquor_is_mandatory'] = true;
      }
      else {
        tax['liquor_is_mandatory'] = false;
      }
      //taxes.push(obj);
    }
    
    if(!this.taxForm.value.liquorCheck) {
      let obj = {};
      tax['is_liquor'] = false;
      tax['liquor'] = 0;
      tax['liquor_is_mandatory'] = false;
    }
    finalObj['adminUser'] = adminUser;
    finalObj['course'] = course;
    finalObj['vendor'] = vendor;
    finalObj['vendorBlueSnapObj'] = vendorBlueSnapObj;
    finalObj['menuSections'] = menu;
    finalObj['taxes'] = tax;
    if(this.course) {
      finalObj['id'] = this.course.id;
      finalObj['course'].is_active = true;
      finalObj['course'].is_deleted = false;
      this.dashboardService.updateCourse(finalObj).then(data => {
        if(data.success) {
          this.alertService.createAlert("Course updated successfully, Please login again.",1);
          this.dialogRef.close('save');
        }
        else {
          this.alertService.createAlert(data.message,0);
        }
      })
    }
    else {
      finalObj['course'].is_active = true;
      finalObj['course'].is_deleted = false;
      this.dashboardService.addCourse(finalObj).then(data => {
        if(data.success) {
          this.alertService.createAlert("Course added successfully, Please login again.",1);
          this.dialogRef.close('save');
        }
        else {
          this.alertService.createAlert(data.message,0);
        }
      });
    }
  }
}
