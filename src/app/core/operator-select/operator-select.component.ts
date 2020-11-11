import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Column } from 'src/app/column.interface';

@Component({
  selector: 'app-operator-select',
  templateUrl: './operator-select.component.html',
  styleUrls: ['./operator-select.component.css']
})
export class OperatorSelectComponent implements OnInit {
  operators:string[]=[];
  @Input() value;
  @Output() valueChange = new EventEmitter<string>();
  
  constructor() { }

  ngOnInit(): void {
    this.operators=[
      '>','>=','<','<=','==','!=','[','!['
    ];
  }

}
