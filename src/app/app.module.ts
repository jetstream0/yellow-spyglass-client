import { BrowserModule } from '@angular/platform-browser';
import { Component, NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { RouterModule } from '@angular/router';

//pxblue modules
import { DrawerModule, EmptyStateModule, ListItemTagModule, UserMenuModule } from '@pxblue/angular-components';

//material modules
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

// app
import { AppRoutingModule } from './app.routing';
import { NavigationComponent } from './navigation/navigation.component';
import { HttpClientModule } from '@angular/common/http';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTabsModule } from '@angular/material/tabs';
import { ExploreModule } from './pages/explore/explore.module';
import { BookmarksComponent } from '@app/pages/bookmarks/bookmarks.component';
import { MatTableModule } from '@angular/material/table';
import { ComingSoonComponent } from '@app/pages/coming-soon/coming-soon.component';
import { RepresentativesComponent } from '@app/pages/representatives/representatives.component';
import { MatSortModule } from '@angular/material/sort';

import { HighchartsChartModule } from 'highcharts-angular';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatExpansionModule } from '@angular/material/expansion';
import {MonitorComponent} from "@app/pages/monitor/monitor.component";

@Component({
    selector: 'app-root',
    template: `<app-navigation></app-navigation>`,
})
export class AppComponent {}

@NgModule({
    declarations: [
        AppComponent,
        BookmarksComponent,
        NavigationComponent,
        RepresentativesComponent,
        ComingSoonComponent,
        MonitorComponent,
    ],
    imports: [
        AppRoutingModule,
        BrowserAnimationsModule,
        BrowserModule,
        CommonModule,
        DrawerModule,
        EmptyStateModule,
        ExploreModule,
        FlexLayoutModule,
        FormsModule,
        HttpClientModule,
        MatButtonModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        MatProgressSpinnerModule,
        MatTabsModule,
        MatToolbarModule,
        ListItemTagModule,
        RouterModule,
        ReactiveFormsModule,
        UserMenuModule,
        MatTableModule,
        MatSortModule,
        MatSlideToggleModule,
        MatExpansionModule,
        HighchartsChartModule,
    ],
    bootstrap: [AppComponent],
})
export class AppModule {}
