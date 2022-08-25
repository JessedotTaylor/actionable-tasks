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
        this.openDialog()
    }

    openDialog() {
        let taskId = this.route.snapshot.paramMap.get('taskId')!;
        let task: ITask | undefined;
        if (taskId && taskId != 'new') {
            task = this.taskService.getTaskById(taskId);
            if (!task) {
                console.warn(`Task not found for id: ${taskId}`);
            }
        }
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
                        this.taskService.removeTask(result.data._id);
                        break;
                    default:
                        console.warn(`!TaskEditDialogEntryComponent - afterClosed - Unknown action - ${result.action} (${JSON.stringify(result)})`);
                        break;
                }
            }
            this.router.navigate(['../'], {relativeTo: this.route})
        })
    }
}