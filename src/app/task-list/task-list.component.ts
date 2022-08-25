import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { ITask } from '../interfaces/ITask';
import { TaskService } from '../task.service';

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.sass']
})
export class TaskListComponent implements OnInit {
  tasks$!: Observable<ITask[]>;


  routeSubscription: Subscription | undefined;
  
  constructor(
    private taskService: TaskService,
    private router: Router,
  ) {

  }

  ngOnInit(): void {
    this.tasks$ = this.taskService.dataSubject.asObservable();
    
  }

  onAddClick() {
    this.router.navigate(['/new']);
  }

  onCardClick(task: ITask) {
    this.router.navigate([`/${task._id}`]);
  }

  getComment(task: ITask): string {
    const END_SLICE = 3;
    let endString = '';
    if (task.comments.length > END_SLICE) {
      endString = `+ ${task.comments.length - END_SLICE} more comments`
    }
    return task.comments.slice(0, END_SLICE).join(' - ') + endString;
  }
}
