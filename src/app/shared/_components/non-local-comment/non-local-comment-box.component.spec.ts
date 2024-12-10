import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NonLocalCommentBoxComponent } from './non-local-comment-box.component';

describe('NonLocalCommentBoxComponent', () => {
  let component: NonLocalCommentBoxComponent;
  let fixture: ComponentFixture<NonLocalCommentBoxComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NonLocalCommentBoxComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NonLocalCommentBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
