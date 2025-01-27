import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { AlertService } from '../services/alert.service';

@Component({
  selector: 'app-confirm-dialog',
  templateUrl: './confirm-dialog.component.html',
  styleUrls: ['./confirm-dialog.component.scss'],
  providers: [AlertService]
})
export class ConfirmDialogComponent implements OnInit {

  constructor(private alertService: AlertService,public dialogRef: MatDialogRef<ConfirmDialogComponent>,@Inject(MAT_DIALOG_DATA) public action: any) { 
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
