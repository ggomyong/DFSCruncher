import { Injectable } from '@angular/core';
import { BehaviorSubject, of, Subject } from 'rxjs';
import { Column } from '../column.interface';
@Injectable({
  providedIn: 'root'
})
export class ColumnService {
  private DEFAULT_COLUMNS:Column[] = [
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

  private columns:Column[];
  private observableColumns: BehaviorSubject<Column[]>= new BehaviorSubject([]);


  constructor() { 
    this.columns=this.DEFAULT_COLUMNS;
    console.log(this.columns);
    this.observableColumns.next(Object.assign({}, this.columns));
  }

  get getColumns() {
    return this.observableColumns.asObservable();
  }
}
