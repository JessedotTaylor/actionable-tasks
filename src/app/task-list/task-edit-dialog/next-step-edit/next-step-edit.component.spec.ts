/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { NextStepEditComponent } from './next-step-edit.component';

describe('NextStepEditComponent', () => {
  let component: NextStepEditComponent;
  let fixture: ComponentFixture<NextStepEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NextStepEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NextStepEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
