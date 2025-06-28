import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from '../../features/auth/services/auth.service';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-layout-account',
  imports: [
    RouterOutlet,
		AsyncPipe,
		RouterLink,
		RouterLinkActive
  ],
  templateUrl: './layout-account.html',
  styleUrl: './layout-account.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export default class LayoutAccount {
  private readonly _authService = inject(AuthService);
  private readonly _router = inject(Router);
  protected readonly user$ = this._authService.me();

  clickLogout(): void {
    this._authService.logout();
    this._router.navigateByUrl('/auth');
  }
}
