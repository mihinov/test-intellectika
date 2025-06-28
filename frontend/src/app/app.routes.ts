import { Routes } from '@angular/router';
import { authGuard } from './features/auth/guards/auth.guard';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'account/dashboard' },
	{ path: 'auth', loadComponent: () => import('./layouts/layout-auth/layout-auth'), children: [
		{ path: 'login', loadComponent: () => import('./pages/page-login/page-login') },
		{ path: 'registration', loadComponent: () => import('./pages/page-registration/page-registration') },
		{ path: '', redirectTo: 'login', pathMatch: 'full' },
		{ path: '**', redirectTo: 'login', pathMatch: 'full' }
	] },
  { path: 'account', canActivate: [authGuard], loadComponent: () => import('./layouts/layout-account/layout-account'), children: [
		{ path: '', loadComponent: () => import('./pages/page-account/page-account') },
    { path: 'dashboard', loadComponent: () => import('./pages/page-dashboard/page-dashboard') },
		{ path: '**', redirectTo: 'dashboard', pathMatch: 'full' }
  ]},
  { path: '**', redirectTo: '', pathMatch: 'full' }
];
