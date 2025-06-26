import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { AuthService } from '../../features/auth/services/auth.service';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-layout-dashboard',
  imports: [
    RouterOutlet,
    AsyncPipe
  ],
  templateUrl: './layout-dashboard.html',
  styleUrl: './layout-dashboard.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export default class LayoutDashboard {
  private readonly _authService = inject(AuthService);
  private readonly _router = inject(Router);
  protected readonly user$ = this._authService.me();

  clickLogout(): void {
    this._authService.logout();
    this._router.navigateByUrl('/login');
  }
}
