import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowParticipantsDialogComponent } from './show-participants-dialog.component';

describe('ShowParticipantsDialogComponent', () => {
  let component: ShowParticipantsDialogComponent;
  let fixture: ComponentFixture<ShowParticipantsDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShowParticipantsDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowParticipantsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
