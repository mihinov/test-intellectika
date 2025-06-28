import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  input,
  Input,
  OnInit,
  signal
} from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { PassRequest } from '../../model/interfaces';
import { PassRequestService } from '../../services/pass-request.service';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import { PassStatusesApiService } from '../../services/pass-statuses-api.service';
import { take } from 'rxjs';

@Component({
  selector: 'pass-request',
  standalone: true,
  imports: [CommonModule, DatePipe, ReactiveFormsModule],
  templateUrl: './pass-request.html',
  styleUrl: './pass-request.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PassRequestComponent implements OnInit {
  passRequest = input.required<PassRequest>();

	private readonly _passRequestService = inject(PassRequestService);
	private readonly _passStatusesApiService = inject(PassStatusesApiService);
  private readonly _destroyRef = inject(DestroyRef);

  form!: FormGroup<{
		status: FormControl<string | null>;
	}>;

  allStatusesSignal = toSignal(this._passStatusesApiService.getAll());

  isEditingStatus = false;

  showStatusHistory = signal(false);

	ngOnInit(): void {
		this.form = new FormGroup({
			status: new FormControl(this.passRequest().status.type)
		});
	}

  startStatusEdit(): void {
    this.form.patchValue({ status: this.passRequest().status.type });
    this.isEditingStatus = true;
  }

  cancelStatusChange(): void {
    this.form.patchValue({ status: this.passRequest().status.type });
    this.isEditingStatus = false;
  }

  confirmStatusChange(): void {
    const newStatus = this.form.controls.status.value!;

    if (newStatus === this.passRequest().status.type) {
      this.cancelStatusChange();
      return;
    }

    this._passRequestService
      .changeStatusRequest({
        id: this.passRequest()._id,
        status: newStatus
      })
      .pipe(
				takeUntilDestroyed(this._destroyRef),
				take(1)
			)
      .subscribe();

    this.isEditingStatus = false;
  }

  toggleStatusHistory(): void {
    this.showStatusHistory.update((v) => !v);
  }
}
