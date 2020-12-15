import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ColumnService } from 'src/app/services/column.service';
import { CustomColumnService } from 'src/app/services/custom-column.service';
import { PlayerService } from 'src/app/services/player.service';
import { ClearDataComponent, DialogData } from '../clear-data.component';

@Component({
  selector: 'app-nba-clear-data',
  templateUrl: './nba-clear-data.component.html',
  styleUrls: ['./nba-clear-data.component.css']
})
export class NbaClearDataComponent implements OnInit {
  playerData:boolean=true;
  columnData: boolean=false;
  constructor(
    public dialogRef: MatDialogRef<ClearDataComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,private http:HttpClient,private router: Router,
    private playerService:PlayerService,
    private columnService:ColumnService,
    private customColumnService:CustomColumnService) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

  ngOnInit(): void {
  }
  clearData() {
    let player=false;
    let column=false;
    if (this.playerData) {

      /*this.http.get('/api/player/clear').subscribe(data=>{
      player=true;
      if (!this.columnData || column) {
        location.reload();
      }*
    });*/
    let callback=function() {
      location.reload();
    }
    this.playerService.removeMapByKey('nba', callback);
  }
    if (this.columnData) {
      let callback=function() {
        location.reload();
      }
      this.customColumnService.deleteMapByKey('nba');
      this.columnService.removeMapByKey('nba', callback);
    }
    this.dialogRef.close();
  }
}
