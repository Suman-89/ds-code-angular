import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VmtDisplayCommentComponent } from './vmt-display-comment.component';

describe('VmtDisplayCommentComponent', () => {
  let component: VmtDisplayCommentComponent;
  let fixture: ComponentFixture<VmtDisplayCommentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VmtDisplayCommentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VmtDisplayCommentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
