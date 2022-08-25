import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TaskEditDialogEntryComponent } from './task-edit-dialog/task-edit-dialog-entry.component';
import { TaskListComponent } from './task-list.component';

const routes: Routes = [
    {
        path: '',
        component: TaskListComponent,
        children: [
            {
                path: ':taskId',
                component: TaskEditDialogEntryComponent
            }
        ]
    }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TaskListRoutingModule { }
