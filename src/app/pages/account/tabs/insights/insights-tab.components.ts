import { ChangeDetectorRef, Component, Input, OnChanges, OnInit, ViewEncapsulation } from '@angular/core';
import { UtilService } from '@app/services/util/util.service';
import { InsightsDto } from '@app/types/dto/InsightsDto';
import { ViewportService } from '@app/services/viewport/viewport.service';
import * as Highcharts from 'highcharts';
import { APP_NAV_ITEMS } from '../../../../navigation/nav-items';
import { ThemeService } from '@app/services/theme/theme.service';
import {ApiService} from "@app/services/api/api.service";
import {SearchService} from "@app/services/search/search.service";

@Component({
    selector: 'account-insights-tab',
    template: `
        <div class="insights-root" *ngIf="insights" responsive>
            <mat-card class="mat-elevation-z0 divider-border">
                <div class="app-section-title" style="margin-top: 32px">Account Balance Over Time</div>
                <div class="app-section-subtitle" style="margin-bottom: -16px">
                    {{ getGraphSubtitle() }}
                </div>

                <figure responsive class="insights-chart">
                    <div id="container"></div>
                </figure>
            </mat-card>

            <div class="insights-account-stats-container" responsive>
                <mat-card class="mat-elevation-z0 divider-border" [style.marginRight.px]="vp.md || vp.sm ? 0 : 8">
                    <ng-template [ngTemplateOutlet]="received"></ng-template>
                </mat-card>
                <mat-card class="mat-elevation-z0 divider-border" [style.marginLeft.px]="vp.md || vp.sm ? 0 : 8">
                    <ng-template [ngTemplateOutlet]="sent"></ng-template>
                </mat-card>
            </div>
        </div>

        <mat-card class="tab-empty-state mat-elevation-z0 divider-border" *ngIf="isLoadingInsights">
            <blui-empty-state
                responsive
                class="account-empty-state"
                title="Loading"
                description="One second, counting them 'nanners.  Larger accounts will take longer."
            >
                <mat-icon blui-empty-icon>pending</mat-icon>
            </blui-empty-state>
        </mat-card>

        <mat-card *ngIf="hasError" class="tab-empty-state mat-elevation-z0 divider-border">
            <app-error></app-error>
        </mat-card>

        <mat-card
            class="tab-empty-state mat-elevation-z0 divider-border"
            *ngIf="!insights && !isLoadingInsights && !hasError"
        >
            <blui-empty-state
                responsive
                class="account-empty-state"
                title="No Insights"
                [description]="getErrorDescription()"
            >
                <mat-icon blui-empty-icon>disc_full</mat-icon>
            </blui-empty-state>
        </mat-card>

        <ng-template #sent>
            <div class="warn section-title">Sent Statistics</div>
            <mat-divider></mat-divider>
            <mat-list [style.paddingTop.px]="0">
                <blui-info-list-item [wrapSubtitle]="true" divider="full" [hidePadding]="true">
                    <div blui-title>Total BAN Sent</div>
                    <div blui-subtitle class="text-secondary">{{ formatBan(insights.totalAmountSent) }} BAN</div>
                </blui-info-list-item>
                <blui-info-list-item [wrapSubtitle]="true" divider="full" [hidePadding]="true">
                    <div blui-title>Largest Tx Sent</div>
                    <div blui-subtitle class="text-secondary">{{ formatBan(insights.maxAmountSent) }} BAN</div>
                    <a
                        blui-right-content
                        class="link mat-overline text-hint"
                        [routerLink]="'/' + navItems.hash.route + '/' + insights.maxAmountSentHash"
                    >
                        hash
                    </a>
                </blui-info-list-item>

                <blui-info-list-item [wrapSubtitle]="true" divider="full" [hidePadding]="true">
                    <div blui-title># Tx Sent</div>
                    <div blui-subtitle class="text-secondary">{{ numberWithComas(insights.totalTxSent) }}</div>
                </blui-info-list-item>

                <blui-info-list-item [wrapSubtitle]="true" divider="full" [hidePadding]="true">
                    <div blui-title>First-Sent Date</div>
                    <div blui-subtitle class="text-secondary">{{ formatDate(insights.firstOutTxUnixTimestamp) }}</div>
                    <a
                        blui-right-content
                        class="link mat-overline text-hint"
                        [routerLink]="'/' + navItems.hash.route + '/' + insights.firstOutTxHash"
                    >
                        hash
                    </a>
                </blui-info-list-item>

                <blui-info-list-item [wrapSubtitle]="true" divider="full" [hidePadding]="true">
                    <div blui-title>Last-Sent Date</div>
                    <div blui-subtitle class="text-secondary">{{ formatDate(insights.lastOutTxUnixTimestamp) }}</div>
                    <a
                        blui-right-content
                        class="link mat-overline text-hint"
                        [routerLink]="'/' + navItems.hash.route + '/' + insights.lastOutTxHash"
                    >
                        hash
                    </a>
                </blui-info-list-item>
                <blui-info-list-item [wrapSubtitle]="true" divider="full" [hidePadding]="true">
                    <div blui-title>Most Common Recipient</div>
                    <div blui-subtitle class="text-secondary">
                        <div *ngIf="insights.mostCommonRecipientAddress">
                            Sent BAN
                            <strong style="margin: 0 4px"> {{ insights.mostCommonRecipientTxCount }} </strong> times to
                            recipient.
                        </div>
                        <div *ngIf="!insights.mostCommonRecipientAddress">This account has never sent any BAN.</div>
                    </div>
                    <a
                        blui-info
                        *ngIf="vp.sm"
                        class="link text-secondary"
                        [routerLink]="'/' + navItems.account.route + '/' + insights.mostCommonRecipientAddress"
                    >
                        {{ shortenAddr(insights.mostCommonRecipientAddress) }}
                    </a>
                    <a
                        blui-right-content
                        *ngIf="!vp.sm"
                        class="link text-hint"
                        [routerLink]="'/' + navItems.account.route + '/' + insights.mostCommonRecipientAddress"
                    >
                        {{ shortenAddr(insights.mostCommonRecipientAddress) }}
                    </a>
                </blui-info-list-item>
            </mat-list>
        </ng-template>

        <ng-template #received>
            <div class="primary section-title">Received Statistics</div>
            <mat-divider></mat-divider>
            <mat-list [style.paddingTop.px]="0">
                <blui-info-list-item [wrapSubtitle]="true" divider="full" [hidePadding]="true">
                    <div blui-title>Total BAN Received</div>
                    <div blui-subtitle class="text-secondary">{{ formatBan(insights.totalAmountReceived) }} BAN</div>
                </blui-info-list-item>
                <blui-info-list-item [wrapSubtitle]="true" divider="full" [hidePadding]="true">
                    <div blui-title>Largest Tx Received</div>
                    <div blui-subtitle class="text-secondary">{{ formatBan(insights.maxAmountReceived) }} BAN</div>
                    <a
                        blui-right-content
                        class="link mat-overline text-hint"
                        [routerLink]="'/' + navItems.hash.route + '/' + insights.maxAmountReceivedHash"
                    >
                        hash
                    </a>
                </blui-info-list-item>

                <blui-info-list-item [wrapSubtitle]="true" divider="full" [hidePadding]="true">
                    <div blui-title># Tx Received</div>
                    <div blui-subtitle class="text-secondary">{{ numberWithComas(insights.totalTxReceived) }}</div>
                </blui-info-list-item>

                <blui-info-list-item [wrapSubtitle]="true" divider="full" [hidePadding]="true">
                    <div blui-title>First-Received Date</div>
                    <div blui-subtitle class="text-secondary">{{ formatDate(insights.firstInTxUnixTimestamp) }}</div>
                    <a
                        blui-right-content
                        class="link mat-overline text-hint"
                        [routerLink]="'/' + navItems.hash.route + '/' + insights.firstInTxHash"
                    >
                        hash
                    </a>
                </blui-info-list-item>
                <blui-info-list-item [wrapSubtitle]="true" divider="full" [hidePadding]="true">
                    <div blui-title>Last-Received Date</div>
                    <div blui-subtitle class="text-secondary">{{ formatDate(insights.lastInTxUnixTimestamp) }}</div>
                    <a
                        blui-right-content
                        class="link mat-overline text-hint"
                        [routerLink]="'/' + navItems.hash.route + '/' + insights.lastInTxHash"
                    >
                        hash
                    </a>
                </blui-info-list-item>

                <blui-info-list-item [wrapSubtitle]="true" divider="full" [hidePadding]="true">
                    <div blui-title>Most Common Sender</div>
                    <div blui-subtitle class="text-secondary">
                        Received BAN
                        <strong style="margin: 0 4px">{{ insights.mostCommonSenderTxCount }}</strong> times from sender.
                    </div>
                    <a
                        blui-info
                        *ngIf="vp.sm"
                        class="link text-secondary"
                        [routerLink]="'/' + navItems.account.route + '/' + insights.mostCommonSenderAddress"
                    >
                        {{ shortenAddr(insights.mostCommonSenderAddress) }}
                    </a>
                    <a
                        blui-right-content
                        *ngIf="!vp.sm"
                        class="link text-hint"
                        [routerLink]="'/' + navItems.account.route + '/' + insights.mostCommonSenderAddress"
                    >
                        {{ shortenAddr(insights.mostCommonSenderAddress) }}
                    </a>
                </blui-info-list-item>
                <blui-info-list-item [wrapSubtitle]="true" divider="full" [hidePadding]="true">
                    <div blui-title>Account Max Balance</div>
                    <div blui-subtitle class="text-secondary">{{ formatBan(insights.maxBalance) }} BAN</div>
                    <a
                        blui-right-content
                        class="link mat-overline text-hint"
                        [routerLink]="'/' + navItems.hash.route + '/' + insights.maxBalanceHash"
                    >
                        hash
                    </a>
                </blui-info-list-item>
            </mat-list>
        </ng-template>
    `,
    styleUrls: ['insights-tab.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class InsightsTabComponent implements OnChanges, OnInit {
    @Input() address: string;
    @Input() insights: InsightsDto;
    @Input() hasError: boolean;
    @Input() blockCount: number;
    @Input() isLoadingInsights: boolean;
    @Input() maxInsightsLimit;

    navItems = APP_NAV_ITEMS;
    isLoadingBlock: boolean;
    Highcharts: typeof Highcharts = Highcharts;

    constructor(
        public vp: ViewportService,
        private readonly _util: UtilService,
        private readonly _themeService: ThemeService,
        private readonly _apiService: ApiService,
        private readonly _ref: ChangeDetectorRef,
        private readonly _searchService: SearchService,
    ) {
        this.vp.vpChange.subscribe(() => {
            setTimeout(() => {
                window.dispatchEvent(new Event('resize'));
            });
        });
    }

    ngOnInit(): void {
        window['plausible']('Insights Generated', {
            props: {
                address: this.address,
                size: this.blockCount,
            },
        });
    }

    ngOnChanges(): void {
        if (this.insights) {
            const chartData = [];
            for (const key of Object.keys(this.insights.heightBalances)) {
                chartData.push([key, this.insights.heightBalances[key]]);
            }
            this._graphChart(chartData);
        }
    }

    private _graphChart(chartData: Array<[]>): void {
        this._ref.detectChanges();
        Highcharts.setOptions({
            chart: {
                style: {
                    fontFamily: 'Helvetica',
                },
            },
        });

        // @ts-ignore
        Highcharts.chart('container', {
            credits: {
                enabled: false,
            },
            chart: {
                zoomType: 'x',
            },
            title: {
                text: undefined,
            },
            /*   title: {
                text: 'Account Balance Over Time'
            },
            subtitle: {
                text: document.ontouchstart === undefined ?
                    'Click and drag in the plot area to zoom in' : 'Pinch the chart to zoom in'
            }, */
            xAxis: {
                type: 'number',
            },
            tooltip: {
                lang: {
                    thousandsSep: ',',
                },

                formatter: function () {
                    const toComma = (x: any): string => x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
                    let balance = Number(this.y.toFixed(3));
                    if (balance > 100_000) {
                        balance = Math.round(balance);
                    }

                    let lastBlockDiff = 0;
                    if (this.x !== 0) {
                        lastBlockDiff = Number(this.y) - Number(this.series.data[Number(this.x - 1)].y);
                    }

                    return `<div style="font-size: 14px"><div>Block <strong>${
                        this.key
                    }</strong></div><br /><div>Balance <strong>${toComma(
                        balance
                    )}</strong></div><br /><div style="display: ${
                        this.x === 0 ? 'none' : 'block'
                    }"><div style="margin-right: 4px">${lastBlockDiff > 0 ? 'Receive ' : 'Send '}</div><span>${
                        lastBlockDiff > 0 ? '+' : ''
                    }</span><strong>${toComma(Number(lastBlockDiff.toFixed(3)))}</strong></div></div>`;
                },
            },
            yAxis: {
                //type: 'logarithmic',
                labels: {
                    enabled: true,
                    /*
                    formatter: (x) => {
                        console.log(x);
                    }, */
                },
                gridLineColor: this._themeService.isLightMode() ? 'rgba(66, 78, 84, 0.12)' : 'rgb(161, 167, 170, .36)',
                type: 'number',
                title: {
                    text: undefined,
                },
            },
            legend: {
                enabled: true,
            },
            plotOptions: {
                area: {
                    events: {
                        click: (e: any) => {

                            if (this.isLoadingBlock) {
                                return;
                            }
                            const height = Number(e.point.name);
                            this.isLoadingBlock = true;
                            this._apiService.fetchBlockFromAddressHeight(this.address, height)
                                .then((block) => {
                                    this._searchService.emitSearch(block.hash, false)
                                }).catch((err) => {
                                    console.error(err);
                                }).finally(() => {
                                    this.isLoadingBlock = false;
                            });
                        },
                    },
                    fillColor: {
                        linearGradient: {
                            x1: 0,
                            y1: 0,
                            x2: 0,
                            y2: 1,
                        },
                        stops: [
                            [0, '#4cbf4b'],
                            [1, Highcharts.color('#4cbf4b').setOpacity(0).get('rgba')],
                        ],
                    },
                    marker: {
                        radius: 2,
                    },
                    lineColor: 'gray',
                    lineWidth: 1,
                    states: {
                        hover: {
                            lineWidth: 1,
                        },
                    },
                    threshold: null,
                },
            },

            series: [
                {
                    turboThreshold: this.maxInsightsLimit,
                    //\  type: 'spline',
                    color: '#249b23',
                    type: 'area',
                    name: 'BAN Balance',
                    data: chartData,
                },
            ],
        });
    }

    formatBan(ban: number): string {
        return this._util.numberWithCommas(ban);
    }

    shortenAddr(addr: string): string {
        if (!addr) {
            return 'N/A';
        }
        return this._util.shortenAddress(addr);
    }

    formatDate(unixTimestamp: number): string {
        if (unixTimestamp) {
            return `${new Date(unixTimestamp * 1000).toLocaleDateString()}, ${new Date(
                unixTimestamp * 1000
            ).toLocaleTimeString()}`;
        }
        return 'N/A';
    }

    getGraphSubtitle(): string {
        return document.ontouchstart === undefined
            ? 'Click and drag in the plot area to zoom in.'
            : 'Pinch the chart to zoom in.';
    }

    numberWithComas(num: number): string {
        return this._util.numberWithCommas(num);
    }

    getErrorDescription(): string {
        if (this.blockCount === 0) {
            return 'This account needs to receive a block before it can be analyzed.';
        }
        return 'This account has too many transactions to analyze.  Please select an account with less activity.';
    }
}
