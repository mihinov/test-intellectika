import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-layout-login',
  imports: [
    RouterOutlet
  ],
  templateUrl: './layout-login.html',
  styleUrl: './layout-login.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export default class LayoutLogin {

}
