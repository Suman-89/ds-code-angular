import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FullCommentBoxModalComponent } from './full-comment-box-modal.component';

describe('FullCommentBoxModalComponent', () => {
  let component: FullCommentBoxModalComponent;
  let fixture: ComponentFixture<FullCommentBoxModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FullCommentBoxModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FullCommentBoxModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
