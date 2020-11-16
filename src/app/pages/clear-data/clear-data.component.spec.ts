import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClearDataComponent } from './clear-data.component';

describe('ClearDataComponent', () => {
  let component: ClearDataComponent;
  let fixture: ComponentFixture<ClearDataComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClearDataComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClearDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
