import { NgModule } from '@angular/core';
import { Routes, RouterModule, CanActivate } from '@angular/router';

import { AssignmentListComponent } from './assignment-list/assignment-list.component';
import { ContentFrameComponent } from './content-frame/content-frame.component';
import { AssignmentDetailsComponent } from './assignment-details/assignment-details.component';
import { ReportComponent } from './report/report.component';
import { AddHoursComponent } from './add-hours/add-hours.component';
import { ReportsListComponent } from './reports-list/reports-list.component';

import { AuthGuardService as AuthGuard } from '../authServices/auth-guard.service';

const routes: Routes = [
    {path: 'home', component: ContentFrameComponent, children: [
            { path: 'assignments-list', component: AssignmentListComponent, canActivate: [AuthGuard]},
            { path: 'details', component: AssignmentDetailsComponent, canActivate: [AuthGuard]},
            { path: 'reports-list', component: ReportsListComponent, canActivate: [AuthGuard]},
            { path: 'report', component: ReportComponent, canActivate: [AuthGuard] },
            { path: 'hours', component:  AddHoursComponent, canActivate: [AuthGuard]}
        ]
    }
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ContentRoutingModule { }