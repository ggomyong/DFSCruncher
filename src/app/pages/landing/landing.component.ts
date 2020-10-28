import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { Player } from '../../player.class';
import { PlayerService } from 'src/app/services/player.service';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.css']
})
export class LandingComponent implements OnInit, AfterViewInit  {
  displayedColumns: string[] = [
    'name', 'team', 'pos', 'dvp', 'ou', 'teamou', 'passtd', 
    'rushyards', 'rushtd', 'ttd'
  ];
  dataSource = new MatTableDataSource([]);
  constructor(private playerService:PlayerService) { }
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  ngAfterViewInit() {
    this.playerService.getPlayers.subscribe((players)=>{
      this.dataSource= new MatTableDataSource(Object.values(players));
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
    });
    
  }
  ngOnInit(): void {
  }

}
