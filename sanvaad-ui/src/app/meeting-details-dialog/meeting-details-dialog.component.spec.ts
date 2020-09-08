import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MeetingDetailsDialogComponent } from './meeting-details-dialog.component';

describe('MeetingDetailsDialogComponent', () => {
  let component: MeetingDetailsDialogComponent;
  let fixture: ComponentFixture<MeetingDetailsDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MeetingDetailsDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MeetingDetailsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
