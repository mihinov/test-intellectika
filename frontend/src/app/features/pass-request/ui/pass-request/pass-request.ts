import {
  ChangeDetectionStrategy,
  Component,
  Input
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { PassRequest } from '../../models/interfaces';

@Component({
  selector: 'pass-request',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pass-request.html',
  styleUrl: './pass-request.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PassRequestComponent {
  @Input({ required: true }) passRequest!: PassRequest;

  showStatusHistory = false;

  toggleStatusHistory(): void {
    this.showStatusHistory = !this.showStatusHistory;
  }
}
