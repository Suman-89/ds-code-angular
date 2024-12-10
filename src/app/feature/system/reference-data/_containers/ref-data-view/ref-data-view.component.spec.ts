import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RefDataViewComponent } from './ref-data-view.component';

describe('RefDataViewComponent', () => {
  let component: RefDataViewComponent;
  let fixture: ComponentFixture<RefDataViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RefDataViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RefDataViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
