import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { MatTable } from '@angular/material/table';
import { Ruleset } from 'src/app/ruleset.interface';
import { ColumnService } from 'src/app/services/column.service';
import { Star, StarService } from 'src/app/services/star.service';

@Component({
  selector: 'app-nba-star-config',
  templateUrl: './nba-star-config.component.html',
  styleUrls: ['./nba-star-config.component.css']
})
export class NbaStarConfigComponent implements OnInit {
  stars: Star[]=[];

  displayedColumns:any= [
    'Qualifier', 'Operator', 'Value','point','delete'
  ];
  @ViewChildren(MatTable) matTables : QueryList<any>;
  breakpoint:number=3;
  
  constructor(private starService:StarService, private columnService: ColumnService) { }

  ngOnInit(): void {
    this.columnService.init();
    this.starService.initStarMap().subscribe(data=>{
      this.starService.setMap(data);
      this.starService.getStarMapByKey('nba').subscribe(data=>{
        this.stars=Object.values(data);
        this.recalculateBreakpoint();
      });
    });
    
  }

  recalculateBreakpoint() {
    if (window.innerWidth>1264){
      this.breakpoint=3;
    }
    else if (window.innerWidth>851){
      this.breakpoint=2;
    }
    else {
      this.breakpoint=1;
    }
  }

  insertRow (position: string) {
    for (let i=0; i<this.stars.length; i++) {
      if (this.stars[i].position === position ) {
        let newRuleset:Ruleset = {
          qualifier: '',
          operator: '',
          value: '',
          point: 1
        };
        
        this.stars[i].rulesets.push(newRuleset);
        this.matTables.toArray().forEach(each => each.renderRows());
      }
    }
  }

  updateStar(position: string) {
    //this.starService.updateStars(this.stars);
    this.starService.updateStarMapByKey('nba', this.stars);
  }

  deleteRuleset(position: string, ruleset: Ruleset) {
    for (let i=0; i<this.stars.length; i++) {
      if (this.stars[i].position == position) {
        for (let j=0; j<this.stars[i].rulesets.length; j++) {
          if (this.stars[i].rulesets[j] === ruleset) {
            this.stars[i].rulesets.splice(j,1);
            this.matTables.toArray().forEach(each => each.renderRows());
          }
        }
      }
    }
  }
}
