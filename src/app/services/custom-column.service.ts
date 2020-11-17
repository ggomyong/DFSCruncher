import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { retry } from 'rxjs/operators';
import { Column } from '../column.interface';
import { ColumnService } from './column.service';

export interface CustomColumn {
  internal: string;
  external: string;
  display: boolean;
  jitLogic: string; // JavaScript code to be evaluated
  positions: string[];
}

@Injectable({
  providedIn: 'root'
})
export class CustomColumnService {
  private custom_columns:CustomColumn[];
  private _customColumns:BehaviorSubject<CustomColumn[]>= new BehaviorSubject([]);
  private DEFAULT_CUSTOM_COLUMN:CustomColumn[] = [
    {
      internal: 'ttd',
      external: 'TTD',
      display: true,
      jitLogic: `player['ttd']=(Number(player['passtd'])+Number(player['rushtd'])).toFixed(2);`,
      positions: ['qb']
    },
    {
      internal: 'diff',
      external: 'DIFF',
      display: false,
      jitLogic: `player['diff']=(player['tgtsg']-player['rec']).toFixed(2); if (player['diff']<0) { player['tgtsg']=player['rec']+1; player['diff']=(player['tgtsg']-player['rec']).toFixed(2);}`,
      positions: ['rb','te','wr']
    },
    {
      internal: 'totalyards',
      external: 'Total Yards',
      display: true,
      jitLogic: `player['totalyards']=(Number(player['rushyards'])+Number(player['recyards'])).toFixed(2);`,
      positions: ['rb']
    },
    {
      internal: 'totaltouchdowns',
      external: 'Total TouchDowns',
      display: true,
      jitLogic: `player['totaltouchdowns']=(Number(player['rushtd'])+Number(player['rectd'])).toFixed(2);`,
      positions: ['rb']
    },
    {
      internal: 'totaltouches',
      external: 'Total Touches',
      display: true,
      jitLogic: `player['totaltouches']=(Number(player['rushatt'])+Number(player['tgtsg'])).toFixed(2);`,
      positions: ['rb']
    },
  ]
  constructor(private http: HttpClient, private columnService:ColumnService) { 
    //this.custom_columns =this.DEFAULT_CUSTOM_COLUMN;
    this.initColumns().subscribe(data=>{
      this.custom_columns=data;
      this._customColumns.next(Object.assign({}, this.custom_columns));
      this.updateColumns();
    });
    
  }

  get getColumns() {
    return this._customColumns.asObservable();
  }

  public initColumns() {
    return this.http.get<CustomColumn[]>('/api/column/getCustom')
      .pipe(
        retry(3), // retry a failed request up to 3 times
      );
  }
  
  updateColumns() {
    for (let i=0; i<this.custom_columns.length; i++) {
      if (this.custom_columns[i].display) {
        if (this.custom_columns[i].positions.indexOf('qb')>-1) {
          this.columnService.addToQb({internal: this.custom_columns[i].internal, external: this.custom_columns[i].external});
        }
        if (this.custom_columns[i].positions.indexOf('rb')>-1) {
          this.columnService.addToRb({internal: this.custom_columns[i].internal, external: this.custom_columns[i].external});
        }
        if (this.custom_columns[i].positions.indexOf('wr')>-1) {
          this.columnService.addToWr({internal: this.custom_columns[i].internal, external: this.custom_columns[i].external});
        }
        if (this.custom_columns[i].positions.indexOf('te')>-1) {
          this.columnService.addToTe({internal: this.custom_columns[i].internal, external: this.custom_columns[i].external});
        }
        if (this.custom_columns[i].positions.indexOf('def')>-1) {
          this.columnService.addToDef({internal: this.custom_columns[i].internal, external: this.custom_columns[i].external});
        }
      }
    }
  }

  setColumns(columns:CustomColumn[]) {
    for (let i=0; i<columns.length; i++) {
      if (columns[i].display) {
        if (columns[i].positions.indexOf('qb')>-1) {
          this.columnService.addToQb({internal: columns[i].internal, external: columns[i].external});
        }
        if (columns[i].positions.indexOf('rb')>-1) {
          this.columnService.addToRb({internal: columns[i].internal, external: columns[i].external});
        }
        if (columns[i].positions.indexOf('wr')>-1) {
          this.columnService.addToWr({internal: columns[i].internal, external: columns[i].external});
        }
        if (columns[i].positions.indexOf('te')>-1) {
          this.columnService.addToTe({internal: columns[i].internal, external: columns[i].external});
        }
        if (columns[i].positions.indexOf('def')>-1) {
          this.columnService.addToDef({internal: columns[i].internal, external: columns[i].external});
        }
      }
    }

    this.custom_columns =columns;
    this._customColumns.next(Object.assign({}, this.custom_columns));

    return this.http.post('/api/column/saveCustom', this.custom_columns).pipe(
      retry(3), // retry a failed request up to 3 times
    ) .subscribe((response)=>{
      console.log(response);
    });
  }
}
