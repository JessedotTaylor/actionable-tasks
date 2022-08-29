import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { INextStep } from '../interfaces/ITask';

@Injectable({
  providedIn: 'root'
})
export class NextStepService {

  constructor(
    private db: AngularFirestore
  ) { }

  get(taskId: string): Observable<INextStep[]> {
    return this.db
      .collection<INextStep>(`tasks/${taskId}/nextSteps`)
      .valueChanges({idField: '_id'});
  }

  create(taskId: string, nextStep: INextStep) {
    return this.db
      .collection<INextStep>(`tasks/${taskId}/nextSteps`)
      .add(nextStep);
  }

  update(taskId: string, nextStepId: string, update: Partial<INextStep>) {
    return this.db.collection(`tasks/${taskId}/nextSteps`).doc(nextStepId).update(update);
  }

}
