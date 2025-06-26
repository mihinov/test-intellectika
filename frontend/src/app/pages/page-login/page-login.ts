import { ChangeDetectionStrategy, Component } from '@angular/core';
import { LoginForm } from '../../features/auth/ui/login-form/login-form';

@Component({
  selector: 'app-page-login',
  imports: [
		LoginForm
	],
  templateUrl: './page-login.html',
  styleUrl: './page-login.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export default class PageLogin {

}
