import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { map, Observable, Subscription } from 'rxjs';
import { ITask } from '../interfaces/ITask';
import { TaskService } from '../task.service';

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.sass']
})
export class TaskListComponent implements OnInit {
  tasks$!: Observable<ITask[]>;

  levels: string[] = [];
  levelFilter: string | undefined;

  routeSubscription: Subscription | undefined;
  
  constructor(
    private taskService: TaskService,
    private router: Router,
    private route: ActivatedRoute
  ) {
  }

  ngOnInit(): void {
    this.levels = this.taskService.levels;

    this.route.paramMap.subscribe(params => {
      this.levelFilter = params.get('level')?.toLowerCase();
      this.tasks$ = this.taskService.get()
      .pipe(
        map(tasks => {
          if (this.levelFilter && this.levelFilter != 'main') {
            let filter =  tasks.filter(task => task.level.toLowerCase() == this.levelFilter);
            return filter;
          } else {
            return tasks;
          }
        })
      );
  
    })
  }

  onAddClick() {
    this.router.navigate(['new'], {relativeTo: this.route});
  }

  onCardClick(task: ITask) {
    this.router.navigate([`${task._id}`], {relativeTo: this.route});
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
