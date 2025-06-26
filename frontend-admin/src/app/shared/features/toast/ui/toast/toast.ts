import { ChangeDetectionStrategy, Component, ElementRef, Input, ViewChild } from '@angular/core';
import { ToastType } from '../../model/interfaces';

@Component({
  selector: 'app-toast',
  templateUrl: './toast.html',
  styleUrls: ['./toast.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ToastComponent {
  @Input() message = 'Привет';
  @Input() type: ToastType = 'info';

  @ViewChild('toastEl', { static: true }) toastEl!: ElementRef<HTMLDivElement>;

  onClose?: () => void;

  close() {
    if (!this.toastEl) {
      this.onClose?.();
      return;
    }
    this.toastEl.nativeElement.classList.add('fade-out');
    setTimeout(() => this.onClose?.(), 300); // Длительность совпадает с CSS transition
  }
}
