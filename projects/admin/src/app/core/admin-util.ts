import { HttpErrorResponse } from '@angular/common/http';

/**
 * Public URL for a stored relative asset path (e.g. "projects/foo.png").
 * Images are served at the admin root via an asset mapping (see angular.json).
 */
export function assetUrl(path: string): string {
  return '/' + path;
}

/** Human-readable message for an error returned by the admin API. */
export function apiErrorMessage(err: HttpErrorResponse): string {
  if (err.status === 0) {
    return 'Cannot reach the admin API. Is it running?  →  npm run start:admin:api';
  }
  return err.error?.error ?? err.message ?? 'Unexpected error';
}
