import {
  ApplicationRef,
  ComponentRef,
  EnvironmentInjector,
  Injectable,
  createComponent,
  inject,
} from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { ToastComponent } from '../ui/toast/toast';
import { ToastType } from '../model/interfaces';

@Injectable({ providedIn: 'root' })
export class ToastService {
  private containerEl: HTMLElement | null = null;
  private activeToasts: ComponentRef<unknown>[] = [];
  private document = inject(DOCUMENT);

  constructor(
    private environmentInjector: EnvironmentInjector,
    private appRef: ApplicationRef,
    private readonly _appRef: ApplicationRef,
  ) { }

  show(message: string, type: ToastType = 'error', duration = 3000) {
    this._ensureContainer();

    if (!this.containerEl) {
      throw new Error('Toast container не инициализирован');
    }

    const componentRef = createComponent(ToastComponent, {
      environmentInjector: this.environmentInjector,
    });

    const instance = componentRef.instance as ToastComponent;
    instance.message = message;
    instance.type = type;

    instance.onClose = () => this._fadeOutAndRemove(componentRef);

    this._appRef.attachView(componentRef.hostView);
    componentRef.changeDetectorRef.detectChanges();
    this.containerEl.appendChild(componentRef.location.nativeElement);

    this.activeToasts.push(componentRef);

    // Автоматическое закрытие с анимацией
    setTimeout(() => {
      instance.close();
    }, duration);
  }

  private _ensureContainer() {
    if (!this.containerEl) {
      this.containerEl = this.document.createElement('div');
      this.containerEl.classList.add('toast-container');
      this.document.body.appendChild(this.containerEl);
    }
  }

  private _fadeOutAndRemove(componentRef: ComponentRef<unknown>) {
    const el = componentRef.location.nativeElement.querySelector('.toast');
    if (!el) {
      this._removeToast(componentRef);
      return;
    }

    if (!el.classList.contains('fade-out')) {
      el.classList.add('fade-out');
    }

    const remove = () => {
      el.removeEventListener('transitionend', remove);
      this._removeToast(componentRef);
    };

    el.addEventListener('transitionend', remove);

    setTimeout(() => {
      el.removeEventListener('transitionend', remove);
      this._removeToast(componentRef);
    }, 350);
  }

  private _removeToast(componentRef: ComponentRef<unknown>) {
    const idx = this.activeToasts.indexOf(componentRef);
    if (idx !== -1) this.activeToasts.splice(idx, 1);

    this.appRef.detachView(componentRef.hostView);
    componentRef.destroy();

    if (this.activeToasts.length === 0 && this.containerEl) {
      this.containerEl.remove();
      this.containerEl = null;
    }
  }
}
