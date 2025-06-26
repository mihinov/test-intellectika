import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  Input,
  OnInit,
  signal
} from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { PassRequest, PassRequestStatus } from '../../model/interfaces';
import { PassRequestService } from '../../services/pass-request.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'pass-request',
  standalone: true,
  imports: [CommonModule, DatePipe, ReactiveFormsModule],
  templateUrl: './pass-request.html',
  styleUrl: './pass-request.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PassRequestComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly _passRequestService = inject(PassRequestService);
  private readonly _destroyRef = inject(DestroyRef);

  @Input({ required: true }) passRequest!: PassRequest;

  form!: FormGroup;

  availableStatuses = Object.values(PassRequestStatus);

  isEditingStatus = false;

  showStatusHistory = signal(false);

  ngOnInit(): void {
    this.form = this.fb.group({
      status: [this.passRequest.status]
    });
  }

  startStatusEdit(): void {
    this.form.patchValue({ status: this.passRequest.status });
    this.isEditingStatus = true;
  }

  cancelStatusChange(): void {
    this.form.patchValue({ status: this.passRequest.status });
    this.isEditingStatus = false;
  }

  confirmStatusChange(): void {
    const newStatus: PassRequestStatus = this.form.get('status')!.value;

    if (newStatus === this.passRequest.status) {
      this.cancelStatusChange();
      return;
    }

    this._passRequestService
      .changeStatusRequest({
        id: this.passRequest._id,
        status: newStatus
      })
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe();

    this.isEditingStatus = false;
  }

  toggleStatusHistory(): void {
    this.showStatusHistory.update((v) => !v);
  }
}
