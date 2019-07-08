import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { JarwisService } from 'src/app/services/jarwis.service';
import { SnotifyService } from 'ng-snotify';

@Component({
  selector: 'app-response-reset',
  templateUrl: './response-reset.component.html',
  styleUrls: ['./response-reset.component.css']
})
export class ResponseResetComponent implements OnInit {

  public error = [];
  public form = {
    email: null,
    password: null,
    password_confirmation: null,
    resetToken: null
  }
  errorMsgs = [];
  serverError;

  constructor(
    private route: ActivatedRoute,
    private _jarwis: JarwisService,
    private router: Router,
    private snotifyService: SnotifyService
  ) { 
    route.queryParams.subscribe(params => {
      this.form.resetToken = params['token']
    });
   }

  ngOnInit() {
  }

  onSubmit()
  {
    this._jarwis.changePassword(this.form).subscribe(
      data => {
        // console.log(data);
        let _router = this.router;
        this.snotifyService.confirm('Now Login with new password.', 'Password Changed!', {
          // timeout: 5000,
          // showProgressBar: true,
          // closeOnClick: false,
          // pauseOnHover: true,
          buttons: [
            // {text: 'Yes', action: () => console.log('Clicked: Yes'), bold: false},
            // {text: 'Okay', action: () => console.log('Clicked: No')},
            {
              text: 'Okay', 
              action: toster => {
                _router.navigateByUrl('/login'),
                this.snotifyService.remove(toster.id)
              }
            },
            // {text: 'Later', action: (toast) => {console.log('Clicked: Later'); service.remove(toast.id); } },
            // {text: 'Close', action: (toast) => {console.log('Clicked: No'); service.remove(toast.id); }, bold: true},
          ]
      });
        
      },
      error => {
        console.log(error);
        this.errorMsgs = error.error.errors;
        if(error.error.error)
        {
          this.serverError = error.error.error;
        }
      }
    );
  }

}
