import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VmtCommentsComponent } from './vmt-comments.component';

describe('VmtCommentsComponent', () => {
  let component: VmtCommentsComponent;
  let fixture: ComponentFixture<VmtCommentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VmtCommentsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VmtCommentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
