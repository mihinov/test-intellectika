import { ChangeDetectionStrategy, Component, DestroyRef } from '@angular/core';
import { FormGroup, Validators, FormControl, ReactiveFormsModule } from '@angular/forms';
import { PassRequestCreateDto } from '../../models/interfaces';
import { PassRequestService } from '../../services/pass-request.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { take } from 'rxjs';

@Component({
	selector: 'create-pass-request',
	imports: [
		ReactiveFormsModule
	],
	templateUrl: './create-pass-request.html',
	styleUrl: './create-pass-request.scss',
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class CreatePassRequest {
	form = new FormGroup({
		visitPurpose: new FormControl('', [Validators.required])
	});

	constructor(
		private readonly _passRequestService: PassRequestService,
		private readonly _destroyRef: DestroyRef
	) { }

	onSubmit(): void {
		if (!this.form.valid) return;

		const passRequestCreateDto: PassRequestCreateDto = {
			visitPurpose: this.form.value.visitPurpose!,
		};

		this._passRequestService.create(passRequestCreateDto)
			.pipe(
				takeUntilDestroyed(this._destroyRef),
				take(1)
			)
			.subscribe();
	}

	hasError(): boolean {
		const control = this.form.controls.visitPurpose;
    return !!control && control.invalid && control.touched;
	}
}
