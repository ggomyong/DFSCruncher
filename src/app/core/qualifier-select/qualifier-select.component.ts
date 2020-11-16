import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
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
  @Output() valueChange = new EventEmitter<string>();
  @Input() position;
  
  constructor(private columnService:ColumnService) { }

  ngOnInit(): void {
    switch(this.position) {
      case 'qb':
        this.columnService.getQb.subscribe((columns)=>{
          this.columns=Object.values(columns);
        });
        break;
      case 'rb':
        this.columnService.getRb.subscribe((columns)=>{
          this.columns=Object.values(columns);
        });
        break;
      case 'rb2':
        this.columnService.getRb2.subscribe((columns)=>{
          this.columns=Object.values(columns);
        });
        break;
      case 'wr':
        this.columnService.getWr.subscribe((columns)=>{
          this.columns=Object.values(columns);
        });
        break;
      case 'wr2':
        this.columnService.getWr2.subscribe((columns)=>{
          this.columns=Object.values(columns);
        });
        break;
      case 'te':
        this.columnService.getTe.subscribe((columns)=>{
          this.columns=Object.values(columns);
        });
        break;
      case 'def':
        this.columnService.getDef.subscribe((columns)=>{
          this.columns=Object.values(columns);
        });
        break;
      default:
        console.log(this.position);
        break;
    }
  }
}
