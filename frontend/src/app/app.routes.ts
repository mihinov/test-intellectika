import { Routes } from '@angular/router';
import { authGuard } from './features/auth/guards/auth.guard';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
  {  path: 'login', loadComponent: () => import('./layouts/layout-auth/layout-auth'), children: [
    { path: '', loadComponent: () => import('./pages/page-login/page-login') }
  ] },
	{ path: 'registration', loadComponent: () => import('./layouts/layout-auth/layout-auth'), children: [
		{ path: '', loadComponent: () => import('./pages/page-registration/page-registration') }
	]},
  { path: 'dashboard', canActivate: [authGuard], loadComponent: () => import('./layouts/layout-dashboard/layout-dashboard'), children: [
    { path: '', loadComponent: () => import('./pages/page-dashboard/page-dashboard') }
  ]},
  { path: '**', redirectTo: 'dashboard', pathMatch: 'full' }
];
