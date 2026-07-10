import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { map } from 'rxjs';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { LoadingService } from '../../service/loading.service';

@Component({
  selector: 'app-loading-overlay',
  standalone: true,
  imports: [AsyncPipe, ProgressSpinnerModule],
  templateUrl: './loading-overlay.component.html',
  styleUrl: './loading-overlay.component.css'
})
export class LoadingOverlayComponent {
  private readonly loadingService = inject(LoadingService);

  readonly isLoading$ = this.loadingService.loading$.pipe(
    map((count) => count > 0)
  );
}
