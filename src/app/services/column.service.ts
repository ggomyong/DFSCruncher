import { Injectable } from '@angular/core';
import { BehaviorSubject, of, Subject } from 'rxjs';
import { Column } from '../column.interface';
@Injectable({
  providedIn: 'root'
})
export class ColumnService {
  private DEFAULT_QB_COLUMNS:Column[] = [
    {internal: 'star', external: 'STAR'},
    {internal: 'name', external: 'Name'},
    {internal: 'team', external: 'Team'},
    {internal: 'pos', external: 'Position'},
    {internal: 'dvp', external: 'DVP'},
    {internal: 'ou', external: 'O/U'},
    {internal: 'passtd', external: 'Pass TD'},
    {internal: 'rushyards', external: 'Rush Yards'},
    {internal: 'rushtd', external: 'Rush TD'},
    {internal: 'ttd', external: 'TTD'}
  ];
  private DEFAULT_RB_COLUMNS:Column[] = [
    {internal: 'star', external: 'STAR'},
    {internal: 'name', external: 'Name'},
    {internal: 'team', external: 'Team'},
    {internal: 'pos', external: 'Position'},
    {internal: 'dvp', external: 'DVP'},
    {internal: 'ou', external: 'O/U'},
    {internal: 'teamou', external: 'Team O/U'},
    {internal: 'line', external: 'Line'},
    {internal: 'rushatt', external: 'Rush Att'},
    {internal: 'avg', external: 'AVG'},
    {internal: 'tgtsg', external: 'TGTs/G'}
  ];
  private DEFAULT_RB2_COLUMNS:Column[] = [
    {internal: 'star', external: 'STAR'},
    {internal: 'name', external: 'Name'},
    {internal: 'team', external: 'Team'},
    {internal: 'pos', external: 'Position'},
    {internal: 'ou', external: 'O/U'},
    {internal: 'teamou', external: 'Team O/U'},
    {internal: 'rec', external: 'Rec'},
    {internal: 'rectd', external: 'Rec TD'},
    {internal: 'tgtsg', external: 'TGTs/G'}
  ];
  private DEFAULT_WR_COLUMNS:Column[] = [
    {internal: 'star', external: 'STAR'},
    {internal: 'name', external: 'Name'},
    {internal: 'team', external: 'Team'},
    {internal: 'pos', external: 'Position'},
    {internal: 'ou', external: 'O/U'},
    {internal: 'teamou', external: 'Team O/U'},
    {internal: 'tgtsg', external: 'TGTs/G'},
    {internal: 'rec', external: 'Rec'},
    {internal: 'ms', external: 'MS%'},
  ];
  private DEFAULT_WR2_COLUMNS:Column[] = [
    {internal: 'star', external: 'STAR'},
    {internal: 'name', external: 'Name'},
    {internal: 'team', external: 'Team'},
    {internal: 'pos', external: 'Position'},
    {internal: 'dvp', external: 'DVP'},
    {internal: 'ou', external: 'O/U'},
    {internal: 'teamou', external: 'Team O/U'},
    {internal: 'tgtsg', external: 'TGTs/G'},
    {internal: 'rec', external: 'Rec'}
  ];
  private DEFAULT_TE_COLUMNS:Column[] = [
    {internal: 'star', external: 'STAR'},
    {internal: 'name', external: 'Name'},
    {internal: 'team', external: 'Team'},
    {internal: 'pos', external: 'Position'},
    {internal: 'dvp', external: 'DVP'},
    {internal: 'teamou', external: 'Team O/U'},
    {internal: 'tgtsg', external: 'TGTs/G'},
    {internal: 'rec', external: 'Rec'}
  ];

  private qb_columns:Column[];
  private rb_columns:Column[];
  private rb2_columns:Column[];
  private wr_columns:Column[];
  private wr2_columns:Column[];
  private te_columns:Column[];
  private all_columns:Column[];

  private _qbColumns:BehaviorSubject<Column[]>= new BehaviorSubject([]);
  private _rbColumns:BehaviorSubject<Column[]>= new BehaviorSubject([]);
  private _rb2Columns:BehaviorSubject<Column[]>= new BehaviorSubject([]);
  private _wrColumns:BehaviorSubject<Column[]>= new BehaviorSubject([]);
  private _wr2Columns:BehaviorSubject<Column[]>= new BehaviorSubject([]);
  private _teColumns:BehaviorSubject<Column[]>= new BehaviorSubject([]);
  private _allColumns:BehaviorSubject<Column[]> = new BehaviorSubject([]);

  constructor() { 
    //this.qb_columns =this.DEFAULT_QB_COLUMNS;
    //this._qbColumns.next(Object.assign({}, this.DEFAULT_QB_COLUMNS));
  }

  get getQb() {
    return this._qbColumns.asObservable();
  }
  get getRb() {
    return this._rbColumns.asObservable();
  }
  get getRb2() {
    return this._rb2Columns.asObservable();
  }
  get getTe() {
    return this._teColumns.asObservable();
  }
  get getWr() {
    return this._wrColumns.asObservable();
  }
  get getWr2() {
    return this._wr2Columns.asObservable();
  }

  setQb(columns) {
    this.qb_columns =columns;
    this._qbColumns.next(Object.assign({}, columns));
  }

  setRb(columns) {
    this.rb_columns =columns;
    this._rbColumns.next(Object.assign({}, columns));
  }

  setRb2(columns) {
    this.rb2_columns =columns;
    this._rb2Columns.next(Object.assign({}, columns));
  }

  setWr(columns) {
    this.wr_columns =columns;
    this._wrColumns.next(Object.assign({}, columns));
  }

  setWr2(columns) {
    this.wr2_columns =columns;
    this._wr2Columns.next(Object.assign({}, columns));
  }

  setTe(columns) {
    this.te_columns =columns;
    this._teColumns.next(Object.assign({}, columns));
  }

  getExternal(internal: string) {
    let all = this.qb_columns.concat(this.rb_columns).concat(this.wr_columns).concat(this.te_columns);
    for (let i=0; i<all.length; i++) {
      if (all[i].internal === internal) {
        return all[i].external;
      }
    }
    return internal;
  }

}
