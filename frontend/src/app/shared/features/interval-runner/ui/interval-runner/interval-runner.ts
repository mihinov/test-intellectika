import { DecimalPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, DestroyRef, EventEmitter, inject, Input, OnInit, Output, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { interval, map, startWith } from 'rxjs';

@Component({
	selector: 'interval-runner',
	imports: [
		DecimalPipe
	],
	templateUrl: './interval-runner.html',
	styleUrl: './interval-runner.scss',
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class IntervalRunnerComponent implements OnInit {
  @Input({ required: true }) text: string = '';
  @Input({ required: true }) intervalMs: number = 10_000;
  @Input() showElapsedTime: boolean = true;
  @Output() intervalTick = new EventEmitter<void>();

  private readonly _destroyRef = inject(DestroyRef);
  protected remainingSeconds = signal(0);

  private nextRunTime = performance.now() + this.intervalMs;

  ngOnInit(): void {
    this.resetTime();

    interval(this.intervalMs)
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe(() => {
        this.intervalTick.emit();
        this.resetTime();
      });

    if (this.showElapsedTime) {
      interval(1000 / 60)
        .pipe(
          startWith(0),
          map(() => {
            const now = performance.now();
            const remainingMs = this.nextRunTime - now;
            return Math.max(0, Math.floor(remainingMs / 100) / 10);
          }),
          takeUntilDestroyed(this._destroyRef)
        )
        .subscribe(seconds => {
          this.remainingSeconds.set(seconds);
        });
    }
  }

  private resetTime(): void {
    this.nextRunTime = performance.now() + this.intervalMs;
  }
}
