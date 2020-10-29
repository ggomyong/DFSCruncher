import { Component, OnInit } from '@angular/core';
import { Star, StarService } from 'src/app/services/star.service';

@Component({
  selector: 'app-star-config',
  templateUrl: './star-config.component.html',
  styleUrls: ['./star-config.component.css']
})
export class StarConfigComponent implements OnInit {
  stars:Star[] = [];
  displayedColumns:any= [
    'Qualifier', 'Operator', 'Value'
  ];
  constructor(private starService:StarService) { }

  ngOnInit(): void {
    this.stars = this.starService.stars;
    console.log(this.stars);
  }

}
