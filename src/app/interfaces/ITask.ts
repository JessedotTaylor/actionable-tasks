export interface ITask {
    _id: string;
    title: string;
    description?: string;
    createdAt: Date;
    // resolution: {
    //   resolved: boolean;
    //   outcome?: string;
    // };
    tasks: any[];
    group: string;
    // status: string;
    resolved: boolean;
    comments: string[];
}