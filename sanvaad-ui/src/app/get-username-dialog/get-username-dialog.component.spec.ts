import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GetUsernameDialogComponent } from './get-username-dialog.component';

describe('GetUsernameDialogComponent', () => {
  let component: GetUsernameDialogComponent;
  let fixture: ComponentFixture<GetUsernameDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GetUsernameDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GetUsernameDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
