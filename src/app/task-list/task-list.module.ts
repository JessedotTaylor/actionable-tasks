import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaskListRoutingModule } from './task-list-routing.module';
import { SharedModule } from '../shared/shared.module';
import { TaskListComponent } from './task-list.component';
import { TaskEditDialogComponent } from './task-edit-dialog/task-edit-dialog.component';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import {MatDatepickerModule} from '@angular/material/datepicker';
import { NextStepEditComponent } from './task-edit-dialog/next-step-edit/next-step-edit.component';
import {MatExpansionModule} from '@angular/material/expansion';



@NgModule({
  declarations: [
    TaskListComponent,
    TaskEditDialogComponent,
    NextStepEditComponent,
  ],
  imports: [
    CommonModule,
    TaskListRoutingModule,
    SharedModule,
    MatAutocompleteModule,
    MatDatepickerModule,
    MatExpansionModule
  ]
})
export class TaskListModule { }
