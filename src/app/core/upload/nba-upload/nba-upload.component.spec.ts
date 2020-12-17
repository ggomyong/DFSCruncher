import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NbaUploadComponent } from './nba-upload.component';

describe('NbaUploadComponent', () => {
  let component: NbaUploadComponent;
  let fixture: ComponentFixture<NbaUploadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NbaUploadComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NbaUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
