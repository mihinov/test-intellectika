import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-layout-auth',
  imports: [
    RouterOutlet,
		RouterLink,
		RouterLinkActive
  ],
  templateUrl: './layout-auth.html',
  styleUrl: './layout-auth.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export default class LayoutAuth {

}
