import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Column } from 'src/app/column.interface';

export interface iPosition {
  internal: string;
  external: string;
  selected: boolean;
}
@Component({
  selector: 'app-position-selector',
  templateUrl: './position-selector.component.html',
  styleUrls: ['./position-selector.component.css']
})
export class PositionSelectorComponent implements OnInit {
  @Input() positionArrayInput:string[];
  
  positions:iPosition[]=[];
  positionArray: string[] =[];
  @Input() iPositions: Column[];
  @Output() returnArray:EventEmitter<string[]> = new EventEmitter<string[]>();
  
  constructor() { }

  ngOnInit(): void {
    for (let iPosition of this.iPositions) {
      this.positions.push({internal: iPosition.internal, external: iPosition.external, selected: false});
    }

    if (this.positionArrayInput) {
      this.positionArray=this.positionArrayInput;
      //console.log(this.positionArrayInput);
      for (let i=0; i<this.positions.length; i++) {
        if (this.positionArrayInput.indexOf(this.positions[i].internal)>-1) {
          this.positions[i].selected=true;
        }
      }
    }
    
  }

  flipSelected(position: iPosition) {
    //get the current value first
    let selected= position.selected;
    let internal = position.internal;

    if (selected && this.positionArray.indexOf(position.internal)<0){
      this.positionArray.push(internal);
    }
    else if (!selected && this.positionArray.indexOf(position.internal)>-1) {
      let pos = this.positionArray.indexOf(position.internal);
      this.positionArray.splice(pos,1);
    }
    this.returnArray.emit(this.positionArray);
  }



}
