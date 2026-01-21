const leaveChart = {
    leave: {
        chart: {
            height: 255,
            type: 'donut',
            toolbar: {
                show: false,
            }
        },
        plotOptions: {
            bar: {
                horizontal: false,
                columnWidth: '50%'
            },
        },
        dataLabels: {
            enabled: false
        },


        colors: ['#F26522', '#FFC107', '#E70D0D', '#03C95A', '#0C4B5E'],
        responsive: [{
            breakpoint: 480,
            options: {
                chart: {
                    width: 200
                },
                legend: {
                    show: false
                }
            }
        }],
        legend: {
            show: false
        }
    },
    series: [15, 10, 5, 10, 60],
}

const performanceCharts = {
    series: [{
        name: "performance",
        data: [20, 20, 35, 35, 40, 60, 60]
    }],
    performance: {
        chart: {
            height: 273,
            type: 'area',
            zoom: {
                enabled: false
            }
        },
        colors: ['#03C95A'],
        dataLabels: {
            enabled: false
        },
        stroke: {
            curve: 'straight'
        },
        title: {
            text: '',
            align: 'left'
        },
        xaxis: {
            categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
        },
        yaxis: {
            min: 10,
            max: 60,
            tickAmount: 5,
            labels: {
                formatter: (val) => {
                    return val / 1 + 'K'
                }
            }
        },
        legend: {
            position: 'top',
            horizontalAlign: 'left'
        }
    },
};

export { leaveChart,performanceCharts };