import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from './material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MarkCompleteComponent } from './mark-complete/mark-complete.component';
import { MarkCompleteIconComponent } from './mark-complete-icon/mark-complete-icon.component';

const components = [
  MarkCompleteComponent,
  MarkCompleteIconComponent
];

const modules = [
  MaterialModule,
  ReactiveFormsModule,
  FormsModule,
  
]

@NgModule({
  declarations: components,
  imports: [
    CommonModule,
    ...modules
  ],
  exports: [
    ...modules,
    ...components
  ]
})
export class SharedModule { }
