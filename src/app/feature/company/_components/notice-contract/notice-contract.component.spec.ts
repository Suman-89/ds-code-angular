import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NoticeContractComponent } from './notice-contract.component';

describe('NoticeContractComponent', () => {
  let component: NoticeContractComponent;
  let fixture: ComponentFixture<NoticeContractComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NoticeContractComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NoticeContractComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
