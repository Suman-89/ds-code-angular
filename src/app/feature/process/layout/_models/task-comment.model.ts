export interface TaskCommentModel {
    id: string,
    message: string,
    users?: string[],
    groups?: string[],
    documents?: any[],
    rootProcessInstanceId: string,
    taskId: string,
    createdtime?: Date,
    removalTime?: Date,
    userid: string;
    name?: string;
    replycount?: number;
    replies?:TaskCommentModel[];
    levelInfo?: string;
}
