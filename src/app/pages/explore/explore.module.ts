import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

//pxblue modules
import { EmptyStateModule, InfoListItemModule, ListItemTagModule } from '@pxblue/angular-components';

//material modules
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTabsModule } from '@angular/material/tabs';

// app
import { AccountComponent } from './account/account.component';
import { ExploreComponent } from './explore.component';
import { MatBadgeModule } from '@angular/material/badge';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { PendingTabComponent } from '@app/pages/explore/account/tabs/pending/pending-tab.component';
import { ConfirmedTabComponent } from '@app/pages/explore/account/tabs/confirmed/confirmed-tab.component';
import { DelegatorsTabComponent } from '@app/pages/explore/account/tabs/delegators/delegators-tab.components';
import { HashComponent } from '@app/pages/explore/hash/hash.component';
import { InsightsTabComponent } from '@app/pages/explore/account/tabs/insights/insights-tab.components';
import { HighchartsChartModule } from 'highcharts-angular';
import { MatDialogModule } from '@angular/material/dialog';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppCommonModule } from '@app/common/app-common.module';

@NgModule({
    declarations: [
        AccountComponent,
        ConfirmedTabComponent,
        DelegatorsTabComponent,
        ExploreComponent,
        HashComponent,
        PendingTabComponent,
        InsightsTabComponent,
    ],
    imports: [
        AppCommonModule,
        BrowserAnimationsModule,
        CommonModule,
        EmptyStateModule,
        InfoListItemModule,
        ListItemTagModule,
        MatBadgeModule,
        MatButtonModule,
        MatCardModule,
        MatDialogModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        MatProgressSpinnerModule,
        MatTabsModule,
        MatTableModule,
        ReactiveFormsModule,
        HighchartsChartModule,
    ],
    exports: [
        AccountComponent,
        ConfirmedTabComponent,
        DelegatorsTabComponent,
        ExploreComponent,
        HashComponent,
        PendingTabComponent,
    ],
})
export class ExploreModule {}
