import { Component, OnInit, Inject } from '@angular/core';
import { AlertService } from 'src/app/shared/services/alert.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-confirm-dialog',
  templateUrl: './confirm-subscription-cancel-dialog.component.html',
  styleUrls: ['./confirm-subscription-cancel-dialog.component.scss']
})
export class ConfirmSubscriptionCancelDialogComponent implements OnInit {

  constructor(private alertService: AlertService,
    public dialogRef: MatDialogRef<ConfirmSubscriptionCancelDialogComponent>, @Inject(MAT_DIALOG_DATA) public action: any) {
    console.log(this.action);
  }


  ngOnInit() {
  }

  close(): void {
    this.dialogRef.close(false);
  }

  saveInfo() {
    this.dialogRef.close(true);
  }
}
