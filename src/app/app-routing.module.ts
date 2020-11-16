import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ColumnConfigComponent } from './pages/column-config/column-config.component';
import { LandingComponent } from './pages/landing/landing.component';
import { StarConfigComponent } from './pages/star-config/star-config.component';


const routes: Routes = [
  {path: '', component: LandingComponent},
  {path: 'star-config', component: StarConfigComponent},
  {path: 'column-config', component: ColumnConfigComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
