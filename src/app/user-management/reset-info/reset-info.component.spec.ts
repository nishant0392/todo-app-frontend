import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResetInfoComponent } from './reset-info.component';

describe('ResetInfoComponent', () => {
  let component: ResetInfoComponent;
  let fixture: ComponentFixture<ResetInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ResetInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResetInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
