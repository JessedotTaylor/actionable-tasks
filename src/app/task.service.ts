import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { TASKS } from './data/TASKS';
import { ITask } from './interfaces/ITask';
@Injectable({
  providedIn: 'root'
})
export class TaskService {
  dataSubject = new BehaviorSubject(TASKS);

  get data(): ITask[] {
    return this.dataSubject.value;
  }

  getTaskById(id?: string): ITask | undefined {
    if (id) {
      return this.data.find(t => t._id == id)
    } 
    return;
  }

  removeTask(id: string) {
    let data = this.data.filter(t => t._id != id);
    this.dataSubject.next(data);
  }

  saveTask(update: Partial<ITask>) {
    let data = this.data;
    let index = data.findIndex(t => t._id == update._id);
    if (index >= 0) {
      data[index] = {
        ...data[index],
        ...update
      }
    } else {
      data.push(update as ITask)
    }
  }

  generateId(): string {
    return Math.round(Math.random() * 100).toFixed(0)
  }
}
