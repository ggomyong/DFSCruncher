import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BehaviorSubject, of, Subject } from 'rxjs';
import { Player } from '../player.class';
import { ColumnService } from './column.service';
import { StarService } from './star.service';
import { ToastrService } from 'ngx-toastr';

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

  private observablePlayers: BehaviorSubject<Player[]>= new BehaviorSubject([]);

  private _qbList:BehaviorSubject<Player[]>= new BehaviorSubject([]);
  private _rbList:BehaviorSubject<Player[]>= new BehaviorSubject([]);
  private _rb2List:BehaviorSubject<Player[]>= new BehaviorSubject([]);
  private _teList:BehaviorSubject<Player[]>= new BehaviorSubject([]);
  private _wrList:BehaviorSubject<Player[]>= new BehaviorSubject([]);
  private _wr2List:BehaviorSubject<Player[]>= new BehaviorSubject([]);

  constructor(private starService:StarService, private columnService: ColumnService, private toastrService:ToastrService) { }

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
  public removePlayer(player:Player) {
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
    }
  }
  public recalculateStar() {
    for (let i=0; i<this.qbList.length; i++) {
      this.qbList[i]['star']=this.calculateSTAR(this.qbList[i]);
    }
    this._qbList.next(Object.assign({}, this.qbList));

    for (let i=0; i<this.rbList.length; i++) {
      this.rbList[i]['star']=this.calculateSTAR(this.rbList[i]);
    }
    this._rbList.next(Object.assign({}, this.rbList));

    for (let i=0; i<this.rb2List.length; i++) {
      this.rb2List[i]['star']=this.calculateSTAR(this.rb2List[i]);
    }
    this._rb2List.next(Object.assign({}, this.rb2List));

    for (let i=0; i<this.wrList.length; i++) {
      this.wrList[i]['star']=this.calculateSTAR(this.wrList[i]);
    }
    this._wrList.next(Object.assign({}, this.wrList));

    for (let i=0; i<this.wr2List.length; i++) {
      this.wr2List[i]['star']=this.calculateSTAR(this.wr2List[i]);
    }
    this._wr2List.next(Object.assign({}, this.wr2List));

    for (let i=0; i<this.teList.length; i++) {
      this.teList[i]['star']=this.calculateSTAR(this.teList[i]);
    }
    this._teList.next(Object.assign({}, this.teList));
  }

  public addToList(player:Player, playerType:string): boolean {
    if (this.isValidPlayer(player) && !this.isDuplicate(player)) {
     
      switch(playerType) {
        case 'qb':
          player['ttd']=(Number(player['passtd'])+Number(player['rushtd'])).toFixed(2);
          player.star=this.calculateSTAR(player);
          this.qbList.push(player);
          this._qbList.next(Object.assign({}, this.qbList));
          break;
        case 'rb':
          player['diff']=(player['tgtsg']-player['rec']).toFixed(2);
          player.star=this.calculateSTAR(player);
          this.rbList.push(player);
          this._rbList.next(Object.assign({}, this.rbList));
          break;
        case 'rb2':
          player['diff']=(player['tgtsg']-player['rec']).toFixed(2);
          player.star=this.calculateSTAR(player);
          this.rb2List.push(player);
          this._rb2List.next(Object.assign({}, this.rb2List));
          break;
        case 'te':
          player['diff']=(player['tgtsg']-player['rec']).toFixed(2);
          player.star=this.calculateSTAR(player);
          this.teList.push(player);
          this._teList.next(Object.assign({}, this.teList));
          break;
        case 'wr':
          player['diff']=(player['tgtsg']-player['rec']).toFixed(2);
          player.star=this.calculateSTAR(player);
          this.wrList.push(player);
          this._wrList.next(Object.assign({}, this.wrList));
          break;
        case 'wr2':
          player['diff']=(player['tgtsg']-player['rec']).toFixed(2);
          player.star=this.calculateSTAR(player);
          this.wr2List.push(player);
          this._wr2List.next(Object.assign({}, this.wr2List));
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
        if (this.playerList[i].name == player.name && this.playerList[i].team == player.team) {
          this.playerList.splice(i, 1); //remove the target player
          this.observablePlayers.next(Object.assign({}, this.playerList));
          return true;
        }
      }
    }
    return false;
  }

  public isValidPlayer(player:Player):boolean {
    //both name and team must be non-null to be a valid player
    if (player.name && player.name.length>0 && player.name!=undefined && player.team && player.team.length>0 && player.team!=undefined) return true;
    return false;
  }

  public isDuplicate(player:Player):boolean {
    for (let i=0; i<this.playerList.length; i++) {
      //duplicate check: if name and team are the same, it's a duplicate entry
      if (this.playerList[i].name==player.name && this.playerList[i].team == player.team) {
        return true;
      }
    }
    return false;
  }
  private calculateSTAR(player:Player):number {
    let star=0;
    for (let i=0; i<this.starService.stars.length; i++) {

      if (this.starService.stars[i].position.toLocaleLowerCase() == player.pos.toLocaleLowerCase()) {
        let rulesets = this.starService.stars[i].rulesets;
        for (let j=0; j<rulesets.length; j++) {
          let ruleset = rulesets[j];
          if (ruleset.operator.includes('[')) {
            if (ruleset.operator=='[') {
              if (player[ruleset.qualifier].includes(ruleset.value)) {
                star++;
              }
            }
            else if (ruleset.operator=='![') {
              if (!player[ruleset.qualifier].includes(ruleset.value)) {
                star++;
              }
            }
          }
          else {
            try {
              if (eval(player[ruleset.qualifier] + ruleset.operator + ruleset.value)) {
                star++;
              }
            }
            catch {
              let warning=player['name'] + ' has an issue with '+this.columnService.getExternal(ruleset.qualifier)+' whose value is ' + player[ruleset.qualifier];
              this.toastrService.error(warning, 'Calculation Error', {});
              console.log(warning);
            }
          }
        }
      }
    }
    return star;
  }
}
