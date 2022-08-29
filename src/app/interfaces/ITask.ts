import { Timestamp } from "firebase/firestore";

export interface ITask {
    _id: string;
    title: string;
    description?: string;
    createdAt: Timestamp;
    // resolution: {
    //   resolved: boolean;
    //   outcome?: string;
    // };
    nextSteps: INextStep[];
    group: string;
    // status: string;
    resolved: boolean;
    comments: string[];

    level:string;
}

export interface INextStep {
    _id: string;
    comment: string;
    owner: string;
    date: Timestamp;
    completed: boolean;
}
