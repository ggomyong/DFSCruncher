import { Component, OnInit } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  constructor(private matIconRegistry: MatIconRegistry,private domSanitizer: DomSanitizer) { 
    this.matIconRegistry.addSvgIcon(
      `football`,
      this.domSanitizer.bypassSecurityTrustResourceUrl(`../../../assets/images/football-ball-solid.svg`)
    );

    this.matIconRegistry.addSvgIcon(
      `basketball`,
      this.domSanitizer.bypassSecurityTrustResourceUrl(`../../../assets/images/basketball-ball-solid.svg`)
    );
  }

  

  ngOnInit(): void {
  }

}
