import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaskListRoutingModule } from './task-list-routing.module';
import { SharedModule } from '../shared/shared.module';
import { TaskListComponent } from './task-list.component';
import { TaskEditDialogComponent } from './task-edit-dialog/task-edit-dialog.component';



@NgModule({
  declarations: [
    TaskListComponent,
    TaskEditDialogComponent
  ],
  imports: [
    CommonModule,
    TaskListRoutingModule,
    SharedModule
  ]
})
export class TaskListModule { }
