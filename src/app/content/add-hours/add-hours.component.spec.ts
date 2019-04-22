import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddHoursComponent } from './add-hours.component';

describe('AddHoursComponent', () => {
  let component: AddHoursComponent;
  let fixture: ComponentFixture<AddHoursComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddHoursComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddHoursComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
