import { ITask } from "../interfaces/ITask";

export const TASKS: ITask[] = [
    {
      _id: '1',
      title: 'Resource bundles in HR-1?',
      comments: [],
      createdAt: new Date('2022-08-24T00:00:00Z'),
      resolved: false,
      tasks: [],
      group: 'HR-1 Features'
    },
    {
      _id: '2',
      title: 'Versioning / Audit logs',
      comments: ['including files?', 'Yes to versioning, pending for files'],
      createdAt: new Date('2022-08-24T00:00:00Z'),
      resolved: false,
      tasks: [],
      group: 'HR-1 Features'
    }
  ]