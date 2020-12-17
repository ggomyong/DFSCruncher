import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTable } from '@angular/material/table';
import { Column } from 'src/app/column.interface';
import { CustomColumnService, CustomColumn } from 'src/app/services/custom-column.service';

@Component({
  selector: 'app-nba-column-config',
  templateUrl: './nba-column-config.component.html',
  styleUrls: ['./nba-column-config.component.css']
})
export class NbaColumnConfigComponent implements OnInit {

  displayedColumns: string[] = ['internal', 'external', 'display', 'jitLogic', 'positions', 'delete'];
  dataSource;
  booleanOptions=[
    {internal: true, external: 'True'},
    {internal: false, external: 'False'}
  ];
  @ViewChild(MatTable) matTable:  MatTable<any>;
  myPositions:Column[]=[
    {internal: 'nba.C', external: 'C'},
    {internal: 'nba.PF', external: 'PF'},
    {internal: 'nba.SF', external: 'SF'},
    {internal: 'nba.SG', external: 'SG'},
    {internal: 'nba.PG', external: 'PG'}
  ];
  constructor(private customColumnService: CustomColumnService) { }

  ngOnInit(): void {
    this.customColumnService.initColumnMap().subscribe(data=>{
      this.customColumnService.setMap(data);
      this.customColumnService.getColumnMapByKey('nba').subscribe(data =>{
        this.dataSource= Object.values(data);
      }); 
    });
  }
  
  addColumn() {

    this.dataSource.push({
      internal: '',
      external: '',
      display: true,
      jitLogic: '',
      positions: []
    });
    this.matTable.renderRows();
  }

  deleteColumn(column: CustomColumn) {
    let positions=column.positions;

    for (let i=0; i<this.dataSource.length; i++) {
      if (this.dataSource[i]==column) {
        this.dataSource.splice(i,1);
      }
    }
    for (let position of positions) {
      this.customColumnService.removeMapByKey(position, column);
    }
    
    this.matTable.renderRows();
  }

  handlePositionOutput(data) {
  }

  save() {
    //this.customColumnService.setColumns(this.dataSource);
    console.log(this.dataSource)
    this.customColumnService.setColumnMapByKey('nba',this.dataSource);
  }

}
