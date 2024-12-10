import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
// import { TreeComponent, TreeNode, ITreeOptions } from 'angular-tree-component';
import { Router, ActivatedRoute, Data } from '@angular/router';

import * as _fromServices from 'src/app/core/_services';

@Component({
  selector: 'app-reference-data-landing',
  templateUrl: './reference-data-landing.component.html',
  styleUrls: ['./reference-data-landing.component.scss']
})
export class ReferenceDataLandingComponent implements OnInit {

  options = {};
  nodes;
  selectedTabs = [];
  currentTab ;
  collapse = false;

  constructor(private actRoute: ActivatedRoute, private route: Router,
              private sharedSvc: _fromServices.SharedService ) { }

  ngOnInit(): void {
  }

}
