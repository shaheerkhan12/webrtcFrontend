import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WatcherComponent } from './watcher/watcher.component';
import { BroadcasterComponent } from './broadcaster/broadcaster.component';

const routes: Routes = [
  {path:'watcher',component:WatcherComponent},
  {path:'broadcaster',component:BroadcasterComponent},

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
