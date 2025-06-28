import { ChangeDetectionStrategy, Component, DestroyRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { take } from 'rxjs';

interface RegistationCredentials {
	email: string;
	password: string;
	organization: string;
	phone: string
}

@Component({
  selector: 'registration-form',
  imports: [
		ReactiveFormsModule
	],
  templateUrl: './registration-form.html',
  styleUrl: './registration-form.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RegistrationForm {
  registrationForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', Validators.required),
		organization: new FormControl('', Validators.required),
		phone: new FormControl('', Validators.required)
  });

 constructor(
  private readonly _authService: AuthService,
  private readonly _destroyRef: DestroyRef,
  private readonly _router: Router
 ) {}

  onSubmit(): void {
    if (this.registrationForm.invalid) {
      return;
    }

    const credentials = this.registrationForm.value as RegistationCredentials;

    this._authService.registrationAndLogin(credentials).pipe(
      takeUntilDestroyed(this._destroyRef),
			take(1)
    ).subscribe(() => {
      this._router.navigateByUrl('/account/dashboard');
    });
  }

	hasError(formControlName: keyof typeof this.registrationForm.controls): boolean {
		const control = this.registrationForm.get(formControlName);
    return !!control && control.invalid && control.touched;
	}
}
