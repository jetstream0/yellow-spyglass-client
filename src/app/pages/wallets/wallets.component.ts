import { Component, OnInit } from '@angular/core';
import { ViewportService } from '@app/services/viewport/viewport.service';
import { SearchService } from '@app/services/search/search.service';
import { ApiService } from '@app/services/api/api.service';
import { AccountBalance, AccountDistributionStats } from '@app/types/dto';
import { Options } from 'highcharts';
import * as Highcharts from 'highcharts';
import { UtilService } from '@app/services/util/util.service';

@Component({
    selector: 'app-wallets',
    templateUrl: 'wallets.component.html',
    styleUrls: ['./wallets.component.scss'],
})
export class WalletsComponent implements OnInit {
    Highcharts: typeof Highcharts = Highcharts;
    loading = true;
    distributionChart: Options;
    accountBalances: AccountBalance[] = [];
    columns = ['position', 'addr', 'ban'];
    currentPage = 0;
    totalAccounts: number;
    loadingNewAccountBalancePage = false;
    pageSize = 25;

    constructor(
        public util: UtilService,
        private _api: ApiService,
        public vp: ViewportService,
        public searchService: SearchService
    ) {
        this.vp.vpChange.subscribe(() => {
            setTimeout(() => {
                window.dispatchEvent(new Event('resize'));
            });
        });
    }

    ngOnInit(): void {
        Promise.all([this._api.bananoDistribution(), this._api.getAccountBalances(0)])
            .then((data) => {
                this.distributionChart = this._createDistributionChart(data[0]);
                this.accountBalances = data[1];
                this.totalAccounts = data[0].totalAccounts;
                this.loading = false;
            })
            .catch((err) => {
                console.error(err);
            });
    }

    loadAccountBalances(currPage: number): void {
        this.currentPage = currPage;
        this.loadingNewAccountBalancePage = true;
        this._api
            .getAccountBalances(currPage)
            .then((data) => {
                this.accountBalances = data;
                this.loadingNewAccountBalancePage = false;
            })
            .catch((err) => {
                console.error(err);
                this.loadingNewAccountBalancePage = false;
            });
    }

    _createDistributionChart(data: AccountDistributionStats): Options {
        return {
            chart: {
                type: 'column',
                backgroundColor: 'rgba(0,0,0,0)',
            },
            tooltip: {
                enabled: false,
            },
            credits: {
                enabled: false,
            },
            title: {
                text: '',
            },
            xAxis: {
                categories: [
                    '.001 - .01',
                    '.01 - .1',
                    '.1 - 1',
                    '1 - 10',
                    '10 - 100',
                    '100 - 1K',
                    '1K - 10K',
                    '10K - 100K',
                    '100K - 1M',
                    '1M - 10M',
                    '10M - 100M',
                    '100M - 1B',
                ],
            },
            yAxis: {
                min: 0,
                title: {
                    text: '',
                },
                labels: {
                    enabled: false,
                },
            },
            plotOptions: {
                column: {
                    pointPadding: 0.2,
                    borderWidth: 0,
                },
                series: {
                    dataLabels: {
                        enabled: true,
                    },
                },
            },
            series: [
                {
                    name: 'Opened Accounts',
                    type: 'bar',
                    color: '#FBDD11',
                    data: [
                        data.number0_001,
                        data.number0_01,
                        data.number0_1,
                        data.number1,
                        data.number10,
                        data.number100,
                        data.number1_000,
                        data.number10_000,
                        data.number100_000,
                        data.number1_000_000,
                        data.number10_000_000,
                        data.number100_000_000,
                    ],
                    dataLabels: {
                        style: {
                            fontSize: '12px',
                            fontWeight: '400',
                            fontFamily: 'Open Sans',
                            textOutline: 'none',
                        },
                    },
                },
            ],
        };
    }
}
