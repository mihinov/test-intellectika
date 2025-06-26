import { ChangeDetectionStrategy, Component, DestroyRef } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';

const defaultFormValue = {
  email: 'kamahinmihail@gmail.com',
  password: '123'
};

@Component({
  selector: 'login-form',
  imports: [
    ReactiveFormsModule
  ],
  templateUrl: './login-form.html',
  styleUrl: './login-form.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginForm {
  loginForm = new FormGroup({
    email: new FormControl(defaultFormValue.email, [Validators.required, Validators.email]),
    password: new FormControl(defaultFormValue.password, Validators.required)
  });

 constructor(
  private readonly _authService: AuthService,
  private readonly _destroyRef: DestroyRef,
  private readonly _router: Router
 ) {}

  onSubmit(): void {
    if (this.loginForm.invalid) {
      return;
    }

    const credentials = this.loginForm.value as { email: string; password: string };

    this._authService.login(credentials).pipe(
      takeUntilDestroyed(this._destroyRef)
    ).subscribe(() => {
      this._router.navigateByUrl('/dashboard')
    });
  }

  hasEmailError(): boolean {
    const control = this.loginForm.get('email');
    return !!control && control.invalid && control.touched;
  }

  hasPasswordError(): boolean {
    const control = this.loginForm.get('password');
    return !!control && control.invalid && control.touched;
  }
}
