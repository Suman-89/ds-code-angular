import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TaguserComponent } from './taguser.component';

describe('TaguserComponent', () => {
  let component: TaguserComponent;
  let fixture: ComponentFixture<TaguserComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TaguserComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TaguserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
