import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { PassRequestService } from '../../features/pass-request/services/pass-request.service';
import { PassRequestComponent } from '../../features/pass-request/ui/pass-request/pass-request';
import { AsyncPipe } from '@angular/common';
import { CreatePassRequest } from '../../features/pass-request/ui/create-pass-request/create-pass-request';
import { IntervalRunnerComponent } from '../../shared/features/interval-runner/ui/interval-runner/interval-runner';
import { SseService } from '../../shared/services/sse.service';

@Component({
  selector: 'app-page-dashboard',
  imports: [
		PassRequestComponent,
		AsyncPipe,
		CreatePassRequest,
		IntervalRunnerComponent
	],
  templateUrl: './page-dashboard.html',
  styleUrl: './page-dashboard.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export default class PageDashboard {
	private readonly _passRequestService = inject(PassRequestService);
	protected readonly passRequests$ = this._passRequestService.getSse();
}
