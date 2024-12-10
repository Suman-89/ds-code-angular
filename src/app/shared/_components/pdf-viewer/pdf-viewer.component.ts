import { Component, OnInit, Input, ViewChild, ElementRef, OnChanges, SimpleChanges, Output, EventEmitter } from '@angular/core';
import { PdfViewerData, PdfViewerOptions, Color, PdfViewerAnnotationData } from './pdf-viewer.model';
// import Swal from 'sweetalert2';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AddAnnotationModalComponent } from '../../_modals';

declare let PDFTron: any;

@Component({
  selector: 'app-pdf-viewer',
  templateUrl: './pdf-viewer.component.html',
  styleUrls: ['./pdf-viewer.component.scss']
})
export class PdfViewerComponent implements OnInit,OnChanges  {

  @Input() data : PdfViewerData;
  @Input() options: PdfViewerOptions;
  @ViewChild('pdfviewer') viewer: ElementRef;
  @Output() annotateEmit = new EventEmitter() ;
  @Output() blurEvent = new EventEmitter() ;

  myWebViewer: any = null;
  isLoadedFirstTime =true;
  selectedAnnoatationIndex:number;
  annotationList = [];  // for navigation
  globalAnnotationColor: Color;
  annotationMap = new Map(); 

  constructor(private modalSvc: NgbModal) {
  }

  private createOrupdateViewer(url: string): void {
    this.clearAndCloseDocument();
    if( this.myWebViewer !== null) {
      this.getDocumentViewer().closeDocument();
      this.myWebViewer.loadDocument( url );
      this.isLoadedFirstTime = false;
    } else {
      this.myWebViewer = new PDFTron.WebViewer({
        path: '/assets/pdftron',
        css: this.options.overwriteCssPath, 
        config: this.options.overwriteJsPath, 
        initialDoc: url,
        type: 'html5',
        l: 'demo:sagir@mindparabole.com:72e1b83d01e78b5499f2e0e942cdd086543d5d8735d5b8ac85',
        hideSidePanel: true,
        streaming: false,
        enableAnnotations: this.options.allowAnnotation,
        hideAnnotationPanel: true,
        showToolbarControl: true ,
        enableReadOnlyMode: true,
        disabledElements:[
          'searchPanel'
        ]
      }, this.viewer.nativeElement);
      this.setupOnLoadHandler();
    } 
  }

  setupOnLoadHandler(){
    this.viewer.nativeElement.addEventListener('ready', () => {
      if(this.options.allowAnnotationNavigation){
        this.getWebViewerInstance().setHeaderItems((header) => {
          header.push({
            type: 'actionButton',
            img: 'https://img.icons8.com/ios/24/000000/double-left.png',
            dataElement: 'prevnavigation',          
            onClick: () => {
              this.changeSelectedAnnotation('prev');
            }
          });
          header.push({
            type: 'actionButton',
            img: 'https://img.icons8.com/ios/24/000000/double-right.png',
            dataElement: 'nextnavigation',
            onClick: () => {
              this.changeSelectedAnnotation('next');
            }
          });
        })
      }
    })
    this.viewer.nativeElement.addEventListener('documentLoaded', () => {
      var instance = this.getWebViewerInstance();
      /* var FitMode = instance.FitMode;
      instance.setFitMode(FitMode.FitWidth); */
      instance.setFitMode(this.options.fitMode);
      this.globalAnnotationColor = this.options && this.options.annotationColor ? this.getColor(this.options.annotationColor) : this.getDocumentViewer().getToolModeMap().AnnotationCreateTextHighlight.defaults.StrokeColor;
      if(this.data.annotatedParagraphs){
        this.annotateAndSelect(this.data.annotatedParagraphs)
      }
      if(this.isLoadedFirstTime){
        this.setupSelectHandler();
      }
    })
  }

  private setupSelectHandler(): void {
    if(this.options.allowAnnotationOnSelection){ 
      this.getWebViewer().getInstance().docViewer.getTool('TextSelect').on('selectionComplete', (startQuad, allQuads) => {
        console.log('sel complete')
        const docViewer = this.getDocumentViewer() //this.getWebViewer().getInstance().docViewer;
        const quads = docViewer.getSelectedTextQuads();
        const sentence = docViewer.getSelectedText();
        console.log(docViewer);
        let selectionDetails = {
          quads: quads[0], 
          text: sentence, 
          pageNumber: allQuads.pageIndex + 1 
        };
        this.getWebViewer().getInstance().docViewer.clearSelection();
        let annot = this.annotate(selectionDetails.quads,selectionDetails.pageNumber);
        this.annotationList.push(annot) ;
        // this.addAnnotation(selectionDetails) ;
        const refMod = this.modalSvc.open(AddAnnotationModalComponent, {size: 'md'}) ;
        refMod.componentInstance.selectedText = selectionDetails ;
        refMod.componentInstance.annotkeys = this.data.annotatedParagraphs.map(k =>
          { 
           return {key: k.key, label: k.label}
          }) ;
        refMod.componentInstance.addedAnnotEmit.subscribe(r => {
          if(r) {
            this.annotateEmit.emit(r)  ;
            refMod.close() ;
          }
        }) ;
        this.blurEvent.emit(true) ;

        // Swal.fire({
        //     title: 'Do you want to add?',
        //     // text: "Do you want to add?",
        //     text: selectionDetails.text ,
        //     icon: 'question',
        //     // html: this.renderText(selectionDetails) ,
        //     input: 'select',
        //     inputOptions: {
        //       key: 'Key',
        //       value: 'Value'
        //     }, 
        //     inputPlaceholder: 'Select type of annotation',
        //     confirmButtonColor: '#313d73',
        //     cancelButtonColor: '#4cd009',
        //     confirmButtonText: 'Add',
        //     cancelButtonText:'Cancel',
        //     showCloseButton: true,
        //     showCancelButton: true
        //   }).then((result) => {
        //     if (result.value) {
        //       //add

        //     }  else if (result.dismiss === Swal.DismissReason.cancel) {
        //       //cancel
        //     }
        //   })
      });
    }
  }

  renderText(selectedField): string {
   let text = `<div class="text-left" style="color: #ff9900; font-weight: 500">${selectedField.text}</div>` ;
   let keys = Object.keys(selectedField.quads[0]) ;
   for(let k of keys) {
     let val = Number(selectedField.quads[0][k]).toFixed(2) ;
     text = text + `<div class="text-left w-50" style="font-size:10px">${k} : ${val} </div>` ; 
   }
  //  let dd = 
  //  `
  //  <div>
  //  <select #typeSelect name="ddsw" id="typesw" class="inputstyle">
  //  <option selected value="key">Key</option>
  //  <option value="value">Value</option>
  //  </select>
  //  </div>
  //  `
   return text;
  }


  addAnnotation(selectedText) {
    const refMod = this.modalSvc.open(AddAnnotationModalComponent, {size: 'md'}) ;
    refMod.componentInstance.selectedText = selectedText ;
    // refMod.componentInstance.type =  type;
    refMod.componentInstance.annotkeys = this.data.annotatedParagraphs.map(k =>
      { 
       return {key: k.key, label: k.label}
      }) ;
    // this.annotateEmit.emit(selectedText) ;
    refMod.componentInstance.addedAnnotEmit.subscribe(r => {
      if(r) {
        this.annotateEmit.emit(r)  ;
      }
    })
  }


  public annotateAndSelect(datas:PdfViewerAnnotationData[] | PdfViewerAnnotationData){
    if(this.selectedAnnoatationIndex){
      let currentAnnotation = this.annotationList[this.selectedAnnoatationIndex];
      if(currentAnnotation){
        this.getAnnotationManager().hideAnnotation(currentAnnotation);
      }
    }
    if(!Array.isArray(datas)){
      datas = [datas];
    }
    let prevListLength = this.annotationList.length;
    if(this.data.isSortedData){
      datas.forEach((data) => {
        this.prepareAnnotation(data);
      })
    } else{
      let grpedByPages = this.groupBy(datas , 'pageNumber' );
      let sortedDatas = [];
      Object.keys(grpedByPages).forEach( a => {
        const annotParasByPage: PdfViewerAnnotationData[] = grpedByPages[a];
        annotParasByPage.sort( (a1,a2) => {
          return (a1.quads[0].Top - a2.quads[0].Top);
        })
        sortedDatas = [...sortedDatas,...annotParasByPage]
      });
      sortedDatas.forEach((data) => {
        this.prepareAnnotation(data)
      }) 
    }
    this.selectedAnnoatationIndex = prevListLength ? prevListLength+1 : 0;
    this.goToAnnotation();
  }

  
  private prepareAnnotation(data : PdfViewerAnnotationData){
    let pageNumber = data.pageNumber
    let color; 
    if(data.annotationColor){
      color = this.getColor(data.annotationColor);
    }

    let page_width = this.getDocumentViewer().getPageWidth(pageNumber - 1);
    let page_height = this.getDocumentViewer().getPageHeight(pageNumber - 1);
    
    let quads = data.quads.map(q => {
      return {
        x1:q.Left * page_width,
        x2:(q.Width + q.Left) * page_width,
        x3:(q.Width + q.Left) * page_width,
        x4:q.Left * page_width,
        y1:(q.Height + q.Top) * page_height,
        y2:(q.Height + q.Top) * page_height,
        y3:q.Top * page_height,
        y4:q.Top * page_height
      }
    })
    let selAnnot = this.annotate(quads,pageNumber,color,data.id);
    this.annotationList.push(selAnnot);
    this.annotationMap.set(data.key, selAnnot) ;

  }

  selectByKey(key) {
    let anot = this.annotationMap.get(key) ;
    this.goToAnnotation(anot) ;

  }

  private annotate(quads,pageNo,clr?,id=this.generateRandomId()){
    const annotManager = this.getAnnotationManager();
    const viewerWindow = this.getWindow();
    const currentAnnotation = new viewerWindow.Annotations.TextHighlightAnnotation();
    var color = clr ? clr : this.globalAnnotationColor;
    currentAnnotation.Id = id;
    currentAnnotation.PageNumber = pageNo;
    currentAnnotation.StrokeColor = color;
    currentAnnotation.Quads = quads;
    currentAnnotation.Author = annotManager.getCurrentUser();
    annotManager.addAnnotation(currentAnnotation);
    annotManager.drawAnnotations( pageNo );
    return currentAnnotation
  }

  public getColor(color: Color){
    const viewerWindow = this.getWindow();
    return new viewerWindow.Annotations.Color(color.R,color.G,color.B);
  }

  public clearAndCloseDocument(): void {
    if( this.getWebViewer() !== null ){
      this.annotationList = [];
      this.getDocumentViewer().closeDocument();
    }
  }

  public deleteExistingAnnotations(): void {
    var annotList: any[] = this.getAnnotationManager().getAnnotationsList();
    this.getAnnotationManager().deleteAnnotations(annotList,false,true);
  }

  public deleteAnnotation(annotation: any): void {
    if( annotation === null ) return;
    this.getAnnotationManager().deleteAnnotation(annotation,false,true);
  }

  public deleteAnnotations(annotation: any[]): void {
    if( annotation === null ) return;
    this.getAnnotationManager().deleteAnnotations(annotation,false,true);
  }

  public deleteAnnotationById(id){
    let annotation = this.getAnnotationById(id);
    if(annotation){
      this.deleteAnnotation(annotation);
    }
  }

  public getAnnotationById(id){
    return this.getAnnotationManager().getAnnotationById(id)
  }

  private changeSelectedAnnotation(action){
    if(action == 'prev'){
      if(this.selectedAnnoatationIndex > 0){
        this.selectedAnnoatationIndex -= 1;
          this.goToAnnotation();
      }
    }
    else{
      if(this.selectedAnnoatationIndex+1 < this.annotationList.length){
        this.selectedAnnoatationIndex += 1;
          this.goToAnnotation();
      }
    }
  }

  private goToAnnotation(annotation?){
    let currentAnnotation = annotation ? annotation :this.annotationList[this.selectedAnnoatationIndex] ;
    
    if(this.options.allowSelectionOnNavigation){
      this.getAnnotationManager().deselectAllAnnotations();
      this.getAnnotationManager().selectAnnotation(currentAnnotation);
    }
    if(this.options.allowAnnotationNavigation){
      this.getAnnotationManager().jumpToAnnotation(currentAnnotation);
    }
  }

  private getWebViewer(): any {
    return this.myWebViewer;
  }

  private getWindow(): any{
    return this.getWebViewer().element.querySelector('iframe').contentWindow;
  }

  private getReaderCtrl(): any{
    return this.getWindow().readerControl;
  }

  private getDocumentViewer(): any{
    return this.getWebViewer().getInstance().docViewer;
  }

  private getAnnotationManager(): any {
    return this.getDocumentViewer().getAnnotationManager();
  }

  private getWebViewerInstance():any{
    return this.getWebViewer().getInstance()
  }

  private groupBy(xs, key) {
    return xs.reduce(function(rv, x) {
      (rv[x[key]] = rv[x[key]] || []).push(x);
      return rv;
    }, {});
  };

  private generateRandomId(){
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges){
    if(changes.data && changes.data.currentValue){
      // this.options = {...new PdfViewerOptions(),...changes.options.currentValue};
      this.options = {...new PdfViewerOptions(),...this.options};
      this.createOrupdateViewer(changes.data.currentValue.docUrl);
    }
    /* if(changes.options && changes.options.currentValue){
      this.options = {...new PdfViewerOptions(),...changes.options.currentValue};
    } */
  }

}
