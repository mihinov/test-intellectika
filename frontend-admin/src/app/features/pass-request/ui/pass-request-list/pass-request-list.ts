import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { PassRequestService } from '../../services/pass-request.service';
import { AsyncPipe } from '@angular/common';
import { PassRequestComponent } from '../pass-request/pass-request';

@Component({
  selector: 'pass-request-list',
  imports: [
    AsyncPipe,
    PassRequestComponent
  ],
  templateUrl: './pass-request-list.html',
  styleUrl: './pass-request-list.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PassRequestList {
  private readonly _passRequestService = inject(PassRequestService);
  protected readonly passRequests$ = this._passRequestService.getAll();
}
