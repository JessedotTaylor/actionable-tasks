import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { BehaviorSubject, map, Observable, Subscription } from 'rxjs';
import { ITask } from './interfaces/ITask';
import { getNewObservable } from './utils/Observable';
@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private dataSubscription: Observable<ITask[]>;
  private dataSubject: BehaviorSubject<ITask[]> = new BehaviorSubject<ITask[]>([]);

  private levelsSubject: BehaviorSubject<string[]> = new BehaviorSubject<string[]>([]);

  constructor(
    private db: AngularFirestore
  ) {
    this.dataSubscription = this.db.collection<ITask>('tasks').valueChanges({idField: '_id'});
    this.dataSubscription.subscribe(changes => {
      this.dataSubject.next(changes);
    });
    this.dataSubject.subscribe(changes => {
      let levels = new Set(changes.map(c => c.level).filter(s => !!s));
      this.levelsSubject.next(Array.from(levels));
    });

  }

  get data(): ITask[] {
    return this.dataSubject.value;
  }
  get levels(): string[] {
    return this.levelsSubject.value;
  }

  get(skipCache: boolean = false):Observable<ITask[]> {
    if (!skipCache && this.data.length) {
      return this.dataSubject.asObservable();
    }
    return this.db.collection<ITask>('tasks').valueChanges({idField: '_id'}).pipe(
      map(res => {
        this.dataSubject.next(res);
        return res;
      })
    );
  }

  getById(id: string, skipCache: boolean = false): Observable<ITask | undefined> {
    if (!skipCache && this.data.length) {
      let task = this.data.find(t => t._id == id);
      if (task) {
        return getNewObservable(task);
      }
    }
    return this.db.collection<ITask>('tasks').doc(id).valueChanges({idField: '_id'});
  }

  remove(id: string) {
    return this.db.collection('tasks').doc(id).delete();
  }

  update(id: string, data: Partial<ITask>) {
    return this.db.collection('tasks').doc(id).update(data);
  }

  create(data: Partial<ITask>) {
    return this.db.collection('tasks').add({
      ...data
      // User auth
    })
  }
}
