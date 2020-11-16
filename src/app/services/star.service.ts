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
  
  private DEFAULT_STARS = [
    { 
      name: 'Quarterback',
      position: 'qb',
      background: 'quarterback.jfif',
      rulesets: [
        {
          qualifier: 'dvp',
          operator: '>=',
          value: 19,
          point: 1
        },
        {
          qualifier: 'ou',
          operator: '>=',
          value: 49,
          point: 1
        },
        {
          qualifier: 'rushyards',
          operator: '>=',
          value: 24,
          point: 1
        },
        {
          qualifier: 'rushtd',
          operator: '>=',
          value: .15,
          point: 1
        },
        {
          qualifier: 'ttd',
          operator: '>=',
          value: 2.2,
          point: 1
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
          value: 15,
          point: 1
        },
        {
          qualifier: 'ou',
          operator: '>=',
          value: 52,
          point: 1
        },
        {
          qualifier: 'line',
          operator: '<=',
          value: 0,
          point: 1
        },
        {
          qualifier: 'rushatt',
          operator: '>=',
          value: 15,
          point: 1
        },
        {
          qualifier: 'avg',
          operator: '>=',
          value: 18,
          point: 1
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
          value: 52,
          point: 1
        },
        {
          qualifier: 'teamou',
          operator: '>=',
          value: 26,
          point: 1
        },
        {
          qualifier: 'tgtsg',
          operator: '>=',
          value: 5,
          point: 1
        },
        {
          qualifier: 'rec',
          operator: '>=',
          value: 3.7,
          point: 1
        },
        {
          qualifier: 'ms',
          operator: '>=',
          value: 18,
          point: 1
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
          value: 26,
          point: 1
        },
        {
          qualifier: 'dvp',
          operator: '>=',
          value: 20,
          point: 1
        },
        {
          qualifier: 'tgtsg',
          operator: '>=',
          value: 3,
          point: 1
        },
        {
          qualifier: 'rec',
          operator: '>=',
          value: 2,
          point: 1
        }
      ]
    }
  ];
  public stars:Star[] = [];
  private _stars:BehaviorSubject<Star[]>= new BehaviorSubject([]);

  constructor(private http: HttpClient) { 
    //this.stars=this.DEFAULT_STARS;
    this.initStars().subscribe(data=>{
      this.updateStars(data);
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

  initStars() {
    return this.http.get<Star[]>('/api/star/get')
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
