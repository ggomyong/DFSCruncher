import { Component, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { MatTable } from '@angular/material/table';
import { Ruleset } from 'src/app/ruleset.interface';
import { Star, StarService } from 'src/app/services/star.service';

@Component({
  selector: 'app-star-config',
  templateUrl: './star-config.component.html',
  styleUrls: ['./star-config.component.css']
})
export class StarConfigComponent implements OnInit {
  stars:Star[] = [];
  displayedColumns:any= [
    'Qualifier', 'Operator', 'Value', 'delete'
  ];
  @ViewChildren(MatTable) matTables : QueryList<any>;

  
  constructor(private starService:StarService) { }

  ngOnInit(): void {
    this.stars = this.starService.stars;
  }

  insertRow (position: string) {
    console.log(position);
    for (let i=0; i<this.stars.length; i++) {
      if (this.stars[i].position === position ) {
        let newRuleset:Ruleset = {
          qualifier: '',
          operator: '',
          value: 0
        };
        
        this.stars[i].rulesets.push(newRuleset);
        this.matTables.toArray().forEach(each => each.renderRows());
      }
    }
  }

  updateStar(position: string) {
    console.log(position);
    for (let i=0; i<this.stars.length; i++) {
      if (this.stars[i].position == position) {
        console.log(this.stars[i].rulesets);
      }
    }
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
