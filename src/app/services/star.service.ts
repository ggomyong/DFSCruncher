import { Injectable } from '@angular/core';
import {Ruleset} from '../ruleset.interface';

export interface Star {
  name: string;
    position: string;
    rulesets: Ruleset[];
}

@Injectable({
  providedIn: 'root'
})
export class StarService {
  
  private DEFAULT_STARS = [
    { 
      name: 'Quarterback STAR',
      position: 'qb',
      rulesets: [
        {
          qualifier: 'dvp',
          operator: '>=',
          value: 19
        },
        {
          qualifier: 'ou',
          operator: '>=',
          value: 49
        },
        {
          qualifier: 'rushyards',
          operator: '>=',
          value: 24
        },
        {
          qualifier: 'rushtd',
          operator: '>=',
          value: .15
        },
        {
          qualifier: 'ttd',
          operator: '>=',
          value: 2.2
        },
      ]
    }
  ];
  public stars:Star[] = [];

  constructor() { 
    this.stars=this.DEFAULT_STARS;

  }
}
