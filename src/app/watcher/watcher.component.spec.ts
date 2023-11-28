import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WatcherComponent } from './watcher.component';

describe('WatcherComponent', () => {
  let component: WatcherComponent;
  let fixture: ComponentFixture<WatcherComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [WatcherComponent]
    });
    fixture = TestBed.createComponent(WatcherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
