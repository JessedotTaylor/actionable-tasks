import { Component, Inject, OnInit } from '@angular/core';
import { NonNullableFormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
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
    _id: this.fb.control<string | undefined>(undefined),
    title: this.fb.control('', Validators.required),
    description: '',
    comments: this.fb.array<string>([]),
    group: this.fb.control('', Validators.required),
    tasks: this.fb.array([]),
    createdAt: new Date()
  });

  selfIndex: number = 99;
  dataLength: number | undefined;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: ITask | undefined,
    private dialogRef: MatDialogRef<TaskEditDialogComponent>,
    private fb: NonNullableFormBuilder,
    private taskService: TaskService,
    private router: Router
  ) { }

  ngOnInit() {
    if (this.data) {
      this.generateForm(this.data);
      this.selfIndex = this.getSelfIndex();
    }
  }

  generateForm(task: ITask) {
    this.taskForm.patchValue({
      _id: task._id, 
      title: task.title,
      description: task.description,
      comments: task.comments,
      group: task.group,
      createdAt: task.createdAt,
      tasks: task.tasks
    });
  }

  submit() {
    let changes: Partial<ITask> = {};
    if (this.data) {
      changes = getDirtyValues(this.taskForm);
    } else {
      changes = this.taskForm.value;
    }

    const id = this.taskForm.get('_id')?.value;
    let action: string;
    if (id) {
      action = 'update'
    } else {
      action = 'create'
    }
    

    this.dialogRef.close({action, id, changes});
  }

  delete() {
    this.dialogRef.close({action: 'delete', id: this.taskForm.get('_id')?.value});
  }

  getSelfIndex(): number {
    let data = this.taskService.data;
    this.dataLength = data.length - 1;
    let foundIndex = data.findIndex(t => t._id == this.data?._id);
    return foundIndex;
  }
 
  onDirClick(direction: 'back' | 'for') {
    let index = this.selfIndex;
    if (direction == 'back') {
      index--;
    } else if (direction == 'for') {
      index++;
    } 
    let data = this.taskService.data;

    let nextTask = data[index];
    this.router.navigate([`../${nextTask._id}`]);
  }

}
