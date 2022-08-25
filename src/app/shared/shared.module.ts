import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from './material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

const components = [
  MaterialModule,
  ReactiveFormsModule,
  FormsModule
]

@NgModule({
  declarations: [
  ],
  imports: [
    CommonModule,
    ...components
  ],
  exports: components
})
export class SharedModule { }
