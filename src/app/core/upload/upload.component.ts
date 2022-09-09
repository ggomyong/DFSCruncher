import { Component, OnInit } from '@angular/core';
import { ColumnService } from 'src/app/services/column.service';
import { PlayerService } from 'src/app/services/player.service';
import { Player } from '../../player.class';
import XLSX from '../../../../node_modules/xlsx/xlsx.js';
import { Column } from 'src/app/column.interface';
import { CustomColumnService } from 'src/app/services/custom-column.service';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.css']
})
export class UploadComponent implements OnInit {

  constructor(private playerService:PlayerService, private columnService:ColumnService, private customColumnService:CustomColumnService) { }

  columns:any[]=[];
  targetColumns:string[]=[];

  ngOnInit(): void {
  }

  public handleFileInput(evt) {
    let fr:FileReader = new FileReader();
    fr.onload = (e:any) => {
        // e.target.result should contain the text
        // Column is expected to be in row #3
        /*let rawData=e.target.result.split('\n')
        this.parseColumn(rawData[3]);
        for (let i=4; i<rawData.length; i++) {
          this.parseData(rawData[i]);
        }*/
        let data=e.target.result;
        data = new Uint8Array(data);
        let workbook=XLSX.read(data, {type: 'array'});
        let result={};
        workbook.SheetNames.forEach(function( sheetName){
          let roa = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], {header: 1});
          if (roa.length) result[sheetName] = roa;
        })
        //blow up any record

        this.handleQB(result['QB']);
        this.handleRB(result['RB']);
        this.handleRB2(result['RB2']);
        this.handleTE(result['TE']);
        this.handleWR(result['WR']);
        this.handleWR2(result['WR2']);
        this.handleDEF(result['DEF']);
        this.customColumnService.updateColumns();
        this.playerService.recalculateStar();
    };
    fr.readAsArrayBuffer(evt[0]);
  }
  public openFileUpload() {
    let element: HTMLElement =document.getElementById('upload_data') as HTMLElement;
    element.click();
  }

  private handleQB(data:string[]) {
    if (!data) return;
    this.parseColumn(data[3],'qb');
    for (let i=4; i<data.length; i++) {
      this.parsePlayerData(data[i],'qb');
    }
    this.playerService.saveQB();
  }

  private handleRB(data:string[]) {
    if (!data) return;
    this.parseColumn(data[3],'rb');
    for (let i=4; i<data.length; i++) {
      this.parsePlayerData(data[i],'rb');
    }
    this.playerService.saveRB();
  }

  private handleRB2(data:string[]) {
    if (!data) return;
    this.parseColumn(data[3],'rb');
    for (let i=4; i<data.length; i++) {
      this.parsePlayerData(data[i],'rb');
    }
  }

  private handleTE(data:string[]) {
    if (!data) return;
    this.parseColumn(data[3],'te');
    for (let i=4; i<data.length; i++) {
      this.parsePlayerData(data[i],'te');
    }
    this.playerService.saveTE();
  }

  private handleWR(data:string[]) {
    if (!data) return;
    this.parseColumn(data[3],'wr');
    for (let i=4; i<data.length; i++) {
      this.parsePlayerData(data[i],'wr');
    }
    this.playerService.saveWR();
  }

  private handleWR2(data:string[]) {
    if (!data) return;
    this.parseColumn(data[3],'wr');
    for (let i=4; i<data.length; i++) {
      this.parsePlayerData(data[i],'wr');
    }
  }

  private handleDEF(data:string[]) {
    if (!data) return;
    //console.log(data);
    this.parseColumn(data[1],'def');
    for (let i=4; i<data.length; i++) {
      this.parsePlayerData(data[i],'def');
    }
  }


  public parsePlayerData(data:string, playerType:string): void {
    if (this.columns.length==0) {
      return null;
    }
    let player:Player=new Player();

    for (let i=0; i<data.length; i++) {
      let val:string=data[i];
      if (Number(val).toString()==val) {
        if (!Number.isInteger(Number(val))) val=(Number(val).toFixed(2)).toString();
      }
      player[this.columns[i]]=val;
    }
    this.playerService.addToList(player,playerType);
  }

  private pushColumn(myColumns:Column[], myColumn:Column) {
    const found = myColumns.some(el => el.internal === myColumn.internal);
    if (!found) myColumns.push(myColumn);
  }

  public parseColumn(data:string, columnType:string): void {
    this.columns=[];
    let myColumns:Column[]=[];
    this.pushColumn(myColumns, {internal: 'star', external: 'STAR'});
    for (let i=0; i<data.length; i++) {
      this.columns[i]=data[i].toLocaleLowerCase().replace(/ /g, '').replace(/\//g, '').replace(/%/g,'');
      let myColumn:any={};
      myColumn['internal']=this.columns[i];
      myColumn['external']=data[i];
      if (myColumn['internal'].charAt(0)=='w') continue;
      if (myColumn['internal'].includes('column')) continue;
      if (myColumn['internal']=='-') continue;
      //console.log(myColumn);
      this.pushColumn(myColumns, myColumn);
    }

    switch(columnType) {
      case 'qb':
        //this.pushColumn(myColumns, {internal: 'ttd', external: 'TTD'});
        this.columnService.setQb(myColumns);
        break;
      case 'rb':
        //this.pushColumn(myColumns, {internal: 'diff', external: 'DIFF'});
        //this.pushColumn(myColumns, {internal: 'tt', external: 'TT'});
        this.columnService.setRb(myColumns);
        break;
      case 'rb2':
        //this.pushColumn(myColumns, {internal: 'diff', external: 'DIFF'});
        this.columnService.setRb2(myColumns);
        break;
      case 'wr':
        ///this.pushColumn(myColumns, {internal: 'diff', external: 'DIFF'});
        this.columnService.setWr(myColumns);
        break;
      case 'wr2':
        
        //this.pushColumn(myColumns, {internal: 'diff', external: 'DIFF'});
        this.columnService.setWr2(myColumns);
        break;
      case 'te':
        //this.pushColumn(myColumns, {internal: 'diff', external: 'DIFF'});
        this.columnService.setTe(myColumns);
        break;
      case 'def':
        //this.pushColumn(myColumns, {internal: 'diff', external: 'DIFF'});
        this.columnService.setDef(myColumns);
        break;
    }

  }
}
