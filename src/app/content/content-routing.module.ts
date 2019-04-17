import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AssignmentListComponent } from './assignment-list/assignment-list.component';
import { ContentFrameComponent } from './content-frame/content-frame.component';
import { AssignmentDetailsComponent } from './assignment-details/assignment-details.component';
import { ReportComponent } from './report/report.component';

const routes: Routes = [
    {path: 'home', component: ContentFrameComponent, children: [
            { path: 'list', component: AssignmentListComponent},
            { path: 'details', component: AssignmentDetailsComponent},
            { path: 'report', component: ReportComponent }
        ]
    }
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ContentRoutingModule { }