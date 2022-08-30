import { Component, Inject, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, NonNullableFormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { INextStep, ITask } from 'src/app/interfaces/ITask';
import { TaskService } from 'src/app/task.service';
import { getDirtyValues } from 'src/app/utils/Form';
import { NextStepService } from '../next-step.service';

export interface INextStepForm {
  _id: FormControl<string | undefined>;
  comment: FormControl<string>;
  date: FormControl<Date>;
  owner: FormControl<string>;
  complete: FormControl<boolean>;
}

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
    nextSteps: this.fb.array<FormGroup<INextStepForm>>([]),
    createdAt: new Date(),
    level: this.fb.control('', Validators.required)
  });

  selfIndex: number = 99;
  dataLength: number | undefined;

  levels: string[] = [];

  nextSteps$: Observable<INextStep[]> | undefined; 

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: {task: ITask | undefined, group: string | undefined},
    private dialogRef: MatDialogRef<TaskEditDialogComponent>,
    private fb: NonNullableFormBuilder,
    private taskService: TaskService,
    private router: Router,
    private nextStepService: NextStepService
  ) { }

  ngOnInit() {
    if (this.data.task) {
      this.generateForm(this.data.task);
      this.selfIndex = this.getSelfIndex();
    } else if (this.data.group) {
      this.taskForm.patchValue({
        'group': this.data.group
      })
    }
    this.levels = this.taskService.levels;
  }

  generateNextStepArray(taskId: string) {
    this.nextStepService.get(taskId).subscribe(tasks => {
      // Sort tasks: not completed, then by date
      tasks = tasks.sort((a, b) => {
        if (a.completed == b.completed) {
          return a.date.seconds - b.date.seconds
        }
        return a.completed ? 1 : -1;
      });
      let tasksArray = this.fb.array(tasks.map(nextStep => {
        return this.generateNextStepForm(nextStep);
      }));
      this.taskForm.setControl('nextSteps', tasksArray);
    })
  }

  generateNextStepForm(nextStep?: INextStep) {
    return this.fb.group({
      _id: this.fb.control<string | undefined>(nextStep?._id),
      comment: this.fb.control(nextStep?.comment || '', Validators.required),
      owner: this.fb.control(nextStep?.owner || '', Validators.required),
      date: this.fb.control(nextStep ? nextStep.date.toDate() : new Date(), Validators.required),
      complete: this.fb.control(nextStep?.completed || false)
    })  
  }

  generateForm(task: ITask) {
    this.generateNextStepArray(task._id);
    this.taskForm.patchValue({
      _id: task._id, 
      title: task.title,
      description: task.description,
      comments: task.comments,
      group: task.group,
      createdAt: new Date(task.createdAt.seconds * 1000),
      level: task.level
    });
  }

  submit() {
    let changes: Partial<ITask> = {};
    if (this.data) {
      changes = getDirtyValues(this.taskForm);
    } else {
      changes = this.taskForm.value as Partial<ITask>;
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
    let foundIndex = data.findIndex(t => t._id == this.data.task?._id);
    return foundIndex;
  }
 
  onDir(direction: 'back' | 'for') {
    let index = this.selfIndex;
    if (direction == 'back') {
      index--;
    } else if (direction == 'for') {
      index++;
    } 
    let data = this.taskService.data;

    this.dialogRef.close({action: 'next', id: data[index]._id});
  }

  get tasks(): FormArray {
    return this.taskForm.get('nextSteps') as FormArray;
  }

  getNextStepForm(i: number): FormGroup {
    return this.tasks.at(i) as FormGroup;
  }

  onAddTaskClick() {
    this.tasks.push(this.generateNextStepForm())
  }

  onComplete(state: boolean) {
    const id = this.data.task!._id;
    this.taskService.update(id, {resolved: state});
  }

}
