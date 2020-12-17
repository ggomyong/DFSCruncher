import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NbaLandingComponent } from './nba-landing.component';

describe('NbaLandingComponent', () => {
  let component: NbaLandingComponent;
  let fixture: ComponentFixture<NbaLandingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NbaLandingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NbaLandingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
