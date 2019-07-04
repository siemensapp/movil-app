import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AssignmentListComponent } from './assignment-list/assignment-list.component';
import { ContentFrameComponent } from './content-frame/content-frame.component';
import { ContentRoutingModule } from './content-routing.module';
import { AssignmentDetailsComponent } from './assignment-details/assignment-details.component';
import { EsriMapComponent } from './esri-map/esri-map.component';
import { ReportComponent } from './report/report.component';
import { AddHoursComponent } from './add-hours/add-hours.component';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { JwtModule } from '@auth0/angular-jwt';
import { HttpClientModule  } from '@angular/common/http';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from 'src/environments/environment.prod';
import { PushNotificationService } from '../pushService/push-notification.service';
import { ReportsListComponent } from './reports-list/reports-list.component';


export function tokenGetter() {
  return localStorage.getItem('access_token');
}


@NgModule({
  declarations: [AssignmentListComponent, ContentFrameComponent, AssignmentDetailsComponent, EsriMapComponent, ReportComponent, AddHoursComponent, ReportsListComponent],
  imports: [
    JwtModule.forRoot({
      config: {
        tokenGetter: tokenGetter
      }
    }),
    CommonModule,
    ContentRoutingModule,
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
    NgxMaterialTimepickerModule,
    BrowserAnimationsModule,
    HttpClientModule,
    ServiceWorkerModule.register('../ngsw-config.json', {
      enabled: environment.production
    })
  ],
  providers: [PushNotificationService]
})
export class ContentModule { }
