import { HttpClient } from '@angular/common/http';
import { stringify } from '@angular/compiler/src/util';
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
  
  private custom_columnMap: Map<string, CustomColumn[]> = new Map<string, CustomColumn[]>();
  private _customColumnMap: BehaviorSubject<CustomColumn[]> = new BehaviorSubject([]);

  constructor(private http: HttpClient, private columnService:ColumnService) { 
    //this.custom_columns =this.DEFAULT_CUSTOM_COLUMN;
    this.initColumns().subscribe(data=>{
      this.custom_columns=data;
      this._customColumns.next(Object.assign({}, this.custom_columns));
      this.updateColumns();
    });
    this.initColumnMap().subscribe(data=>{
      this.setMap(data);
    });    
  }

  get getColumns() {
    return this._customColumns.asObservable();
  }

  public getColumnMapByKey(key: string) {
    this._customColumnMap.next(Object.assign({}, this.custom_columnMap.get(key)));
      return this._customColumnMap.asObservable();
  }

  public initColumns() {
    return this.http.get<CustomColumn[]>('/api/column/getCustom')
      .pipe(
        retry(3), // retry a failed request up to 3 times
      );
  }

  public initColumnMap() {
    return this.http.get<CustomColumn[]>('/api/column/getCustomMap')
      .pipe(
        retry(3), // retry a failed request up to 3 times
      );
  }
  public setMap(data:any) {
    for (let key in data) {
      let value = data[key];
      this.custom_columnMap.set(key, value);
    }
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

  updateColumnMapByKey(key:string) {
    for (let i=0; i<this.custom_columns.length; i++) {
      if (this.custom_columns[i].display) {
        this.columnService.addToMapByKey(key, {internal: this.custom_columns[i].internal, external: this.custom_columns[i].external})
      }
    }
  }

  setColumnMapByKey(key:string, columns: CustomColumn[]) {
    for (let i=0; i<columns.length; i++) {
      if (columns[i].display) {
        for (let position of columns[i].positions)
        this.columnService.addToMapByKey(position, {internal: columns[i].internal, external: columns[i].external});
      }
    }

    this.custom_columnMap.set(key, columns);
    const convMap = {};
      this.custom_columnMap.forEach((val: CustomColumn[], key: string) => {
        convMap[key] = val;
      });
    return this.http.post('/api/column/saveCustomMap', convMap).pipe(
      retry(3), // retry a failed request up to 3 times
    ) .subscribe((response)=>{
      console.log(response);
    });
  }

  removeMapByKey(key:string, column: CustomColumn) {
    let columns=this.custom_columnMap.get(key);
    let index=columns.indexOf(column);
    columns=columns.splice(index,1);
    this.custom_columnMap.set(key, columns);
  }

  private _keyToRemove: string;
  deleteMapByKey(targetKey:string) {
    this._keyToRemove=targetKey;
      this.custom_columnMap.forEach((value,key, map)=>{
        if (key.includes(this._keyToRemove)) {
          this.custom_columnMap.delete(key);
        }
      });
      const convMap = {};
        this.custom_columnMap.forEach((val: CustomColumn[], key: string) => {
          convMap[key] = val;
        });
      return this.http.post('/api/column/saveCustomMap', convMap).pipe(
        retry(3), // retry a failed request up to 3 times
      ) .subscribe((response)=>{
        console.log(response);
      });
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

  hideColumns(column: Column, game?: string){
    // pass the column, return true if column needs to be hidden, false otherwise.
    if (game && game.length>0) {
      if (this.custom_columnMap && this.custom_columnMap.get(game)) {
        console.log(this.custom_columnMap.get(game));
        console.log(game);
        const found=this.custom_columnMap.get(game).filter((node)=>{
          return (node.internal == column.internal && node.external == column.external && !node.display)
        })
        return found.length>0
      }
      return false;
    }
    else {
      if (this.custom_columns) {
        const found = this.custom_columns.filter((node)=>{
          return (node.internal == column.internal && node.external == column.external && !node.display)
        })
        return found.length>0
      }
      return false;
    }
    
  }
}
