import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, retry } from 'rxjs/operators';
import { Router } from '@angular/router';

export interface DialogData {
  animal: string;
  name: string;
}
@Component({
  selector: 'app-clear-data',
  templateUrl: './clear-data.component.html',
  styleUrls: ['./clear-data.component.css']
})
export class ClearDataComponent implements OnInit {
  playerData:boolean=true;
  columnData: boolean=false;
  constructor(
    public dialogRef: MatDialogRef<ClearDataComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,private http:HttpClient,private router: Router) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

  ngOnInit(): void {
  }
  clearData() {
    let player=false;
    let column=false;
    if (this.playerData) {
      this.http.get('/api/player/clear').subscribe(data=>{
      player=true;
      if (!this.columnData || column) {
        location.reload();
      }
    });
  }
    if (this.columnData) {
      this.http.get('/api/column/clear').subscribe(data=>{
      column=true;
      if (!this.playerData || player) {
        location.reload();
      }
    });
    }
    this.dialogRef.close();
  }
}
