import { Component, Inject, OnInit } from '@angular/core';
import { NonNullableFormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ITask } from 'src/app/interfaces/ITask';
import { TaskService } from 'src/app/task.service';
import { getDirtyValues } from 'src/app/utils/Form';

@Component({
  selector: 'app-task-edit-dialog',
  templateUrl: './task-edit-dialog.component.html',
  styleUrls: ['./task-edit-dialog.component.sass']
})
export class TaskEditDialogComponent implements OnInit {
  taskForm = this.fb.group({
    _id: this.fb.control(this.taskService.generateId(), Validators.required),
    title: this.fb.control('', Validators.required),
    comments: this.fb.array<string>([]),
    group: this.fb.control('', Validators.required),
    tasks: this.fb.array([]),
    createdAt: new Date()
  });


  constructor(
    @Inject(MAT_DIALOG_DATA) public data: ITask | undefined,
    private dialogRef: MatDialogRef<TaskEditDialogComponent>,
    private taskService: TaskService,
    private fb: NonNullableFormBuilder
  ) { }

  ngOnInit() {
    if (this.data) {
      this.generateForm(this.data)
    }
  }

  generateForm(task: ITask) {
    this.taskForm.patchValue({
      _id: task._id, 
      title: task.title,
      comments: task.comments,
      group: task.group,
      createdAt: task.createdAt,
      tasks: task.tasks
    });
  }

  exit() {

  }

  submit() {
    let changes: Partial<ITask> = {};
    if (this.data) {
      changes = getDirtyValues(this.taskForm);
    } else {
      changes = this.taskForm.value;
    }
    

    this.dialogRef.close({action: 'save', data: {_id: this.taskForm.get('_id'), ...changes}});
  }

  delete() {
    let formValue = this.taskForm.value;

    this.dialogRef.close({action: 'delete', data: formValue});
  }

}
