import {
  Component,
  OnInit,
  ViewChild,
  Output,
  EventEmitter,
  Input,
} from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NgOtpInputComponent } from 'ng-otp-input';
import { CompanyManagementService } from 'src/app/core/_services';

@Component({
  selector: 'app-otp-verify',
  templateUrl: './otp-verify.component.html',
  styleUrls: ['./otp-verify.component.scss'],
})
export class OtpVerifyComponent implements OnInit {
  @Input() aadhaarId;

  @Output() otpEmitter = new EventEmitter();
  @Output() closeModalEmitter = new EventEmitter();

  resendDisable: boolean = false;

  constructor(
    public modal: NgbActiveModal,
    private companySvc: CompanyManagementService
  ) {}

  otp: string = '';
  showOtpComponent = true;
  @ViewChild(NgOtpInputComponent, { static: false })
  ngOtpInput: NgOtpInputComponent;
  config: any = {
    allowNumbersOnly: true,
    length: 6,
    isPasswordInput: false,
    disableAutoFocus: false,
    placeholder: '',
  };

  num: number = 30;
  counter: any;

  ngOnInit(): void {
    this.counter = setInterval(() => this.numberDecrement(), 1000);
    console.log(this.otp);
  }

  numberDecrement() {
    this.num--;
    if (this.num === 0) {
      clearInterval(this.counter);
    }
  }

  onOtpChange(otp) {
    this.otp = otp;
    console.log('value', otp);
    // this.otpEmitter.emit(otp);
  }

  onOtpSubmit() {
    this.otpEmitter.emit({ otp: this.otp, closeModal: this.modal.close });
  }

  generateOtp() {
    this.companySvc.otpGenerate(this.aadhaarId).subscribe((res) => {
      console.log('otp', res);
      if (res.status) {
        // this.otpBoxIsActive = true;
        // console.log("jh",this.otpBoxIsActive);
      }
    });
    this.resendDisable = true;
    this.ngOtpInput.setValue(null);
  }
}
