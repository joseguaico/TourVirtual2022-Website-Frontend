import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthRoutingModule } from './auth/auth.routing';
import { BaseClientesComponent } from './clientes/base-clientes/base-clientes.component';
import { AuthJwtExpiryGuard } from './guards/auth-jwt-expiry.guard';
import { AuthGuard } from './guards/auth.guard';
import { BaseComponent } from './home/base/base.component';
import { BasePropiedadesComponent } from './propiedades/base-propiedades/base-propiedades.component';
import { BaseUsuariosComponent } from './usuarios/base-usuarios/base-usuarios.component';
import { BaseVentasComponent } from './ventas/base-ventas/base-ventas.component';

const routes: Routes = [
    {
        path: 'auth', loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule)
    },
    {
        path: '',
        component: BaseComponent,
        canActivate: [AuthJwtExpiryGuard],
        canLoad: [AuthJwtExpiryGuard],
        loadChildren: () => import('./home/home.module').then(m => m.HomeModule)
    },
    {        
        path: 'home', redirectTo: 'propiedades'
    },
    {
        canActivate: [AuthJwtExpiryGuard],
        canLoad: [AuthJwtExpiryGuard],
        path: 'clientes', component: BaseClientesComponent,
        loadChildren: () => import('./clientes/clientes.module').then(m => m.ClientesModule)
    },
    {
        canActivate: [AuthJwtExpiryGuard],
        canLoad: [AuthJwtExpiryGuard],
        path: 'ventas', component: BaseVentasComponent,
        loadChildren: () => import('./ventas/ventas.module').then(m => m.VentasModule)
    },
    {
        canActivate: [AuthJwtExpiryGuard],
        canLoad: [AuthJwtExpiryGuard],
        path: 'propiedades', component: BasePropiedadesComponent,
        loadChildren: () => import('./propiedades/propiedades.module').then(m => m.PropiedadesModule)
    },
    {
        canActivate: [AuthJwtExpiryGuard],
        canLoad: [AuthJwtExpiryGuard],
        path: 'usuarios', component: BaseUsuariosComponent,
        loadChildren: () => import('./usuarios/usuarios.module').then(m => m.UsuariosModule)
    },
    {
        canActivate: [AuthJwtExpiryGuard],
        canLoad: [AuthJwtExpiryGuard],
        path: 'account', component: BaseUsuariosComponent,
        loadChildren: () => import('./account/account.module').then(m => m.AccountModule)
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
