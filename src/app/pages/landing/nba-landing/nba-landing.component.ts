import { AfterViewInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatIconRegistry } from '@angular/material/icon';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { DomSanitizer } from '@angular/platform-browser';
import { Subscription } from 'rxjs';
import { Player } from 'src/app/player.class';
import { ColumnService } from 'src/app/services/column.service';
import { PlayerService } from 'src/app/services/player.service';
import { NbaClearDataComponent } from '../../clear-data/nba-clear-data/nba-clear-data.component';

@Component({
  selector: 'app-nba-landing',
  templateUrl: './nba-landing.component.html',
  styleUrls: ['./nba-landing.component.css']
})
export class NbaLandingComponent implements AfterViewInit,OnDestroy {
  nba_stars=[
    {  }
  ];

  columns = [];
  displayedColumns: string[] = [];
  dataSource = new MatTableDataSource([]);
  position = 'C';
  columnSubscription:Subscription;

  @ViewChild(MatTable) matTable:  MatTable<any>;
  
  constructor(private cdref: ChangeDetectorRef, private playerService:PlayerService, private columnService:ColumnService,public dialog: MatDialog,private matIconRegistry: MatIconRegistry,private domSanitizer: DomSanitizer) {
    this.matIconRegistry.addSvgIcon(
      `calculator`,
      this.domSanitizer.bypassSecurityTrustResourceUrl(`../../../assets/images/calculator-solid.svg`)
    );
   }
  ngOnDestroy(): void {
    this.columnSubscription.unsubscribe();
  }

   ngAfterContentChecked() {
    this.cdref.detectChanges();
  }
  
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  
  ngAfterContentInit() {
    this.switchView();
  }
  ngAfterViewInit(): void {
    this.playerService.init();

    this.playerService.initPlayerMap().subscribe(data=>{
      this.playerService.setMap(data);

      this.playerService.getPlayerByKey('nba.C').subscribe(players=>{
        this.dataSource= new MatTableDataSource(Object.values(players));
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
      });
    })

    this.columnService.initColumnMap().subscribe(data =>{
      this.columnService.setMap(data);
      
      this.columnSubscription=this.columnService.getColumnByKey('nba.C').subscribe(columns=>{
        this.displayedColumns=[];
        this.columns=Object.values(columns);
        this.displayedColumns = this.columns.map(c=>c.internal);
        this.displayedColumns.push('delete');
      });
      window.setTimeout(()=>this.switchView(), 1000);
    })
  }

  recalculateStar() {
    this.playerService.recalculateStar();
  }
  removePlayer(player:Player) {
    this.playerService.removePlayer(player);
  }
  switchView() {
    this.playerService.getPlayerByKey('nba.'+this.position).subscribe(players=>{
      this.dataSource= new MatTableDataSource(Object.values(players));
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
    });
    this.columnService.getColumnByKey('nba.'+this.position).subscribe(columns=>{
      this.displayedColumns=[];
      this.columns=Object.values(columns);
      this.displayedColumns = this.columns.map(c=>c.internal);
      this.displayedColumns.push('delete');
    });
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(NbaClearDataComponent, {
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {
      //console.log('The dialog was closed');
    });
  }
}
