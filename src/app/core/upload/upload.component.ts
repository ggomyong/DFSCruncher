import { Component, OnInit } from '@angular/core';
import { PlayerService } from 'src/app/services/player.service';
import { Player } from '../../player.class';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.css']
})
export class UploadComponent implements OnInit {

  constructor(private playerService:PlayerService) { }

  columns:any[]=[];
  targetColumns:string[]=[
    'name', 'team', 'pos', 'dvp', 'ou', 'teamou', 'passtd', 
    'rushyards', 'rushtd'
  ];

  ngOnInit(): void {
  }

  public handleFileInput(evt) {
    let fr:FileReader = new FileReader();
    fr.onload = (e:any) => {
        // e.target.result should contain the text
        // Column is expected to be in row #3
        let rawData=e.target.result.split('\n')
        this.parseColumn(rawData[3]);
        for (let i=4; i<rawData.length; i++) {
          this.parseData(rawData[i]);
        }
        // To-Do: Write to SQL database
        console.log(this.playerService);
    };
    fr.readAsText(evt[0]);
  }
  public openFileUpload() {
    let element: HTMLElement =document.getElementById('upload_data') as HTMLElement;
    element.click();
  }

  public parseData(data:string): void {
    if (this.columns==[]) {
      return null;
    }
    let player:Player=new Player();

    let personal = this.CSVtoArray(data);
    if (personal.length==0) return;

    for (let i=0; i<this.targetColumns.length; i++) {
      player[this.targetColumns[i]]=personal[this.columns[this.targetColumns[i]]];
    }
    
    this.playerService.addToList(player);
  }

  public parseColumn(data:string): void {
    let columns=data.split(',');
    for (let i=0; i<columns.length; i++) {
      if (this.targetColumns.includes(columns[i].toLocaleLowerCase().replace(/ /g, '').replace(/\//g, ''))) {
        this.columns[columns[i].toLocaleLowerCase().replace(/ /g, '').replace(/\//g, '')]=i;
      }
    }
    console.log(this.columns);
  }

  // Return array of string values, or NULL if CSV string not well formed.
  public CSVtoArray(text) {
  var re_valid = /^\s*(?:'[^'\\]*(?:\\[\S\s][^'\\]*)*'|"[^"\\]*(?:\\[\S\s][^"\\]*)*"|[^,'"\s\\]*(?:\s+[^,'"\s\\]+)*)\s*(?:,\s*(?:'[^'\\]*(?:\\[\S\s][^'\\]*)*'|"[^"\\]*(?:\\[\S\s][^"\\]*)*"|[^,'"\s\\]*(?:\s+[^,'"\s\\]+)*)\s*)*$/;
  var re_value = /(?!\s*$)\s*(?:'([^'\\]*(?:\\[\S\s][^'\\]*)*)'|"([^"\\]*(?:\\[\S\s][^"\\]*)*)"|([^,'"\s\\]*(?:\s+[^,'"\s\\]+)*))\s*(?:,|$)/g;

  // Return NULL if input string is not well formed CSV string.
  if (!re_valid.test(text)) return null;

  var a = []; // Initialize array to receive values.
  text.replace(re_value, // "Walk" the string using replace with callback.
      function(m0, m1, m2, m3) {

          // Remove backslash from \' in single quoted values.
          if (m1 !== undefined) a.push(m1.replace(/\\'/g, "'"));

          // Remove backslash from \" in double quoted values.
          else if (m2 !== undefined) a.push(m2.replace(/\\"/g, '"'));
          else if (m3 !== undefined) a.push(m3);
          return ''; // Return empty string.
      });

  // Handle special case of empty last value.
  if (/,\s*$/.test(text)) a.push('');
  return a;
};
}
