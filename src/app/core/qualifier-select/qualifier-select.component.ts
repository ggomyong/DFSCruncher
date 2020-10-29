import { Component, Input, OnInit } from '@angular/core';
import { Column } from 'src/app/column.interface';
import { ColumnService } from 'src/app/services/column.service';

@Component({
  selector: 'app-qualifier-select',
  templateUrl: './qualifier-select.component.html',
  styleUrls: ['./qualifier-select.component.css']
})
export class QualifierSelectComponent implements OnInit {
  columns:Column[]=[];
  
  @Input() value;
  
  constructor(private columnService:ColumnService) { }

  ngOnInit(): void {
    this.columnService.getColumns.subscribe(columns => {
      this.columns = Object.values(columns);
    });

  }

}
