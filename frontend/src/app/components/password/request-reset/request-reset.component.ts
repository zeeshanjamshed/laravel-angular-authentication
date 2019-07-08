import { Component, OnInit } from '@angular/core';
import { JarwisService } from 'src/app/services/jarwis.service';
import {SnotifyService} from 'ng-snotify';

@Component({
  selector: 'app-request-reset',
  templateUrl: './request-reset.component.html',
  styleUrls: ['./request-reset.component.css']
})
export class RequestResetComponent implements OnInit {

  form = {
    email: null
  }
  constructor(
    private _jarwis: JarwisService,
    private snotifyService: SnotifyService
  ) { }

  ngOnInit() {
  }

  onSubmit()
  {
    this.snotifyService.info('Wait...', {timeout: 5000});
    this._jarwis.sendPasswordResetLink(this.form).subscribe(
      data => this.handleResponse(data),
      error => this.snotifyService.error(error.error.error)
    );

  }

  handleResponse(data)
  {
    // console.log(data);
    if(data.status)
    {
      this.snotifyService.success(data.data, {timeout: 0});
    }
    this.form.email = null;
  }
}
