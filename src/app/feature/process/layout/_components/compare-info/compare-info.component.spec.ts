import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CompareInfoComponent } from './compare-info.component';

describe('CompareInfoComponent', () => {
  let component: CompareInfoComponent;
  let fixture: ComponentFixture<CompareInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompareInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompareInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
