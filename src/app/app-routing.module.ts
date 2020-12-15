import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ColumnConfigComponent } from './pages/column-config/column-config.component';
import { NbaColumnConfigComponent } from './pages/column-config/nba-column-config/nba-column-config.component';
import { LandingComponent } from './pages/landing/landing.component';
import { NbaLandingComponent } from './pages/landing/nba-landing/nba-landing.component';
import { NbaStarConfigComponent } from './pages/star-config/nba-star-config/nba-star-config.component';
import { StarConfigComponent } from './pages/star-config/star-config.component';


const routes: Routes = [
  {path: '', component: LandingComponent},
  {path: 'star-config', component: StarConfigComponent},
  {path: 'column-config', component: ColumnConfigComponent},

  {path: 'nba-landing', component: NbaLandingComponent},
  {path: 'nba-star-config', component: NbaStarConfigComponent},
  {path: 'nba-column-config', component: NbaColumnConfigComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
