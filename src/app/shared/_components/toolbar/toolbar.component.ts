import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { ToolbarButtonModel } from 'src/app/core/_models';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss'],
})
export class ToolbarComponent implements OnInit {
  @Input() buttons: ToolbarButtonModel[] = [];
  @Input() type?: string = 'list';
  @Output() actionEmit: EventEmitter<string> = new EventEmitter();

  constructor() {}

  ngOnInit(): void {}

  action(actionType: string): void {
    console.log('Action Type on Click', actionType);
    this.actionEmit.emit(actionType);
  }
}
