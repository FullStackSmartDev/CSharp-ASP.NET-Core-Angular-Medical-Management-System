import { NgModule } from '@angular/core';
import { RootLoginComponent } from './components/root-login/root-login.component';
import { DxFormModule } from 'devextreme-angular/ui/form';
import { DxButtonModule } from 'devextreme-angular/ui/button';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './components/login/login.component';

@NgModule({
    imports: [
        DxFormModule,
        DxButtonModule,
        CommonModule
    ],
    declarations: [RootLoginComponent, LoginComponent]
})
export class RegistrationModule { }