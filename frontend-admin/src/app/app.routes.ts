import { Routes } from '@angular/router';
import { authGuard } from './features/auth/guards/auth.guard';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
  {  path: 'login', loadComponent: () => import('./layouts/layout-login/layout-login'), children: [
    { path: '', loadComponent: () => import('./pages/page-login/page-login') }
  ] },
  { path: 'dashboard', canActivate: [authGuard], loadComponent: () => import('./layouts/layout-dashboard/layout-dashboard'), children: [
    { path: '', loadComponent: () => import('./pages/page-dashboard/page-dashboard') }
  ]},
  { path: '**', redirectTo: 'dashboard', pathMatch: 'full' }
];
