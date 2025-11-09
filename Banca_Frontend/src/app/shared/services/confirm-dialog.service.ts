import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface ConfirmDialog {
  message: string;
  title?: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel?: () => void;
}

@Injectable({
  providedIn: 'root'
})
export class ConfirmDialogService {
  private dialog$ = new BehaviorSubject<ConfirmDialog | null>(null);
  public dialog = this.dialog$.asObservable();

  confirm(
    message: string,
    onConfirm: () => void,
    options?: {
      title?: string;
      confirmText?: string;
      cancelText?: string;
      onCancel?: () => void;
    }
  ): void {
    this.dialog$.next({
      message,
      title: options?.title || '¿Estás seguro?',
      confirmText: options?.confirmText || 'Confirmar',
      cancelText: options?.cancelText || 'Cancelar',
      onConfirm,
      onCancel: options?.onCancel
    });
  }

  close(): void {
    this.dialog$.next(null);
  }
}
