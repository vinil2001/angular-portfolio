import { HttpInterceptorFn } from '@angular/common/http';

/**
 * Attaches an X-Admin-Token header to `/api` requests when a token is present
 * in localStorage. This pairs with the backend's optional write gate
 * (ADMIN_API_TOKEN). With no token stored, requests go out unmodified — the
 * default local-only setup needs no auth.
 *
 * To enable: run the API with ADMIN_API_TOKEN set, then in the admin app run
 * `localStorage.setItem('adminToken', '<same value>')` once in the console.
 */
export const adminTokenInterceptor: HttpInterceptorFn = (req, next) => {
  if (req.url.startsWith('/api')) {
    const token = localStorage.getItem('adminToken');
    if (token) {
      req = req.clone({ setHeaders: { 'X-Admin-Token': token } });
    }
  }
  return next(req);
};
