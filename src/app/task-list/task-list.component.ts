import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ITask } from '../interfaces/ITask';
import { TaskService } from '../task.service';

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.sass']
})
export class TaskListComponent implements OnInit {
  taskGroups: {[key: string]: ITask[]} = {};
  taskKeys: string[] = [];

  levels: string[] = [];
  levelFilter: string | undefined;

  routeSubscription: Subscription | undefined;

  loading = false;
  
  constructor(
    private taskService: TaskService,
    private router: Router,
    private route: ActivatedRoute
  ) {
  }

  ngOnInit(): void {
    this.levels = this.taskService.levels;

    this.route.paramMap.subscribe(params => {
      this.loading = true;
      this.levelFilter = params.get('level')?.toLowerCase();
      this.taskService.get().subscribe(tasks => {
        let filteredTasks = this.filterTasks(tasks);
        let groupedTasks = this.groupTasks(filteredTasks);
        this.taskGroups = groupedTasks;
        this.taskKeys = Object.keys(groupedTasks);
        this.loading = false;
      })
  
    })
  }
  
  filterTasks(tasks: ITask[]): ITask[] {
    if (this.levelFilter && this.levelFilter != 'main') {
      return tasks.filter(task => task.level.toLowerCase() == this.levelFilter);
    } else {
      return tasks;
    }
  }

  groupTasks(tasks: ITask[]): {[key: string]: ITask[]} {
    let res:{[key: string]: ITask[]} = {};
    tasks.forEach(task => {
      if (res[task.group]) {
        res[task.group].push(task)
      } else {
        res[task.group] = [task]
      }
    });
    return res;
  }

  onAdd(groupKey?: string) {
    this.router.navigate(['new'], {relativeTo: this.route, queryParams: {group: groupKey}});
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

  onComplete(task: ITask, state: boolean) {
    this.taskService.update(task._id, {resolved: state});
  }
}
