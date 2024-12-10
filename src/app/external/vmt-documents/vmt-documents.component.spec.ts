import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VmtDocumentsComponent } from './vmt-documents.component';

describe('VmtDocumentsComponent', () => {
  let component: VmtDocumentsComponent;
  let fixture: ComponentFixture<VmtDocumentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VmtDocumentsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VmtDocumentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
