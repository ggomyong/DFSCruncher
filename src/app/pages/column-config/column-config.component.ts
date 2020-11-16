import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { CustomColumn, CustomColumnService } from 'src/app/services/custom-column.service';

@Component({
  selector: 'app-column-config',
  templateUrl: './column-config.component.html',
  styleUrls: ['./column-config.component.css']
})
export class ColumnConfigComponent implements OnInit {
  displayedColumns: string[] = ['internal', 'external', 'display', 'jitLogic', 'positions', 'delete'];
  dataSource;
  booleanOptions=[
    {internal: true, external: 'True'},
    {internal: false, external: 'False'}
  ];
  @ViewChild(MatTable) matTable:  MatTable<any>;
  
  constructor(private customColumnService: CustomColumnService) { }

  ngOnInit(): void {
    this.customColumnService.getColumns.subscribe(data=>{
      this.dataSource= Object.values(data);
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
    for (let i=0; i<this.dataSource.length; i++) {
      if (this.dataSource[i]==column) {
        this.dataSource.splice(i,1);
      }
    }
    this.matTable.renderRows();
  }

  handlePositionOutput(data) {
  }

  save() {
    this.customColumnService.setColumns(this.dataSource);
  }

}
