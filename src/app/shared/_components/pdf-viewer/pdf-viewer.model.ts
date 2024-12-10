class PdfViewerConstants {
    static ALLOW_ANNOTATION = true;
    static ALLOW_ANNOTATION_NAVIGATION = true;
    static ALLOW_SELECTION_ON_NAVIGATION = true;
    static ALLOW_ANNOTATION_ON_SELECTION = true;
}
export class PdfViewerData {
    docUrl: string;
    annotatedParagraphs?: PdfViewerAnnotationData[];
    isSortedData?: boolean;
}

export class PdfViewerOptions {
    allowAnnotation? = PdfViewerConstants.ALLOW_ANNOTATION;
    allowAnnotationOnSelection? = PdfViewerConstants.ALLOW_ANNOTATION_ON_SELECTION;
    annotationColor?: Color;
    overwriteCssPath?: string;
    overwriteJsPath?: string;
    allowAnnotationNavigation? = PdfViewerConstants.ALLOW_ANNOTATION_NAVIGATION;
    allowSelectionOnNavigation? = PdfViewerConstants.ALLOW_SELECTION_ON_NAVIGATION;
    fitMode?: PDF_FIT_MODE = PDF_FIT_MODE.FitWidth;
}

export interface PdfViewerAnnotationData{
    label: any;
    key?: any;
    id?:string,
    pageNumber: number;
    quads: Rectangle[];
    annotationColor?: Color;
}

export interface Rectangle{
    Left: number;
    Top: number;
    Width: number;
    Height: number;
    
}

export interface Color{
    R: number;
    G: number;
    B: number;
    A?: number;
}

export enum PDF_FIT_MODE{
    FitPage = "FitPage",
    FitWidth = "FitWidth",
    Zoom ="Zoom"
}
