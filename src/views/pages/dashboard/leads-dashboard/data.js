const revenueCharts = {
    series: [{
        name: 'Income',
        data: [40, 30, 45, 80, 85, 90, 80, 80, 80, 85, 20, 80]
    }, {
        name: 'Expenses',
        data: [60, 70, 55, 20, 15, 10, 20, 20, 20, 15, 80, 20]
    }],
    income: {
        chart: {
            height: 230,
            type: 'bar',
            stacked: true,
            toolbar: {
                show: false,
            }
        },
        colors: ['#FF6F28', '#F8F9FA'],
        responsive: [{
            breakpoint: 480,
            options: {
                legend: {
                    position: 'bottom',
                    offsetX: -10,
                    offsetY: 0
                }
            }
        }],
        plotOptions: {
            bar: {
                borderRadius: 5,
                borderRadiusWhenStacked: 'all',
                horizontal: false,
                endingShape: 'rounded'
            },
        },
        xaxis: {
            categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            labels: {
                style: {
                    colors: '#6B7280',
                    fontSize: '13px',
                }
            }
        },
        yaxis: {
            min: 0,    // Set the minimum value of the Y-axis to 0
            max: 100,
            labels: {
                offsetX: -15,
                style: {
                    colors: '#6B7280',
                    fontSize: '13px',
                },
                formatter: function (value) {
                    return value + "K"; // Divide by 1000 and append 'K'
                }
            }
        },
        grid: {
            borderColor: 'transparent',
            strokeDashArray: 5,
            padding: {
                left: -8,
            },
        },
        legend: {
            show: false
        },
        dataLabels: {
            enabled: false
        },
        tooltip: {
            y: {
                formatter: function (val) {
                    return val / 10 + " k"
                }
            }
        },
        fill: {
            opacity: 1
        },
    }
};

const heatChart = {
    heat: {
        chart: {
            type: 'heatmap',
            height: 300,
        },
        colors: [
            "#9CA3AF",
            "#F37438",
            "#9CA3AF",
            "#F37438",
            "#9CA3AF",
            "#F37438",
        ],
    },
    series: [
        {
            name: "0",
            data: [{
                x: 'Mon',
                y: 22
            },
            {
                x: 'Tue',
                y: 29
            },
            {
                x: 'Wed',
                y: 13
            },
            {
                x: 'Thu',
                y: 32
            },
            {
                x: 'Fri',
                y: 32
            },
            {
                x: 'Sat',
                y: 32
            },
            {
                x: 'Sun',
                y: 32
            },
            ]
        },
        {
            name: "20",
            data: [{
                x: 'Mon',
                y: 22,
                color: '#ff5722'
            },
            {
                x: 'Tue',
                y: 29
            },
            {
                x: 'Wed',
                y: 13
            },
            {
                x: 'Thu',
                y: 32
            },
            {
                x: 'Fri',
                y: 32
            },
            {
                x: 'Sat',
                y: 32
            },
            {
                x: 'Sun',
                y: 32
            },
            ]
        },
        {
            name: "40",
            data: [{
                x: 'Mon',
                y: 22
            },
            {
                x: 'Tue',
                y: 29
            },
            {
                x: 'Wed',
                y: 13
            },
            {
                x: 'Thu',
                y: 32
            },
            {
                x: 'Fri',
                y: 32
            },
            {
                x: 'Sat',
                y: 32
            },
            {
                x: 'Sun',
                y: 32
            },
            ]
        },
        {
            name: "60",
            data: [{
                x: 'Mon',
                y: 0
            },
            {
                x: 'Tue',
                y: 29
            },
            {
                x: 'Wed',
                y: 13
            },
            {
                x: 'Thu',
                y: 32
            },
            {
                x: 'Fri',
                y: 0
            },
            {
                x: 'Sat',
                y: 0
            },
            {
                x: 'Sun',
                y: 32
            },
            ]
        },
        {
            name: "80",
            data: [{
                x: 'Mon',
                y: 0
            },
            {
                x: 'Tue',
                y: 20
            },
            {
                x: 'Wed',
                y: 13
            },
            {
                x: 'Thu',
                y: 32
            },
            {
                x: 'Fri',
                y: 0
            },
            {
                x: 'Sat',
                y: 0
            },
            {
                x: 'Sun',
                y: 32
            },
            ]
        },
        {
            name: "120",
            data: [{
                x: 'Mon',
                y: 0
            },
            {
                x: 'Tue',
                y: 0
            },
            {
                x: 'Wed',
                y: 75
            },
            {
                x: 'Thu',
                y: 0
            },
            {
                x: 'Fri',
                y: 0
            },
            {
                x: 'Sat',
                y: 0
            },
            {
                x: 'Sun',
                y: 0
            },
            ]
        },
    ]
};

const leadsStageChart = {
    series: [{
        name: 'Income',
        data: [80, 40, 60, 40]
    }, {
        name: 'Expenses',
        data: [100, 100, 100, 100]
    }],
    stageLead: {
        chart: {
            height: 320,
            type: 'bar',
            stacked: true,
            toolbar: {
                show: false,
            }
        },
        colors: ['#FF6F28', '#F8F9FA'],
        responsive: [{
            breakpoint: 480,
            options: {
                legend: {
                    position: 'bottom',
                    offsetX: -10,
                    offsetY: 0
                }
            }
        }],
        plotOptions: {
            bar: {
                horizontal: false,
                endingShape: 'rounded'
            },
        },

        xaxis: {
            categories: ['Competitor', 'Budget', 'Unresponsive', 'Timing'],
            labels: {
                style: {
                    colors: '#6B7280',
                    fontSize: '13px',
                }
            }
        },
        yaxis: {
            labels: {
                style: {
                    colors: '#6B7280',
                    fontSize: '13px',
                }
            }
        },
        grid: {
            borderColor: '#E5E7EB',
            strokeDashArray: 5
        },
        legend: {
            show: false
        },
        dataLabels: {
            enabled: false // Disable data labels
        },
        fill: {
            opacity: 1
        },
    }
};

const donutChart = {
    series: [25, 30, 10, 35], // Percentages for each section
    dount: {
        chart: {
            type: 'donut',
            height: 250,
        },
        labels: ['Paid', 'Google', 'Referals', 'Campaigns'], // Labels for the data
        colors: ['#FFC107', '#0C4B5E', '#AB47BC', '#FD3995'], // Colors from the image
        plotOptions: {
            pie: {
                donut: {
                    size: '70%',
                    labels: {
                        show: true,
                        total: {
                            show: true,
                            label: 'Google',
                            formatter: function (w) {
                                return '40%';
                            }
                        }
                    }
                }
            }
        },
        legend: {
            show: false,
        },
        label: {
            show: false,
        }
    }
};

const donutChart3 = {
    series: [15, 10, 5, 10, 60], // Percentages for each section
    dount3: {
        chart: {
            type: 'donut',
            height: 250,
        },
        labels: ['Paid', 'Google', 'Referals', 'Campaigns', 'Campaigns'], // Labels for the data
        colors: ['#F26522', '#FFC107', '#E70D0D', '#1B84FF', '#0C4B5E'], // Colors from the image
        plotOptions: {
            pie: {
                donut: {
                    size: '70%',
                    labels: {
                        show: true,
                        total: {
                            show: true,
                            label: 'Leads',
                            formatter: function (w) {
                                return '589';
                            }
                        }
                    }
                }
            }
        },
        dataLabels: {
            enabled: false
        },
        legend: {
            show: false,
        },
        label: {
            show: false,
        }
    }
};

export { revenueCharts, heatChart, leadsStageChart, donutChart, donutChart3 }