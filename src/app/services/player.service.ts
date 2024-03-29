import { Injectable } from '@angular/core';
import { BehaviorSubject, of, Subject, throwError } from 'rxjs';
import { Player } from '../player.class';
import { ColumnService } from './column.service';
import { Star, StarService } from './star.service';
import { ToastrService } from 'ngx-toastr';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, retry } from 'rxjs/operators';
import { CustomColumn, CustomColumnService } from './custom-column.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class PlayerService {
  private playerList:Player[]=[];
  
  private qbList:Player[]=[];
  private rbList:Player[]=[];
  private rb2List:Player[]=[];
  private teList:Player[]=[];
  private wrList:Player[]=[];
  private wr2List:Player[]=[];
  private defList:Player[]=[];

  private observablePlayers: BehaviorSubject<Player[]>= new BehaviorSubject([]);

  private _qbList:BehaviorSubject<Player[]>= new BehaviorSubject([]);
  private _rbList:BehaviorSubject<Player[]>= new BehaviorSubject([]);
  private _rb2List:BehaviorSubject<Player[]>= new BehaviorSubject([]);
  private _teList:BehaviorSubject<Player[]>= new BehaviorSubject([]);
  private _wrList:BehaviorSubject<Player[]>= new BehaviorSubject([]);
  private _wr2List:BehaviorSubject<Player[]>= new BehaviorSubject([]);
  private _defList:BehaviorSubject<Player[]> = new BehaviorSubject([]);

  private _customColumnList:CustomColumn[];

  private playerMap: Map<string, Player[]> = new Map<string,Player[]>(); // generic map for players
  private _playerMap: BehaviorSubject<Player[]> = new BehaviorSubject([]);
  private _star:Star[] = [];
  private _customColumnsMap:Map<string,CustomColumn[]>=new Map<string,CustomColumn[]>();

  public lastPosition: string ='';

  constructor(private router:Router, private starService:StarService, private columnService: ColumnService, private toastrService:ToastrService,private customColumnService:CustomColumnService,
    private http : HttpClient) { 
      this.customColumnService.getColumns.subscribe(data=>{
        this._customColumnList=Object.values(data);
      });

      this.customColumnService.initColumnMap().subscribe(data=>{
        this.customColumnService.setMap(data);
        this.customColumnService.getColumnMapByKey('nba').subscribe(data =>{
          this._customColumnsMap.set('nba', Object.values(data));
        }); 
      });
    }

    public initPlayerMap () {
      return this.http.get<Map<string,Player[]>>('/api/player/getMap')
        .pipe(
          retry(3), // retry a failed request up to 3 times
          catchError(this.handleError) // then handle the error
        );
    }
  
    public getPlayerByKey (key: string) {
      this._playerMap.next(Object.assign({}, this.playerMap.get(key)));
      return this._playerMap.asObservable();
    }
  
    public addToMapByKey (key: string, player:Player) {
      let players:Player[] = this.playerMap.get(key);
      if (players==null || players == undefined){
        players=[];
      }
      players.push(player);
      this.playerMap.set(key, players);
    }
  
    public setMap(data:any) {
      for (let key in data) {
        let value = data[key];
        for (let i=0; i<value.length; i++) {
          if (value[i].pos && !value[i].pos.includes('.')) {
            value[i].pos=key;
          }
          value[i].star=this.calculateSTAR(value[i]);
        }
        this.playerMap.set(key, value);
      }
    }
  
    public setMapByKey(key: string, players: Player[]) {
      this.playerMap.set(key, players);
      
      const convMap = {};
      this.playerMap.forEach((val: Player[], key: string) => {
        convMap[key] = val;
      });

      this.http.post('/api/player/saveMap', convMap).pipe(
        retry(3), // retry a failed request up to 3 times
        catchError(this.handleError) // then handle the error
      ) .subscribe((response)=>{
        console.log(response);
      });
    }

    public saveMapByKey(key: string) {
      const convMap = {};
      this.playerMap.forEach((val: Player[], key: string) => {
        convMap[key] = val;
      });
      this.http.post('/api/player/saveMap', convMap).pipe(
        retry(3), // retry a failed request up to 3 times
        catchError(this.handleError) // then handle the error
      ) .subscribe((response)=>{
        console.log(response);
        /*if (this.lastPosition!='') {
          this.router.navigate(['/nba-landing'],{queryParams: {position: this.lastPosition}});
          window.setTimeout(()=>{location.reload()}, 500)
        }
        else {
          location.reload();
        }*/
        
      });
    }

    private _keyToRemove: string;
    public removeMapByKey(targetKey: string, callme) {
      this._keyToRemove=targetKey;
      this.playerMap.forEach((value,key, map)=>{
        if (key.includes(this._keyToRemove)) {
          this.playerMap.delete(key);
        }
      });

      const convMap = {};
      this.playerMap.forEach((val: Player[], key: string) => {
        convMap[key] = val;
      });

      this.http.post('/api/player/saveMap', convMap).pipe(
        retry(3), // retry a failed request up to 3 times
        catchError(this.handleError) // then handle the error
      ) .subscribe((response)=>{
        //console.log(response);
        callme();
      });
      
    }
  

  get getPlayers() {
    return this.observablePlayers.asObservable();
  }

  get getQb() {
    return this._qbList.asObservable();
  }
  get getRb() {
    return this._rbList.asObservable();
  }
  get getRb2() {
    return this._rb2List.asObservable();
  }
  get getTe() {
    return this._teList.asObservable();
  }
  get getWr() {
    return this._wrList.asObservable();
  }
  get getWr2() {
    return this._wr2List.asObservable();
  }
  get getDef() {
    return this._defList.asObservable();
  }

  public removePlayer(player:Player) {
    if (player.pos.includes('.')) {
      return this.newRemovePlayer(player);
    }
    switch(player.pos.toLocaleLowerCase()) {
      case 'qb':
        this.qbList.splice(this.qbList.indexOf(player),1);
        this._qbList.next(Object.assign({}, this.qbList));
        break;
      case 'rb':
        this.rbList.splice(this.rbList.indexOf(player),1);
        this._rbList.next(Object.assign({}, this.rbList));
        break;
      case 'rb2':
        this.rb2List.splice(this.rb2List.indexOf(player),1);
        this._rb2List.next(Object.assign({}, this.rb2List));
        break;
      case 'wr':
        this.wrList.splice(this.wrList.indexOf(player),1);
        this._wrList.next(Object.assign({}, this.wrList));
        break;
      case 'wr2':
        this.wr2List.splice(this.wr2List.indexOf(player),1);
        this._wr2List.next(Object.assign({}, this.wr2List));
        break;
      case 'te':
        this.teList.splice(this.teList.indexOf(player),1);
        this._teList.next(Object.assign({}, this.teList));
        break;
      case 'def':
        this.defList.splice(this.defList.indexOf(player),1);
        this._defList.next(Object.assign({}, this.defList));
    }
    this.saveAll();
  }

  private newRemovePlayer(player:Player): void {
    let key= player.pos;
    let players = this.playerMap.get(key);
    for (let i=0; i<players.length; i++) {
      let target:Player = players[i];

      if (target['name']==player['name']) {
        players.splice(i,1);
        break;
      }
    }
    this.playerMap.set(key, players);
    this.saveMapByKey('');
    return;
  }

  public recalculateStar() {
    //this.newRecalculateStar();
    for (let i=0; i<this.qbList.length; i++) {
      this.qbList[i]['star']=this.calculateSTAR(this.qbList[i]);
    }
    this._qbList.next(Object.assign({}, this.qbList));
    this.saveQB();

    for (let i=0; i<this.rbList.length; i++) {
      this.rbList[i]['star']=this.calculateSTAR(this.rbList[i]);
    }
    this._rbList.next(Object.assign({}, this.rbList));
    this.saveRB();

    for (let i=0; i<this.wrList.length; i++) {
      this.wrList[i]['star']=this.calculateSTAR(this.wrList[i]);
    }
    this._wrList.next(Object.assign({}, this.wrList));
    this.saveWR();

    for (let i=0; i<this.teList.length; i++) {
      this.teList[i]['star']=this.calculateSTAR(this.teList[i]);
    }
    this._teList.next(Object.assign({}, this.teList));
    this.saveTE();

    for (let i=0; i<this.defList.length; i++) {
      this.defList[i]['star']=this.calculateSTAR(this.defList[i]);
    }
    this._defList.next(Object.assign({}, this.defList));
    this.saveDEF();
  }

  public addToList(player:Player, playerType:string): boolean {
    if (this.isValidPlayer(player) && !this.isDuplicate(player)) {
      switch(playerType) {
        case 'qb':
          player.star=this.calculateSTAR(player);
          this.qbList.push(player);
          this._qbList.next(Object.assign({}, this.qbList));
          break;
        case 'rb':
          player.star=this.calculateSTAR(player);
          this.rbList.push(player);
          this._rbList.next(Object.assign({}, this.rbList));
          break;
        case 'te':
          player.star=this.calculateSTAR(player);
          this.teList.push(player);
          this._teList.next(Object.assign({}, this.teList));
          break;
        case 'wr':
          player.star=this.calculateSTAR(player);
          this.wrList.push(player);
          this._wrList.next(Object.assign({}, this.wrList));
          break;
        case 'def':
          player.star=this.calculateSTAR(player);
          this.defList.push(player);
          this._defList.next(Object.assign({}, this.defList));
          break;
        default:
          return false;
      }
    }

    
    return true;
  }

  public removeFromList(player:Player): boolean {
    if (this.isValidPlayer(player) && this.isDuplicate(player)) {
      for (let i=0; i<this.playerList.length; i++) {
        if (this.playerList[i]['name'] == player['name'] && this.playerList[i].team == player.team) {
          this.playerList.splice(i, 1); //remove the target player
          this.observablePlayers.next(Object.assign({}, this.playerList));
          
          return true;
        }
      }
    }
    return false;
  }

  public isValidPlayer(player:Player):boolean {
    return true;
    //both name and team must be non-null to be a valid player
    //if (player['name'] && player['name'].length>0 && player['name']!=undefined && player.team && player.team.length>0 && player.team!=undefined) return true;
    //return false;
  }

  public isDuplicate(player:Player):boolean {
    let playerList=this.qbList.concat(this.rbList).concat(this.wrList).concat(this.teList);

    for (let i=0; i<playerList.length; i++) {
      //duplicate check: if name and team are the same, it's a duplicate entry
      if (playerList[i]['name']==player['name'] && playerList[i].team == player.team  && playerList[i].pos==player.pos) {
        return true;
      }
    }
    return false;
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
  public pingServer() {
    return this.http.get('/api/hello');
  }
  public init() {
    this.initQB().subscribe(data=>{
      this.qbList=data;
      this._qbList.next(Object.assign({}, this.qbList));
    });
    this.initRB().subscribe(data=>{
      this.rbList=data;
      this._rbList.next(Object.assign({}, this.rbList));
    });
    this.initWR().subscribe(data=>{
      this.wrList=data;
      this._wrList.next(Object.assign({}, this.wrList));
    });
    this.initTE().subscribe(data=>{
      this.teList=data;
      this._teList.next(Object.assign({}, this.teList));
    });
    this.initDEF().subscribe(data=>{
      this.defList=data;
      this._defList.next(Object.assign({}, this.defList));
    });
    this.starService.initStarMap().subscribe(data=>{
      this.starService.setMap(data);
      this.starService.getStarMapByKey('nba').subscribe(data=>{
        this._star=Object.values(data);
        this.initPlayerMap().subscribe(data=>{
          this.setMap(data);
        });
      });
    });
    
  }
  public initQB() {
    return this.http.get<Player[]>('/api/player/getQB')
      .pipe(
        retry(3), // retry a failed request up to 3 times
        catchError(this.handleError) // then handle the error
      );
  }

  public initDEF() {
    return this.http.get<Player[]>('/api/player/getDEF')
      .pipe(
        retry(3), // retry a failed request up to 3 times
        catchError(this.handleError) // then handle the error
      );
  }

  public saveAll() {
    this.saveQB();
    this.saveDEF();
    this.saveRB();
    this.saveWR();
    this.saveTE();
  }

  public saveQB() {
    return this.http.post('/api/player/saveQB', this.qbList).pipe(
      retry(3), // retry a failed request up to 3 times
      catchError(this.handleError) // then handle the error
    ) .subscribe((response)=>{
      console.log(response);
    });
  }
  public saveDEF() {
    return this.http.post('/api/player/saveDEF', this.defList).pipe(
      retry(3), // retry a failed request up to 3 times
      catchError(this.handleError) // then handle the error
    ) .subscribe((response)=>{
      console.log(response);
    });
  }

  public initRB() {
    return this.http.get<Player[]>('/api/player/getRB')
      .pipe(
        retry(3), // retry a failed request up to 3 times
        catchError(this.handleError) // then handle the error
      );
  }
  public saveRB() {
    return this.http.post('/api/player/saveRB', this.rbList).pipe(
      retry(3), // retry a failed request up to 3 times
      catchError(this.handleError) // then handle the error
    ) .subscribe((response)=>{
      console.log(response);
    });
  }
  public initWR() {
    return this.http.get<Player[]>('/api/player/getWR')
      .pipe(
        retry(3), // retry a failed request up to 3 times
        catchError(this.handleError) // then handle the error
      );
  }
  public saveWR() {
    return this.http.post('/api/player/saveWR', this.wrList).pipe(
      retry(3), // retry a failed request up to 3 times
      catchError(this.handleError) // then handle the error
    ) .subscribe((response)=>{
      console.log(response);
    });
  }
  public initTE() {
    return this.http.get<Player[]>('/api/player/getTE')
      .pipe(
        retry(3), // retry a failed request up to 3 times
        catchError(this.handleError) // then handle the error
      );
  }
  public saveTE() {
    return this.http.post('/api/player/saveTE', this.teList).pipe(
      retry(3), // retry a failed request up to 3 times
      catchError(this.handleError) // then handle the error
    ) .subscribe((response)=>{
      console.log(response);
    });
  }
  public newRecalculateStar():void {
    this.playerMap.forEach((val: Player[], key: string) => {
        for (let i=0; i<val.length; i++) {
          let player=val[i];
          player.star=this.calculateSTAR(player);
          val[i]=player;
        }
        this.playerMap.set(key, val);
      });
      this.saveMapByKey('');
  }
  private newStar(player): number {
    let star: number=0;

    let customColumns=this._customColumnsMap.get(player.pos.split('.')[0]);
    if (customColumns) {
      for (let i=0; i<customColumns.length; i++) {
        if (customColumns[i].positions.includes(player.pos)) {
          try {
            eval(customColumns[i].jitLogic);
          }
          catch {
            let warning=player['name'] + ' has an issue with '+customColumns[i].external +' calculation.';
            //this.toastrService.error(warning, 'Calculation Error', {});
          }
        }
      }
    }
    

    let stars=this._star
    for (let i=0; i<stars.length; i++) {
          
      if (stars[i].position.toLocaleLowerCase() == player.pos.toLocaleLowerCase()) {
        let rulesets =stars[i].rulesets;
        for (let j=0; j<rulesets.length; j++) {
          let ruleset = rulesets[j];

          let points:number = ruleset.point;

          if (ruleset.operator.includes('[')) {
            if (ruleset.operator=='[') {
              if (player[ruleset.qualifier].includes(ruleset.value)) {
                star=star+points;
              }
            }
            else if (ruleset.operator=='![') {
              if (!player[ruleset.qualifier].includes(ruleset.value)) {
                star=star+points;
              }
            }
          }
          else {
            try {
              if (eval(player[ruleset.qualifier] + ruleset.operator + ruleset.value)) {
                star=star+points;
              }
            }
            catch {
              let warning=player['name'] + ' has an issue with '+this.columnService.getExternal(ruleset.qualifier)+' whose value is ' + player[ruleset.qualifier];
              //this.toastrService.error(warning, 'Calculation Error', {});
              //console.log(warning);
            }
          }
        }
      }
    }
    return star;
  }
  private calculateSTAR(player:Player):number {
    if (!player || !player.pos) return 0;
    if (player.pos && player.pos.includes('.')) {
      return this.newStar(player);
    }
    let star: number=0;
    for (let i=0; i<this._customColumnList.length; i++) {
      if (this._customColumnList[i].positions.includes(player.pos.toLocaleLowerCase())) {
        try {
          eval(this._customColumnList[i].jitLogic);
        }
        catch {
          let warning=player['name'] + ' has an issue with '+this._customColumnList[i].external +' calculation.';
          //this.toastrService.error(warning, 'Calculation Error', {});
        }
      }
    }

    for (let i=0; i<this.starService.stars.length; i++) {
      if (this.starService.stars[i].position.toLocaleLowerCase() == player.pos.toLocaleLowerCase()) {
        let rulesets = this.starService.stars[i].rulesets;
        for (let j=0; j<rulesets.length; j++) {
          let ruleset = rulesets[j];
          let points:number = ruleset.point;

          if (ruleset.operator.includes('[')) {
            if (ruleset.operator=='[') {
              if (player[ruleset.qualifier].includes(ruleset.value)) {
                star=star+points;
              }
            }
            else if (ruleset.operator=='![') {
              if (!player[ruleset.qualifier].includes(ruleset.value)) {
                star=star+points;
              }
            }
          }
          else {
            try {
              if (eval(player[ruleset.qualifier] + ruleset.operator + ruleset.value)) {
                star=star+points;
              }
            }
            catch {
              let warning=player['name'] + ' has an issue with '+this.columnService.getExternal(ruleset.qualifier)+' whose value is ' + player[ruleset.qualifier];
              //this.toastrService.error(warning, 'Calculation Error', {});
              //console.log(warning);
            }
          }
        }
      }
    }
    return star;
  }
}
