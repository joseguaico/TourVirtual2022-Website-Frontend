import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthRoutingModule } from './auth/auth.routing';
import { BaseClientesComponent } from './clientes/base-clientes/base-clientes.component';
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
        canActivate: [AuthGuard],
        canLoad: [AuthGuard],
        loadChildren: () => import('./home/home.module').then(m => m.HomeModule)
    },
    {
        path: 'home', redirectTo: ''
    },
    {
        path: 'clientes', component: BaseClientesComponent,
        loadChildren: () => import('./clientes/clientes.module').then(m => m.ClientesModule)
    },
    {
        path: 'ventas', component: BaseVentasComponent,
        loadChildren: () => import('./ventas/ventas.module').then(m => m.VentasModule)
    },
    {
        path: 'propiedades', component: BasePropiedadesComponent,
        loadChildren: () => import('./propiedades/propiedades.module').then(m => m.PropiedadesModule)
    },
    {
        path: 'usuarios', component: BaseUsuariosComponent,
        loadChildren: () => import('./usuarios/usuarios.module').then(m => m.UsuariosModule)
    },
    {
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
