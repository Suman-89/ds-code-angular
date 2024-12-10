import { Directive, HostListener, HostBinding, EventEmitter, Output } from '@angular/core';
import { FileUploadService } from '../../core/_services';


@Directive({
    selector: '[fileUploader]'
})
export class FileUploaderDirective {

    @Output() filesDropped: EventEmitter<File[]> = new EventEmitter();
    @HostBinding('class.filover') fileOver: boolean;

    constructor(private fileUploadSvc: FileUploadService) { }

    @HostListener('dragover', ['$event']) public onDragOver(event) {
        event.preventDefault();
        event.stopPropagation();

        this.fileOver = true;
    }

    @HostListener('dragleave', ['$event']) public onDragLeave(event) {
        event.preventDefault();
        event.stopPropagation();

        this.fileOver = false;
    }

    @HostListener('drop', ['$event']) public onDrop(event) {
        event.preventDefault();
        event.stopPropagation();

        this.fileOver = false;
        let files: File[] = event.dataTransfer.files;

        if (files.length > 0) {
            this.filesDropped.emit(files);
            this.fileUploadSvc.uploadFile(files);
        }
    }
}
