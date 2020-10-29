import { Injectable } from '@angular/core';
import { BehaviorSubject, of, Subject } from 'rxjs';
import { Player } from '../player.class';
import { StarService } from './star.service';

@Injectable({
  providedIn: 'root'
})
export class PlayerService {
  private playerList:Player[]=[];
  private observablePlayers: BehaviorSubject<Player[]>= new BehaviorSubject([]);

  constructor(private starService:StarService) { }

  get getPlayers() {
    return this.observablePlayers.asObservable();
  }

  public addToList(player:Player): boolean {
    if (this.isValidPlayer(player) && !this.isDuplicate(player)) {
      player.ttd=Number(player.rushtd)+Number(player.passtd);
      player.ttd = Number(player.ttd.toFixed(2));
      player.star=this.calculateSTAR(player);
      this.playerList.push(player);
      this.observablePlayers.next(Object.assign({}, this.playerList));
      return true;
    }
    return false;
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
            if (eval(player[ruleset.qualifier] + ruleset.operator + ruleset.value)) {
              console.log(player[ruleset.qualifier] + ruleset.operator + ruleset.value);
              star++;
            }
          }
        }
      }
    }
    return star;
  }
}
