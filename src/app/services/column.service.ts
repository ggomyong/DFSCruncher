import { Injectable } from '@angular/core';
import { BehaviorSubject, of, Subject, throwError } from 'rxjs';
import { Column } from '../column.interface';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, retry } from 'rxjs/operators';

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
  private def_columns:Column[];

  private _qbColumns:BehaviorSubject<Column[]>= new BehaviorSubject([]);
  private _rbColumns:BehaviorSubject<Column[]>= new BehaviorSubject([]);
  private _rb2Columns:BehaviorSubject<Column[]>= new BehaviorSubject([]);
  private _wrColumns:BehaviorSubject<Column[]>= new BehaviorSubject([]);
  private _wr2Columns:BehaviorSubject<Column[]>= new BehaviorSubject([]);
  private _teColumns:BehaviorSubject<Column[]>= new BehaviorSubject([]);
  private _defColumns:BehaviorSubject<Column[]> = new BehaviorSubject([]);

  constructor(private http : HttpClient) { 
    //this.qb_columns =this.DEFAULT_QB_COLUMNS;
    //this._qbColumns.next(Object.assign({}, this.DEFAULT_QB_COLUMNS));
    this.init();
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

  get getDef() {
    return this._defColumns.asObservable();
  }

  public init() {
    this.initQB().subscribe(data=>{
      this.setQb(data);
    });
    this.initRB().subscribe(data=>{
      this.setRb(data);
    });
    this.initWR().subscribe(data=>{
      this.setWr(data);
    });
    this.initTE().subscribe(data=>{
      this.setTe(data);
    });
    this.initDEF().subscribe(data=>{
      this.setDef(data);
    })
  }

  private pushColumn(myColumns:Column[], myColumn:Column):boolean {
    if (!myColumns) return false;
    const found = myColumns.some(el => el.internal === myColumn.internal);
    if (!found) {
      myColumns.push(myColumn);
      return true;
    }
    return false;
  }

  addToQb(column) {
    if (this.pushColumn(this.qb_columns, column)) {
      this.setQb(this.qb_columns);
    }
  }

  addToWr(column) {
    if (this.pushColumn(this.wr_columns, column)) {
      this.setWr(this.wr_columns);
    }
  }

  addToRb(column) {
    if (this.pushColumn(this.rb_columns, column)) {
      this.setRb(this.rb_columns);
    }
  }

  addToTe(column) {
    if (this.pushColumn(this.te_columns, column)) {
      this.setQb(this.te_columns);
    }
  }

  setQb(columns) {
    this.qb_columns =columns;
    this._qbColumns.next(Object.assign({}, columns));
    this.http.post('/api/column/saveQB', this.qb_columns).pipe(
      retry(3), // retry a failed request up to 3 times
      catchError(this.handleError) // then handle the error
    ) .subscribe((response)=>{
      console.log(response);
    });
  }
  initQB() {
    return this.http.get<Column[]>('/api/column/getQB')
      .pipe(
        retry(3), // retry a failed request up to 3 times
        catchError(this.handleError) // then handle the error
      );
  }

  setRb(columns) {
    this.rb_columns =columns;
    this._rbColumns.next(Object.assign({}, columns));
    this.http.post('/api/column/saveRB', this.rb_columns).pipe(
      retry(3), // retry a failed request up to 3 times
      catchError(this.handleError) // then handle the error
    ) .subscribe((response)=>{
      console.log(response);
    });
  }

  initRB() {
    return this.http.get<Column[]>('/api/column/getRB')
      .pipe(
        retry(3), // retry a failed request up to 3 times
        catchError(this.handleError) // then handle the error
      );
  }

  setRb2(columns) {
    this.rb2_columns =columns;
    this._rb2Columns.next(Object.assign({}, columns));
  }

  setWr(columns) {
    this.wr_columns =columns;
    this._wrColumns.next(Object.assign({}, columns));
    this.http.post('/api/column/saveWR', this.wr_columns).pipe(
      retry(3), // retry a failed request up to 3 times
      catchError(this.handleError) // then handle the error
    ) .subscribe((response)=>{
      console.log(response);
    });
  }
  setDef(columns) {
    this.def_columns =columns;
    this._defColumns.next(Object.assign({}, columns));
    this.http.post('/api/column/saveDEF', this.def_columns).pipe(
      retry(3), // retry a failed request up to 3 times
      catchError(this.handleError) // then handle the error
    ) .subscribe((response)=>{
      console.log(response);
    });
  }
  initWR() {
    return this.http.get<Column[]>('/api/column/getWR')
      .pipe(
        retry(3), // retry a failed request up to 3 times
        catchError(this.handleError) // then handle the error
      );
  }

  setWr2(columns) {
    this.wr2_columns =columns;
    this._wr2Columns.next(Object.assign({}, columns));
  }

  setTe(columns) {
    this.te_columns =columns;
    this._teColumns.next(Object.assign({}, columns));
    this.http.post('/api/column/saveTE', this.te_columns).pipe(
      retry(3), // retry a failed request up to 3 times
      catchError(this.handleError) // then handle the error
    ) .subscribe((response)=>{
      console.log(response);
    });
  }

  initTE() {
    return this.http.get<Column[]>('/api/column/getTE')
      .pipe(
        retry(3), // retry a failed request up to 3 times
        catchError(this.handleError) // then handle the error
      );
  }

  initDEF() {
    return this.http.get<Column[]>('/api/column/getDEF')
      .pipe(
        retry(3), // retry a failed request up to 3 times
        catchError(this.handleError) // then handle the error
      );
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
  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${error.error}`);
    }
    // return an observable with a user-facing error message
    return throwError(
      'Something bad happened; please try again later.');
  };
}
