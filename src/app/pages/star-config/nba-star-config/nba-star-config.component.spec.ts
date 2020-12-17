import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NbaStarConfigComponent } from './nba-star-config.component';

describe('NbaStarConfigComponent', () => {
  let component: NbaStarConfigComponent;
  let fixture: ComponentFixture<NbaStarConfigComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NbaStarConfigComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NbaStarConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
