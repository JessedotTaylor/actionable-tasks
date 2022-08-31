import { Component, OnInit, ViewChild } from '@angular/core';
import { NonNullableFormBuilder } from '@angular/forms';
import { MatAccordion } from '@angular/material/expansion';
import { ActivatedRoute, Router } from '@angular/router';
import { debounceTime, distinctUntilChanged, Observable, Subscription } from 'rxjs';
import { ITask } from '../interfaces/ITask';
import { TaskService } from '../task.service';

enum TaskStates {
  PENDING = 'pending', // Waiting on task to complete / expire
  NEEDS_ACTION = 'needs action', // Requires action
  COMPLETE = 'complete' // completed
}

interface IFilterOptions {
  search: string;
  state: string[];
  level: string[];
}

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.sass']
})
export class TaskListComponent implements OnInit {
  @ViewChild(MatAccordion) accordion!: MatAccordion;

  taskGroups: {[key: string]: ITask[]} = {};
  taskKeys: string[] = [];

  levels$!: Observable<string[]>;
  levelFilter: string | undefined;

  routeSubscription: Subscription | undefined;

  loading = false;

  filters = this.fb.group({
    level: '',
    state: '',
    search: ''
  });

  taskStateKeys = Object.values(TaskStates);
  
  constructor(
    private taskService: TaskService,
    private router: Router,
    private route: ActivatedRoute,
    private fb: NonNullableFormBuilder
  ) {
  }

  ngOnInit(): void {
    this.levels$ = this.taskService.getLevels();
    this.loadTaskObject({});

    this.filters.get('search')?.valueChanges
    .pipe(
      distinctUntilChanged(),
      debounceTime(150)
    )
    .subscribe(changes => {
      this.loadTaskObject({search: changes});
    });
    this.filters.get('state')?.valueChanges.subscribe((changes: string | string[]) => {
      this.loadTaskObject({state: Array.isArray(changes) ? changes : [changes]});
    })
    this.filters.get('level')?.valueChanges.subscribe((changes: string | string[]) => {
      let changesArr = Array.isArray(changes) ? changes : [changes];
      changesArr = changesArr.map(v => v.toLowerCase())
      this.loadTaskObject({level: changesArr});
    })
  }

  loadTaskObject({search = '', level = [], state = []}:Partial<IFilterOptions>) {
    this.loading = true;
    this.taskService.get().subscribe(tasks => {
      let filteredTasks = this.filterTasks(tasks, {search, level, state});
      let groupedTasks = this.groupTasks(filteredTasks);
      this.taskGroups = groupedTasks;
      this.taskKeys = Object.keys(groupedTasks);
      this.loading = false;
    })
  }
  
  filterTasks(tasks: ITask[], filterOptions: IFilterOptions): ITask[] {
    let filteredTasks = this.calculateTasksState(tasks);

    if (filterOptions.state.length) {
      filteredTasks = filteredTasks.filter(task => filterOptions.state.includes(task.state));
    }
    if (filterOptions.search) {
      filteredTasks = filteredTasks.filter(task => task.title.toLowerCase().includes(filterOptions.search))
    }
    if (filterOptions.level.length) {
      filteredTasks = filteredTasks.filter(task => filterOptions.level.includes(task.level.toLowerCase()))
    }
    return filteredTasks;
  }

  calculateTasksState(tasks: ITask[]): (ITask & {state: TaskStates})[] {
    return tasks.map(task => {
      let state: TaskStates = TaskStates.NEEDS_ACTION;
      if (task.resolved) {
        state = TaskStates.COMPLETE;
      } else {
        // if (task.)
      }
      return {
        ...task,
        state
      }
    })
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
