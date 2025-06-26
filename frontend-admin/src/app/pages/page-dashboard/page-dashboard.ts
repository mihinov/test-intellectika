import { ChangeDetectionStrategy, Component } from '@angular/core';
import { PassRequestList } from '../../features/pass-request/ui/pass-request-list/pass-request-list';

@Component({
  selector: 'app-page-dashboard',
  imports: [
    PassRequestList
  ],
  templateUrl: './page-dashboard.html',
  styleUrl: './page-dashboard.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export default class PageDashboard {

}
