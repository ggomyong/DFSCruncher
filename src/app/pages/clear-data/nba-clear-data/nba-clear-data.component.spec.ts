import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NbaClearDataComponent } from './nba-clear-data.component';

describe('NbaClearDataComponent', () => {
  let component: NbaClearDataComponent;
  let fixture: ComponentFixture<NbaClearDataComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NbaClearDataComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NbaClearDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
