/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { MarkCompleteIconComponent } from './mark-complete-icon.component';

describe('MarkCompleteIconComponent', () => {
  let component: MarkCompleteIconComponent;
  let fixture: ComponentFixture<MarkCompleteIconComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MarkCompleteIconComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MarkCompleteIconComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
