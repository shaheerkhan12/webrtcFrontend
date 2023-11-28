import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BroadcasterComponent } from './broadcaster.component';

describe('BroadcasterComponent', () => {
  let component: BroadcasterComponent;
  let fixture: ComponentFixture<BroadcasterComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BroadcasterComponent]
    });
    fixture = TestBed.createComponent(BroadcasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
