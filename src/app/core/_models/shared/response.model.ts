export interface ResponseModel<T> {
    message: string ;
    status: boolean ;
    code: number;
    data: T ;
}
