import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { Player } from '../../player.class';
import { PlayerService } from 'src/app/services/player.service';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { ColumnService } from 'src/app/services/column.service';
import { FormControl } from '@angular/forms';
import { ClearDataComponent, DialogData } from 'src/app/pages/clear-data/clear-data.component';
import { MatDialog } from '@angular/material/dialog';
import { DomSanitizer } from '@angular/platform-browser';
import { MatIconRegistry } from '@angular/material/icon';


@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.css']
})
export class LandingComponent implements OnInit, AfterViewInit  {
  columns = [];
  displayedColumns: string[] = [];
  dataSource = new MatTableDataSource([]);
  position = 'qb';

  constructor(private playerService:PlayerService, private columnService:ColumnService,public dialog: MatDialog,private matIconRegistry: MatIconRegistry,private domSanitizer: DomSanitizer) {
    this.matIconRegistry.addSvgIcon(
      `calculator`,
      this.domSanitizer.bypassSecurityTrustResourceUrl(`../../../assets/images/calculator-solid.svg`)
    );
   }
  
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  
  ngAfterViewInit() {
    this.switchView();
  }
  ngOnInit(): void {
    this.columnService.getQb.subscribe((columns)=>{
      this.displayedColumns=[];
      this.columns=Object.values(columns);
      this.displayedColumns = this.columns.map(c=>c.internal);
      this.displayedColumns.push('delete');
    });
    this.playerService.init();
    this.columnService.init();
  }

  recalculateStar() {
    this.playerService.recalculateStar();
  }
  removePlayer(player:Player) {
    this.playerService.removePlayer(player);
  }
  switchView() {
    switch (this.position) {
      case 'qb':
        this.playerService.getQb.subscribe((players)=>{
          this.dataSource= new MatTableDataSource(Object.values(players));
          this.dataSource.sort = this.sort;
          this.dataSource.paginator = this.paginator;
        });
        this.columnService.getQb.subscribe((columns)=>{
          this.displayedColumns=[];
          this.columns=Object.values(columns);
          this.displayedColumns = this.columns.map(c=>c.internal);
          this.displayedColumns.push('delete');
        });
        break;
      case 'rb':
        this.playerService.getRb.subscribe((players)=>{
          this.dataSource= new MatTableDataSource(Object.values(players));
          this.dataSource.sort = this.sort;
          this.dataSource.paginator = this.paginator;
        });
        this.columnService.getRb.subscribe((columns)=>{
          this.displayedColumns=[];
          this.columns=Object.values(columns);
          this.displayedColumns = this.columns.map(c=>c.internal);
          this.displayedColumns.push('delete');
        });
        break;
      case 'rb2':
        this.playerService.getRb2.subscribe((players)=>{
          this.dataSource= new MatTableDataSource(Object.values(players));
          this.dataSource.sort = this.sort;
          this.dataSource.paginator = this.paginator;
        });
        this.columnService.getRb2.subscribe((columns)=>{
          this.displayedColumns=[];
          this.columns=Object.values(columns);
          this.displayedColumns = this.columns.map(c=>c.internal);
          this.displayedColumns.push('delete');
        });
        break;
      case 'wr':
        this.playerService.getWr.subscribe((players)=>{
          this.dataSource= new MatTableDataSource(Object.values(players));
          this.dataSource.sort = this.sort;
          this.dataSource.paginator = this.paginator;
        });
        this.columnService.getWr.subscribe((columns)=>{
          this.displayedColumns=[];
          this.columns=Object.values(columns);
          this.displayedColumns = this.columns.map(c=>c.internal);
          this.displayedColumns.push('delete');
        });
        break;
      case 'wr2':
        this.playerService.getWr2.subscribe((players)=>{
          this.dataSource= new MatTableDataSource(Object.values(players));
          this.dataSource.sort = this.sort;
          this.dataSource.paginator = this.paginator;
        });
        this.columnService.getWr2.subscribe((columns)=>{
          this.displayedColumns=[];
          this.columns=Object.values(columns);
          this.displayedColumns = this.columns.map(c=>c.internal);
          this.displayedColumns.push('delete');
        });
        break;
      case 'te':
        this.playerService.getTe.subscribe((players)=>{
          this.dataSource= new MatTableDataSource(Object.values(players));
          this.dataSource.sort = this.sort;
          this.dataSource.paginator = this.paginator;
        });
        this.columnService.getTe.subscribe((columns)=>{
          this.displayedColumns=[];
          this.columns=Object.values(columns);
          this.displayedColumns = this.columns.map(c=>c.internal);
          this.displayedColumns.push('delete');
        });
        break;
        case 'def':
          this.playerService.getDef.subscribe((players)=>{
            this.dataSource= new MatTableDataSource(Object.values(players));
            this.dataSource.sort = this.sort;
            this.dataSource.paginator = this.paginator;
          });
          this.columnService.getDef.subscribe((columns)=>{
            this.displayedColumns=[];
            this.columns=Object.values(columns);
            this.displayedColumns = this.columns.map(c=>c.internal);
            this.displayedColumns.push('delete');
          });
          break;
      default:
        break;
    }
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(ClearDataComponent, {
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {
      //console.log('The dialog was closed');
    });
  }

}
