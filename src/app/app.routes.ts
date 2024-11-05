import { Routes } from '@angular/router';
import { LayoutComponent } from './page/layout/layout.component';
import { HomeComponent } from './page/home/home.component';
import { BoothsComponent } from './page/booths/booths.component';
import { BookingComponent } from './page/booking/booking.component';
import { LoginComponent } from './page/login/login.component';
import { RegisterComponent } from './page/register/register.component';
import { adminGuard } from './guards/admin.guard';
import { customerGuard } from './guards/customer.guard';
import { loginGuardGuard } from './guards/login-guard.guard';
import { PaymentComponent } from './page/payment/payment.component';
import { MyProfileComponent } from './page/my-profile/my-profile.component';
import { BookBoothComponent } from './page/book-booth/book-booth.component';
import { EditProfileComponent } from './page/edit-profile/edit-profile.component';
import { AdminLayuotComponent } from './page/admin/admin-layuot/admin-layuot.component';
import { AdminEventComponent } from './page/admin/admin-event/admin-event.component';
import { AdminCheckUserComponent } from './page/admin/admin-check-user/admin-check-user.component';

export const routes: Routes = [
    {
        path: '', component: LayoutComponent, 
        children: 
        [
          { path: '', component: HomeComponent }, // หน้าหลัก
          { path: 'login', component: LoginComponent, canActivate: [loginGuardGuard] }, // ใช้ loginGuardGuard
          { path: 'booking', component: BookingComponent, canActivate: [customerGuard]}, // Protected route for customers
          { path: 'booths', component: BoothsComponent, canActivate: [customerGuard] },
          { path: 'register', component: RegisterComponent, canActivate: [loginGuardGuard] },
          { path: 'payment', component: PaymentComponent, canActivate: [customerGuard]},
          { path: 'profile', component: MyProfileComponent, canActivate: [customerGuard]},
          { path: 'edit', component: EditProfileComponent, canActivate: [customerGuard]},
          { path: 'book-booth', component: BookBoothComponent, canActivate: [customerGuard]}
          
        ]
    },
    {
      path: 'admin', component: AdminLayuotComponent, canActivate: [adminGuard],
      children: 
      [
        { path: 'user', component: AdminCheckUserComponent, canActivate: [adminGuard]},
        { path: 'event', component: AdminEventComponent, canActivate: [adminGuard]},


      ]
    },
    { path: '**', redirectTo: '' } // เส้นทาง catch-all สำหรับ 404s
];
