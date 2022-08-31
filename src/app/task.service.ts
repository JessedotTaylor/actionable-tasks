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
    return this.dataSubject.asObservable();
  }

  getLevels():Observable<string[]> {
    return this.levelsSubject.asObservable();
  }

  getById(id: string, skipCache: boolean = false): Observable<ITask | undefined> {
    return this.get().pipe(
      map(res => {
        let task = res.filter(t => t._id == id);
        return task.length ? task[0] : undefined;
      })
    )
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
