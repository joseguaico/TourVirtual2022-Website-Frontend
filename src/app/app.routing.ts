import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthRoutingModule } from './auth/auth.routing';

const routes: Routes = [
    {
        path: 'auth',
        loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule)
    },
    {
        path: '**', redirectTo: 'auth'
    }
];

@NgModule({
    imports: [
        RouterModule.forRoot(routes),
        AuthRoutingModule
    ],
    exports: [RouterModule]
})
export class AppRoutingModule {}
