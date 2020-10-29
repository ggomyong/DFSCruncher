import { Component, Input, OnInit } from '@angular/core';
import { Column } from 'src/app/column.interface';

@Component({
  selector: 'app-operator-select',
  templateUrl: './operator-select.component.html',
  styleUrls: ['./operator-select.component.css']
})
export class OperatorSelectComponent implements OnInit {
  operators:string[]=[];
  @Input() value;
  
  constructor() { }

  ngOnInit(): void {
    this.operators=[
      '>','>=','<','<=','==','!=','[','!['
    ];
  }

}
