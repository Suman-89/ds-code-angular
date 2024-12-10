import { EmailTemplateModel } from './../../_models/email-template.model';
import { ActivatedRoute, Router } from '@angular/router';
import { ContentManagementService } from './../../_services/content-management.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { GridToolbarType } from 'src/app/core/_models';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-template-list',
  templateUrl: './template-list.component.html',
  styleUrls: ['./template-list.component.scss'],
})
export class TemplateListComponent implements OnInit {
  @ViewChild('gridinstance') gridInstance;
  emailTemplate;
  selectedTemplate;
  toolbartype = GridToolbarType;
  selectedProcess;
  constructor(
    private cmSvc: ContentManagementService,
    private actRoute: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getAllEmailTemplates();
    let processname = JSON.parse(localStorage.getItem('selected-process'));
    this.selectedProcess = processname.name;
    // console.log("PROCESS NAME ",this.selectedProcess)
  }

  getAllEmailTemplates() {
    this.cmSvc.getTemplates().subscribe((a) => {
      if (a.status) {
        let template = [];
        let data = a.data.sort((a, b) => (a.name > b.name ? 1 : -1));
        //  data.forEach(e => {

        //    e.tasks.forEach(m => {
        //      let sent = m.when? 'Sent After': 'Sent Before' ;
        //      e.tname = `${m.name} - ${sent}  ` ;
        //      template.push({name: e.name, code:e.code, tname: e.tname}) ;
        //     }) ;
        //  });

        data.map((a) => {
          const task = {
            name: a.name,
            code: a.code,
            tname: a.tasks
              ?.map((i) => {
                return `${i.name} - ${i.when ? 'Sent After' : 'Sent Before'} `;
              })
              .toString(),
            processNames: a.processNames,
            id: a.id,
          };
          template.push(task);
        });
        this.emailTemplate = template.filter(
          (i) =>
            i.processNames?.includes(this.selectedProcess) ||
            !i.processNames?.length
        );
      }
    });
  }

  doubleClick(e) {
    this.editTemplate();
  }

  selectRow(event) {
    this.selectedTemplate = event.row;
    console.log('EVENT ', event);
    switch (event.action) {
      case 'addcontenttemplate':
        this.addTemplate();
        break;
      case 'editcontenttemplate':
        this.editTemplate();
        break;
      case 'removetemplate':
        this.removeTemplate();
        break;
    }
  }

  addTemplate() {
    this.router.navigate(['add'], { relativeTo: this.actRoute });
  }

  editTemplate() {
    this.router.navigate(['edit/' + this.selectedTemplate.name], {
      relativeTo: this.actRoute,
    });
  }

  removeTemplate() {
    Swal.fire({
      title: `Are you sure you want to delete template ${this.selectedTemplate.name}?`,
      text: `You won't be able to revert back this change`,
      confirmButtonText: 'Delete',
      showLoaderOnConfirm: true,
      showCancelButton: true,
      allowOutsideClick: () => true,
    }).then((result) => {
      if (result.value !== undefined) {
        console.log(this.selectedTemplate);

        this.cmSvc.removeTemplate(this.selectedTemplate.id).subscribe((t) => {
          if (t.status) {
            this.emailTemplate = this.emailTemplate.filter(
              (e) => e.id !== this.selectedTemplate.id
            );

            this.gridInstance.deleteRow([this.selectedTemplate.uid]);
          }
        });
      }
    });
  }
}
