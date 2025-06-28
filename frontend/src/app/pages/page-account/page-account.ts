import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { AuthService } from '../../features/auth/services/auth.service';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-page-account',
  imports: [
		AsyncPipe
	],
  templateUrl: './page-account.html',
  styleUrl: './page-account.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export default class PageAccount {
	private readonly _authService = inject(AuthService);
	protected authUser$ = this._authService.me();


}
