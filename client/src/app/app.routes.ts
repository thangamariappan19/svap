import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        loadComponent: () => import('./features/home/home.component').then(m => m.HomeComponent),
        title: 'Smart Visa Assistant – Home'
    },
    {
        path: 'country/:id',
        loadComponent: () => import('./features/country-overview/country-overview.component').then(m => m.CountryOverviewComponent),
        title: 'Country Visa Overview – Smart Visa Assistant'
    },
    {
        path: 'checklist',
        loadComponent: () => import('./features/checklist/checklist.component').then(m => m.ChecklistComponent),
        title: 'Document Checklist Generator – Smart Visa Assistant'
    },
    {
        path: 'guide',
        loadComponent: () => import('./features/guide/guide.component').then(m => m.GuideComponent),
        title: 'Step-by-Step Visa Guide – Smart Visa Assistant'
    },
    {
        path: 'chat',
        loadComponent: () => import('./features/chat/chat.component').then(m => m.ChatComponent),
        title: 'AI Visa Assistant Chat – Smart Visa Assistant'
    },
    {
        path: 'dashboard',
        loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent),
        title: 'Application Dashboard – Smart Visa Assistant'
    },
    {
        path: '**',
        redirectTo: ''
    }
];
