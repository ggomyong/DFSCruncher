import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StarConfigComponent } from './star-config.component';

describe('StarConfigComponent', () => {
  let component: StarConfigComponent;
  let fixture: ComponentFixture<StarConfigComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StarConfigComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StarConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
