import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { ITask } from './interfaces/ITask';
@Injectable({
  providedIn: 'root'
})
export class TaskService {
  constructor(
    private db: AngularFirestore
  ) {
  }
  get():Observable<ITask[]> {
    return this.db.collection<ITask>('tasks').valueChanges({idField: '_id'});
  }

  getById(id: string): Observable<ITask | undefined> {
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

  saveTask(update: Partial<ITask>) {
    if (update._id) {
      this.update(update._id, update);
    } else {
      this.create(update);
    }
  }
}
