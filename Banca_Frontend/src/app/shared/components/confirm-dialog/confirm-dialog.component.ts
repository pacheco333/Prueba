import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfirmDialogService, ConfirmDialog } from '../../services/confirm-dialog.service';

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './confirm-dialog.component.html',
  styleUrl: './confirm-dialog.component.css'
})
export class ConfirmDialogComponent implements OnInit {
  dialog: ConfirmDialog | null = null;
  isProcessing = false;

  constructor(private confirmDialogService: ConfirmDialogService) {}

  ngOnInit(): void {
    this.confirmDialogService.dialog.subscribe(dialog => {
      this.dialog = dialog;
      this.isProcessing = false;
    });
  }

  async confirm(): Promise<void> {
    if (this.dialog && !this.isProcessing) {
      this.isProcessing = true;
      
      // Small delay to simulate processing
      await new Promise(resolve => setTimeout(resolve, 300));
      
      this.dialog.onConfirm();
      this.close();
    }
  }

  cancel(): void {
    if (this.dialog && this.dialog.onCancel) {
      this.dialog.onCancel();
    }
    this.close();
  }

  close(): void {
    this.confirmDialogService.close();
  }
}
