import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QualifierSelectComponent } from './qualifier-select.component';

describe('QualifierSelectComponent', () => {
  let component: QualifierSelectComponent;
  let fixture: ComponentFixture<QualifierSelectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QualifierSelectComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QualifierSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
