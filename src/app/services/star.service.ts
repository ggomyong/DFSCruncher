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
      name: 'Quarterback',
      position: 'qb',
      background: 'quarterback.jfif',
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
    },
    {
      name: 'Runningback',
      position: 'rb',
      rulesets: [
        {
          qualifier: 'dvp',
          operator: '>=',
          value: 15
        },
        {
          qualifier: 'ou',
          operator: '>=',
          value: 52
        },
        {
          qualifier: 'line',
          operator: '<=',
          value: 0
        },
        {
          qualifier: 'rushatt',
          operator: '>=',
          value: 15
        },
        {
          qualifier: 'avg',
          operator: '>=',
          value: 18
        },
      ]
    },
    {
      name: 'Runningback2',
      position: 'rb2',
      rulesets: [
        {
          qualifier: 'ou',
          operator: '>=',
          value: 49
        },
        {
          qualifier: 'teamou',
          operator: '>=',
          value: 24
        },
        {
          qualifier: 'line',
          operator: '<=',
          value: 0
        },
        {
          qualifier: 'rushatt',
          operator: '>=',
          value: 15
        },
        {
          qualifier: 'avg',
          operator: '>=',
          value: 18
        },
      ]
    },
    {
      name: 'Wide Receiver',
      position: 'wr',
      rulesets: [
        {
          qualifier: 'ou',
          operator: '>=',
          value: 52
        },
        {
          qualifier: 'teamou',
          operator: '>=',
          value: 26
        },
        {
          qualifier: 'tgtsg',
          operator: '>=',
          value: 5
        },
        {
          qualifier: 'rec',
          operator: '>=',
          value: 3.7
        },
        {
          qualifier: 'ms',
          operator: '>=',
          value: 18
        }
      ]
    },
    {
      name: 'Wide Receiver2',
      position: 'wr2',
      rulesets: [
        {
          qualifier: 'ou',
          operator: '>=',
          value: 52
        },
        {
          qualifier: 'teamou',
          operator: '>=',
          value: 26
        },
        {
          qualifier: 'fdsal',
          operator: '<=',
          value: 5600
        },
        {
          qualifier: 'tgtsg',
          operator: '>=',
          value: 5
        },
        {
          qualifier: 'rec',
          operator: '>=',
          value: 4
        }
      ]
    },
    {
      name: 'Tight End',
      position: 'te',
      rulesets: [
        {
          qualifier: 'teamou',
          operator: '>=',
          value: 26
        },
        {
          qualifier: 'dvp',
          operator: '>=',
          value: 20
        },
        {
          qualifier: 'tgtsg',
          operator: '>=',
          value: 3
        },
        {
          qualifier: 'rec',
          operator: '>=',
          value: 2
        }
      ]
    }
  ];
  public stars:Star[] = [];

  constructor() { 
    this.stars=this.DEFAULT_STARS;
  }
}
