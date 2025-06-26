import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RegistrationForm } from '../../features/auth/ui/registration-form/registration-form';

@Component({
  selector: 'app-page-registration',
  imports: [
		RegistrationForm
	],
  templateUrl: './page-registration.html',
  styleUrl: './page-registration.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export default class PageRegistration {

}
