export interface TranscriptionModel {
    options: string[],
    sentText: string,
    subject?: string,
    timestamp: string,
    uniqueUserIdentifier:string,
    userFullName: string,
    isBot:boolean
}
