import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { WatcherComponent } from './watcher/watcher.component';
import { BroadcasterComponent } from './broadcaster/broadcaster.component';

@NgModule({
  declarations: [
    AppComponent,
    WatcherComponent,
    BroadcasterComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
