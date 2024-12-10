import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FullNonLocalCommentBoxModalComponent } from './full-non-local-comment-box-modal.component';

describe('FullCommentBoxModalComponent', () => {
  let component: FullNonLocalCommentBoxModalComponent;
  let fixture: ComponentFixture<FullNonLocalCommentBoxModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FullNonLocalCommentBoxModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FullNonLocalCommentBoxModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
