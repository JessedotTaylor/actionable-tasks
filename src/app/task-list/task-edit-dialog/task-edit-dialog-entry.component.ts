import { Component, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { ActivatedRoute, Router } from "@angular/router";
import { ITask } from "src/app/interfaces/ITask";
import { TaskService } from "src/app/task.service";
import { TaskEditDialogComponent } from "./task-edit-dialog.component";

@Component({
    selector: 'app-task-edit-dialog-entry',
    template: '',
    styleUrls: []
})
export class TaskEditDialogEntryComponent implements OnInit {
    constructor(
        private dialog: MatDialog,
        private route: ActivatedRoute,
        private router: Router,
        private taskService: TaskService
    ) {

    }

    ngOnInit(): void {
        this.getTask();
    }

    getTask() {
        let taskId = this.route.snapshot.paramMap.get('taskId')!;
        if (taskId) {
            if (taskId != 'new') {
                this.taskService.getById(taskId).subscribe(task => {
                    if (task) {
                        this.openDialog(task)
                    } else {
                        console.warn(`Task not found for id: ${this.route.snapshot.paramMap.get('taskId')}`)
                    }
                })
            } else {
                this.openDialog()
            }
        } else {
            console.warn(`Entered the TaskEditDialogEntryComponent with no taskId: ${taskId}`)
        }
    }

    openDialog(task?: ITask) {
        const dialogRef = this.dialog.open(TaskEditDialogComponent, {
            data: task,
            height: '100%',
            width: '20%',
            disableClose: true,
            hasBackdrop: true,
            position: {
                'right': '0',
                'top': '0'
            }
        });
        dialogRef.afterClosed().subscribe((result: {action: 'save' | 'delete', data: ITask}) => {
            if (result) {
                switch (result.action) {
                    case 'save':
                        this.taskService.saveTask(result.data);
                        break;
                    case 'delete':
                        this.taskService.remove(result.data._id);
                        break;
                    default:
                        console.warn(`!TaskEditDialogEntryComponent - afterClosed - Unknown action - ${result.action} (${JSON.stringify(result)})`);
                        break;
                }
            }
            this.router.navigate(['../'], {relativeTo: this.route})
        });
    }
}