import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LandingComponent } from './pages/landing/landing.component';
import { StarConfigComponent } from './pages/star-config/star-config.component';


const routes: Routes = [
  {path: '', component: LandingComponent},
  {path: 'star-config', component: StarConfigComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
