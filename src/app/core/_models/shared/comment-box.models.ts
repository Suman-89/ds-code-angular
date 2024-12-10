export interface  CommentBoxOptions{
    allowFullScreen?: boolean
    id?:string,
    height?:number,
    plugins?: string[] | string,
    toolbar?: string,
    clearAfterSubmit?: boolean
}

export class CommentBoxConstants{

    static TINYMCE_FULL_PLUGINS = [
        'advlist autolink lists',
        'searchreplace textcolor',
        'paste',
    ];
    static TINYMCE_SHORT_PLUGINS = [
        'advlist autolink lists',
        'searchreplace textcolor',
        'paste'
      ];

    static TINYMCE_FULL_TOOLBAR = 'bold italic underline strikethrough | alignleft aligncenter alignright alignjustify forecolor backcolor removeformat bullist numlist';
    static TINYMCE_SHORT_TOOLBAR = 'bold italic underline strikethrough | forecolor backcolor removeformat';
}