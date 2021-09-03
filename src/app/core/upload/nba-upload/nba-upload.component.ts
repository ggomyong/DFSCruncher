import { Component, OnInit } from '@angular/core';
import { Column } from 'src/app/column.interface.js';
import { Player } from 'src/app/player.class.js';
import { ColumnService } from 'src/app/services/column.service.js';
import { CustomColumnService } from 'src/app/services/custom-column.service.js';
import { PlayerService } from 'src/app/services/player.service.js';
import XLSX from '../../../../../node_modules/xlsx/xlsx.js';

@Component({
  selector: 'app-nba-upload',
  templateUrl: './nba-upload.component.html',
  styleUrls: ['./nba-upload.component.css']
})
export class NbaUploadComponent implements OnInit {

  constructor(private playerService:PlayerService, private columnService:ColumnService, private customColumnService:CustomColumnService) { }

  columns:any[]=[];
  targetColumns:string[]=[];

  ngOnInit(): void {
  }

  public handleFileInput(evt) {
    let fr:FileReader = new FileReader();
    fr.onload = (e:any) => {
        let data=e.target.result;
        data = new Uint8Array(data);
        let workbook=XLSX.read(data, {type: 'array'});
        let result={};
        workbook.SheetNames.forEach(function( sheetName:string){
          let roa = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], {header: 1});
          if (roa.length) result[sheetName.toLocaleLowerCase()] = roa;
          //console.log(roa);
        })
        //blow up any record
        this.handleRecords(result['fanduel']);
        this.customColumnService.updateColumns();
        this.playerService.newRecalculateStar();
        //location.reload();
        window.setTimeout(()=>{
          location.reload();
        }, 9000);
    };
    fr.readAsArrayBuffer(evt[0]);
  }
  public openFileUpload() {
    let element: HTMLElement =document.getElementById('upload_data') as HTMLElement;
    element.click();
  }

  public handleRecords(data:string[]) {
    if (!data) return;
    this.parseColumn(data[9],'nba');
    for (let i=10; i<data.length; i++) {
      this.parsePlayerData(data[i],'nba');
    }
    this.playerService.saveMapByKey('nba');
    //location.reload();
  }
  private convertExcelDecimalToTime(value: string) {
    let hour,minute,seconds;
    const time = Number((Number(value)*24).toFixed(2));
    const decimals = time.toString().split('.')
    let meridian;
    if (decimals[1]) {
      minute =  Number(decimals[1])*6;
    }
    else {
      minute = '00'
    }
    if (time>12) {
      hour = Math.trunc(time-12);
      meridian = 'PM'
    }
    else {
      hour = Math.trunc(time);
      meridian = 'AM'
    }
    return hour+':'+minute+' ' +meridian;
  }

  public parsePlayerData(data:string, playerType:string): void {
    if (this.columns==[]) {
      return null;
    }
    let player:Player=new Player();
    for (let i=0; i<data.length; i++) {
      let val:string=data[i];
      if (!isNaN(Number(val)) && Number(val).toString()==val) {
        if (this.columns[i]=='gametime') {
          val = this.convertExcelDecimalToTime(val);
        }
        else if (!Number.isInteger(Number(val))) {
          val=(Number(val).toFixed(2)).toString();
        }
      }
      if (player[this.columns[i]]==undefined || player[this.columns[i]]==null)player[this.columns[i]]=val;
    }
    player.pos = playerType+'.'+player.pos;
    this.playerService.addToMapByKey(player.pos,player);
  }

  private pushColumn(myColumns:Column[], myColumn:Column) {
    const found = myColumns.some(el => el.internal === myColumn.internal);
    if (!found) myColumns.push(myColumn);
  }

  public parseColumn(data:string, columnType:string): void {
    this.columns=[];
    let myColumns:Column[]=[];
    this.pushColumn(myColumns, {internal: 'star', external: 'STAR'});
    this.pushColumn(myColumns, {internal: 'name', external: 'Name'});
    for (let i=0; i<data.length; i++) {
      this.columns[i]=data[i].toLocaleLowerCase().replace(/ /g, '').replace(/\//g, '').replace(/%/g,'');
      let myColumn:any={};
      myColumn['internal']=this.columns[i];
      myColumn['external']=data[i];
      if (myColumn['internal'].charAt(0)=='w') continue;
      if (myColumn['internal'].includes('column') && myColumn['internal']!='column1') continue;
      if (myColumn['internal']=='-') continue;
      if (myColumn['internal']=='2x') continue;
      if (myColumn['internal']=='3x') continue;
      if (myColumn['internal']=='4x') continue;
      if (myColumn['internal']=='5x') continue;
      if (myColumn['internal']=='6x') continue;
      if (myColumn['internal']=='7x') continue;
      if (myColumn['internal']=='8x') continue;
      if (myColumn['internal']=='1g') continue;
      if (myColumn['internal']=='3g') continue;
      if (myColumn['internal']=='5g') continue;
      if (myColumn['internal']=='10g') continue;
      if (myColumn['internal']=='column1') {
        myColumn['external']='STDDEV'
      } 
      //console.log(myColumn);
      this.pushColumn(myColumns, myColumn);
    }
    this.columnService.setMapByKey(columnType, myColumns);
  }
}
