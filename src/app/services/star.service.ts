import { Injectable } from '@angular/core';
import {Ruleset} from '../ruleset.interface';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, retry } from 'rxjs/operators';
import { BehaviorSubject, throwError } from 'rxjs';

export interface Star {
  name: string;
  position: string;
  rulesets: Ruleset[];
}

@Injectable({
  providedIn: 'root'
})
export class StarService {
  public stars:Star[] = [];
  private _starMap:Map<string, Star[]>=new Map<string, Star[]>();

  private _stars:BehaviorSubject<Star[]>= new BehaviorSubject([]);

  constructor(private http: HttpClient) { 
    //this.stars=this.DEFAULT_STARS;
    this.initStars().subscribe(data=>{
      this.updateStars(data);
    });
    this.initStarMap().subscribe(data=>{
      this.setMap(data);
    });
  }

  get getStars() {
    return this._stars.asObservable();
  }

  updateStars(stars: Star[]) {
    this.stars=stars;
    this._stars.next(Object.assign({}, this.stars));

    return this.http.post('/api/star/save', stars).pipe(
      retry(3), // retry a failed request up to 3 times
      catchError(this.handleError) // then handle the error
    ) .subscribe((response)=>{
      console.log(response);
    });
  }

  public setMap(data:any) {
    for (let key in data) {
      let value = data[key];
      this._starMap.set(key, value);
    }
  }

  getStarMapByKey(key: string) {
    this._stars.next(Object.assign({}, this._starMap.get(key)));
    return this._stars.asObservable();
  }

  updateStarMapByKey(key: string, stars: Star[]){
    this._starMap.set(key, stars);

    const convMap = {};
      this._starMap.forEach((val: Star[], key: string) => {
        convMap[key] = val;
      });

    return this.http.post('/api/star/saveMap', convMap).pipe(
      retry(3), // retry a failed request up to 3 times
      catchError(this.handleError) // then handle the error
    ) .subscribe((response)=>{
      console.log(response);
    });
  }

  initStars() {
    return this.http.get<Star[]>('/api/star/get')
      .pipe(
        retry(3), // retry a failed request up to 3 times
        catchError(this.handleError) // then handle the error
      );
  }

  initStarMap() {
    return this.http.get<Star[]>('/api/star/getMap')
      .pipe(
        retry(3), // retry a failed request up to 3 times
        catchError(this.handleError) // then handle the error
      );
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
