import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { Player } from '../../player.class';
import { PlayerService } from 'src/app/services/player.service';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { ColumnService } from 'src/app/services/column.service';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.css']
})
export class LandingComponent implements OnInit, AfterViewInit  {
  columns = [];
  displayedColumns: string[] = [];
  dataSource = new MatTableDataSource([]);

  constructor(private playerService:PlayerService, private columnService:ColumnService) { }
  
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
    this.columnService.getColumns.subscribe(columns => {
      this.columns = Object.values(columns);
      this.displayedColumns = this.columns.map(c=>c.internal);
      this.displayedColumns.push('delete');
    });
  }

}
