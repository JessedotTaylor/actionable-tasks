import { AfterViewInit, Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatExpansionPanel } from '@angular/material/expansion';
import { Timestamp } from 'firebase/firestore';
import { INextStep } from 'src/app/interfaces/ITask';
import { getDirtyValues } from 'src/app/utils/Form';
import { NextStepService } from '../../next-step.service';
import { INextStepForm } from '../task-edit-dialog.component';

@Component({
  selector: 'app-next-step-edit',
  templateUrl: './next-step-edit.component.html',
  styleUrls: ['./next-step-edit.component.sass']
})
export class NextStepEditComponent implements OnInit, AfterViewInit {
  @ViewChild(MatExpansionPanel) panel!: MatExpansionPanel;

  @Input() taskId: string | undefined;
  @Input() control!: FormGroup<INextStepForm>;

  constructor(
    private nextStepService: NextStepService
  ) { }

  ngOnInit() {
  }

  onSave() {
    if (this._id) {
      let value = getDirtyValues(this.control);
      this.nextStepService.update(this.taskId as string, this._id!, value);
    } else {
      let value = {
        ...this.control.value,
        date: Timestamp.fromDate(this.control.value.date!)
      } as INextStep;
      this.nextStepService.create(this.taskId as string, value)
    }
  }

  ngAfterViewInit(): void {
    if (!this._id) {
      this.panel.open();
    }
  }

  onComplete(state: boolean) {
    this.control.get('complete')?.setValue(state);

    this.nextStepService.update(this.taskId as string, this._id!, {completed: state});
  }

  get _id(): string | undefined {
    return this.control.get('_id')?.value;
  }

  get overdue(): boolean {
    return this.control.get('date') ? this.control.get('date')!.value.getTime() < Date.now(): false;
  }

}
