import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NbaColumnConfigComponent } from './nba-column-config.component';

describe('NbaColumnConfigComponent', () => {
  let component: NbaColumnConfigComponent;
  let fixture: ComponentFixture<NbaColumnConfigComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NbaColumnConfigComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NbaColumnConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
