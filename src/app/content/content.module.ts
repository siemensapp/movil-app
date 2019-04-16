import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AssignmentListComponent } from './assignment-list/assignment-list.component';
import { ContentFrameComponent } from './content-frame/content-frame.component';
import { ContentRoutingModule } from './content-routing.module';
import { AssignmentDetailsComponent } from './assignment-details/assignment-details.component';
import { EsriMapComponent } from './esri-map/esri-map.component';
import { ReportComponent } from './report/report.component';


@NgModule({
  declarations: [AssignmentListComponent, ContentFrameComponent, AssignmentDetailsComponent, EsriMapComponent, ReportComponent],
  imports: [
    CommonModule,
    ContentRoutingModule
  ]
})
export class ContentModule { }
