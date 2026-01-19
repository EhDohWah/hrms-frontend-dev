const expenseAnalysis = {
  series: [
    {
      name: "Sales Analysis",
      data: [10, 30, 18, 15, 22, 30, 40, 50, 40, 40, 60, 70],
    },
  ],
  chart: {
    height: 190,
    type: "area",
    zoom: {
      enabled: false,
    },
  },
  sline: {
    colors: ["#FF9F43"],
    dataLabels: {
        enabled: false,
    },
    stroke: {
        curve: "smooth",
    },
    title: {
        text: "",
        align: "left",
    },
    xaxis: {
        categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep"],
    },
    yaxis: {
        min: 10,
        max: 60,
        tickAmount: 5,
        labels: {
        offsetX: -15,
        formatter: (val) => {
            return val / 1 + "K";
        },
        },
    },
    legend: {
        position: "top",
        horizontalAlign: "left",
    },
    }
};

const invoiceReport = {
    series: [{
      name: 'Total Invoices',
      data: [40, 30, 40, 30, 40, 30]
    }, {
      name: 'Paid Invoices',
      data: [20, 10, 20, 10, 20, 10]
    }],
    chart: {
      height: 250,
      type: 'area'
    },
    sline: {
        dataLabels: {
            enabled: false
        },
        stroke: {
            curve: 'straight'
        },
        xaxis: {
            type: 'category',
            categories: ["January", "February", "March", "April", "May", "June", "July"]
        },
        yaxis: {
            labels: {
            offsetX: -15,
            formatter: function (value) {
                return value + "k"; // Display values with 'k' suffix
            }
            },
        },
        tooltip: {
            x: {
            formatter: function (value) {
                return value; // Tooltip shows month labels
            }
            },
            y: {
            formatter: function (value) {
                return value + "k"; // Tooltip shows amounts with 'k' suffix
            }
            }
        },
        colors: ['#FD3995','#FF9F43'],
        dataLabels: {
            enabled: false
        },
    }
};

const paymentReport = {
    series: [44, 55, 41, 17],
    chart: {
      type: 'donut',
    },
    sline: {
        colors: ['#0DCAF0', '#FD3995', '#AB47BC', '#FFC107'],
        labels: ['Paypal', 'Debit Card', 'Bank Transfer', 'Credit Card'],
        plotOptions: {
        pie: {
            startAngle: -90,
            endAngle: 270,
            stroke: {
            show: true,
            width: 10, // Width of the gap
            colors: ['#FFFFFF'] // Color of the gap
            },
            donut: {
            size: '80%' // Adjusts the size of the donut hole
            }
        }
        },
        dataLabels: {
        enabled: false
        },
        legend: {
        show: false // Set this to false to hide the legend
        },
        annotations: {
        position: 'front', // Ensure it appears above other elements
        style: {
            fontSize: '24px', // Adjust font size
            fontWeight: 'bold',
            color: '#000000' // Change color if needed
        },
        text: {
            // Set the annotation text
            text: '+14%',
            // Optional styling for the text box
            background: {
            enabled: true,
            foreColor: '#FFFFFF', // Text color
            border: '#000000', // Border color
            borderWidth: 1,
            borderRadius: 2,
            opacity: 0.7
            }
        },
        x: '50%', // Center horizontally
        y: '50%', // Center vertically
        },
        responsive: [{
        breakpoint: 480,
        options: {
            chart: {
            width: 200
            },
            legend: {
            show: false // Also hide legend on smaller screens
            }
        }
        }]
    }
};

const projectReport = {
    series: [30, 10, 20, 40],
    chart: {
      width: 280,
      type: 'pie',
    },
    sline: {
        labels: ['Pending', 'On Hold', 'In Progress', 'Completed'], // Set your labels here
        colors: ['#0DCAF0', '#AB47BC', '#FFC107', '#03C95A'], // Custom colors for each segment
        dataLabels: {
        enabled: false // Disable data labels to remove numbers
        },
        legend: {
        show: false // Hide the legend
        },
        tooltip: {
        y: {
            formatter: function(value, { seriesIndex }) {
            return 'Value: ' + value; // Customize the tooltip text
            }
        }
        },
        responsive: [{
        breakpoint: 480,
        options: {
            chart: {
            width: 200
            },
            legend: {
            position: 'bottom'
            }
        }
        }]
    }
};

const taskReports = {
    series: [40, 30, 20, 10],
    chart: {
      type: 'donut',
      width: 220,
    },
    sline: {
        colors: ['#03C95A', '#0DCAF0', '#FFC107', '#AB47BC'],
        labels: ['Completed ', 'Pending', 'Inprogress ', 'On Hold '],
        plotOptions: {
        pie: {
            startAngle: -90,
            endAngle: 270,
            stroke: {
            show: true,
            width: 10, // Width of the gap
            colors: ['#FFFFFF'] // Color of the gap
            },
            donut: {
            size: '80%' // Adjusts the size of the donut hole
            }
        }
        },
        dataLabels: {
        enabled: false
        },
        legend: {
        show: false // Set this to false to hide the legend
        },
        annotations: {
        position: 'front', // Ensure it appears above other elements
        style: {
            fontSize: '24px', // Adjust font size
            fontWeight: 'bold',
            color: '#000000' // Change color if needed
        },
        text: {
            // Set the annotation text
            text: '+14%',
            // Optional styling for the text box
            background: {
            enabled: true,
            foreColor: '#FFFFFF', // Text color
            border: '#000000', // Border color
            borderWidth: 1,
            borderRadius: 2,
            opacity: 0.7
            }
        },
        x: '50%', // Center horizontally
        y: '50%', // Center vertically
        },
        responsive: [{
        breakpoint: 480,
        options: {
            chart: {
            width: 200
            },
            legend: {
            show: false // Also hide legend on smaller screens
            }
        }
        }]
    }
};

const donutAreaChart = {
    series: [80, 20],
    chart: {
      type: 'donut',
      width: 220,
    },
    sline: {
        colors: ['#F26522','#ddd'],
        plotOptions: {
        pie: {
            size: 200,
            stroke: {
            show: true,
            width: 10, // Width of the gap
            height: 10, // Width of the gap
            colors: ['#FFFFFF'] // Color of the gap
            },
            donut: {
                size: '40%' // Adjusts the size of the donut hole
            }
        }
        },
        dataLabels: {
            enabled: false
        },
        legend: {
            show: false // Set this to false to hide the legend
        },
        annotations: {
            x: '50%', // Center horizontally
            y: '50%', // Center vertically
        },
        responsive: [{
        breakpoint: 480,
        options: {
            chart: {
                width: 350
            },
            legend: {
            show: false // Also hide legend on smaller screens
            }
        }
        }]
    }
};

const donutAreaChartOne = {
    series: [70, 30],
    chart: {
      type: 'donut',
      width: 220,
    },
    sline: {
        colors: ['#03C95A','#ddd'],
        plotOptions: {
        pie: {
            size: 200,
            stroke: {
            show: true,
            width: 10, // Width of the gap
            height: 10, // Width of the gap
            colors: ['#FFFFFF'] // Color of the gap
            },
            donut: {
                size: '40%' // Adjusts the size of the donut hole
            }
        }
        },
        dataLabels: {
            enabled: false
        },
        legend: {
            show: false // Set this to false to hide the legend
        },
        annotations: {
            x: '50%', // Center horizontally
            y: '50%', // Center vertically
        },
        responsive: [{
        breakpoint: 480,
        options: {
            chart: {
                width: 350
            },
            legend: {
            show: false // Also hide legend on smaller screens
            }
        }
        }]
    }
};

const donutAreaChartTwo = {
    series: [60, 40],
    chart: {
      type: 'donut',
      width: 220,
    },
    sline: {
        colors: ['#FD3995','#ddd'],
        plotOptions: {
        pie: {
            size: 200,
            stroke: {
            show: true,
            width: 10, // Width of the gap
            height: 10, // Width of the gap
            colors: ['#FFFFFF'] // Color of the gap
            },
            donut: {
                size: '40%' // Adjusts the size of the donut hole
            }
        }
        },
        dataLabels: {
            enabled: false
        },
        legend: {
            show: false // Set this to false to hide the legend
        },
        annotations: {
            x: '50%', // Center horizontally
            y: '50%', // Center vertically
        },
        responsive: [{
        breakpoint: 480,
        options: {
            chart: {
                width: 350
            },
            legend: {
            show: false // Also hide legend on smaller screens
            }
        }
        }]
    }
};

const donutAreaChartThree = {
    series: [40, 60],
    chart: {
      type: 'donut',
      width: 220,
    },
    sline: {
        colors: ['#0DCAF0','#ddd'],
        plotOptions: {
        pie: {
            size: 200,
            stroke: {
            show: true,
            width: 10, // Width of the gap
            height: 10, // Width of the gap
            colors: ['#FFFFFF'] // Color of the gap
            },
            donut: {
                size: '40%' // Adjusts the size of the donut hole
            }
        }
        },
        dataLabels: {
            enabled: false
        },
        legend: {
            show: false // Set this to false to hide the legend
        },
        annotations: {
            x: '50%', // Center horizontally
            y: '50%', // Center vertically
        },
        responsive: [{
        breakpoint: 480,
        options: {
            chart: {
                width: 350
            },
            legend: {
            show: false // Also hide legend on smaller screens
            }
        }
        }]
    }
};

const userChart = {
    series: [{
      name: 'Data',
      data: [34, 44, 54, 21, 12, 43, 33, 23, 66, 66, 58, 29] // Sample data for each month
    }],
    sline: {
        chart: {
        type: 'bar',
        height: 185
        },
        plotOptions: {
        bar: {
            horizontal: false,
            columnWidth: '55%',
            endingShape: 'rounded'
        },
        },
        dataLabels: {
        enabled: false
        },
        stroke: {
        show: true,
        width: 2,
        colors: ['transparent']
        },
        xaxis: {
        categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'], // Months
        },
        fill: {
        opacity: 1
        },
        tooltip: {
        y: {
            formatter: function (val) {
            return val + " units";
            }
        }
        },
        colors: ['#00E396'] // Bar color (green in this case)
    }
};

const employeeReports = {
    series: [{
      name: 'Active Employees',
      data: [50, 55, 57, 56, 61, 58, 63, 60, 66]
    }, {
      name: 'Inactive Employees',
      data: [76, 85, 101, 98, 87, 105, 91, 114, 94]
    }],
    sline: {
        chart: {
            type: 'bar',
            height: 180
        },
        plotOptions: {
            bar: {
            horizontal: false,
            columnWidth: '55%',
            endingShape: 'rounded'
            }
        },
        colors: ['#03C95A', '#E8E9EA'], // Active Employees - Green, Inactive Employees - Gray
        dataLabels: {
            enabled: false, // Disable data labels
        },
        stroke: {
            show: true,
            width: 2,
            colors: ['transparent']
        },
        xaxis: {
            categories: ['Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct']
        },yaxis: {
            labels: {
            offsetX: -15,
            }
        },
        fill: {
            opacity: 1
        },
        legend: {
            show: false
        },
        tooltip: {
            y: {
            formatter: function (val) {
                return "$ " + val + " thousands";
            }
            }
        }
        }
};

const payslipChart = {
    series: [{
    data: [22, 20, 30, 45, 55, 45, 20, 70, 25, 30, 10,30]
  }],
  sline: {
    chart: {
    type: 'line',
    height: 200,
    },
    xaxis: {
        categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct','Nov', 'Dec'],
    labels: {
    }
    },
    stroke: {
        curve: 'stepline',
    },
    dataLabels: {
        enabled: false
    },
    markers: {
        hover: {
            sizeOffset: 4
        }
    },
    colors: ['#FF5733'],
    }
};

var attendanceReport = {
    series: [{
        name: "Present",
        data: [30, 65, 70, 75, 80, 95, 100, 70, 65] // Example data for Present
    }, {
        name: "Absent",
        data: [30, 55, 60, 65, 50, 70, 80, 60, 70] // Example data for Absent
    }],
    sline: {
        chart: {
            height: 200, // Change height here
            type: 'line',
            zoom: {
                enabled: false
            }
        },
        dataLabels: {
            enabled: false
        },
        stroke: {
            curve: 'smooth' // Change to 'smooth' for a nicer appearance
        },
        grid: {
            row: {
                colors: ['#f3f3f3', 'transparent'], // alternating row colors
                opacity: 0.5
            },
        },
        xaxis: {
            categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'],
        },yaxis: {
        labels: {
            offsetX: -15,
        }
        },
        colors: ['#28a745', '#ff69b4'] // Green for Present, Pink for Absent
    }
};

const leaveReport = {
    series: [{
      name: 'Annual Leave',
      data: [30, 40, 35, 50,50,60,30, 40, 35, 50,50,60] // Replace with your data
    }, {
      name: 'Casual Leave',
      data: [20, 30, 25, 40,50,60,20, 30, 25, 40,50,60] // Replace with your data
    }, {
      name: 'Medical Leave',
      data: [15, 10, 20, 15,50,60,15, 10, 20, 15,50,60] // Replace with your data
    }, {
      name: 'Others',
      data: [25, 20, 30, 35,50,60,25, 20, 30, 35,50,60] // Replace with your data
    }, 
  ],
  sline: {
    chart: {
        type: 'bar',
        height: 210, // Change this value to your desired height
        stacked: true,
        stackType: '100%'
    },
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
    xaxis: {
        categories: ['Jan', 'Feb', 'Mar', 'Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec',] // Update to match your time frame
    },
    yaxis: {
        labels: {
        offsetX: -15,
        }
    },
    fill: {
        opacity: 1
    },
    legend: {
        show: false
    },
    colors: ['#03C95A', '#FFC107', '#0C4B5E', '#F26522'], // Set your colors here
    dataLabels: {
        enabled: false // Disable data labels
    }
    }
};

const dailyReport = {
    series: [{
      name: "Present",
      data: [60, 40, 30, 20, 70, ] // Sample data for Present
    }, {
      name: "Absent",
      data: [20, 60, 45, 60, 80,] // Sample data for Absent
    }],
    sline: {
        chart: {
        height: 130, // Changed height
        type: 'line',
        zoom: {
            enabled: false
        }
        },
        dataLabels: {
        enabled: false
        },
        legend: {
        show: false
        },
        stroke: {
        curve: 'smooth' // You can change this to 'straight' if preferred
        },
        grid: {
        row: {
            colors: ['#f3f3f3', 'transparent'],
            opacity: 0.5
        }
        },
        xaxis: {
        categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'],
        },
        yaxis: {
        labels: {
            offsetX: -15,
        }
        },
        colors: ['#4CAF50', '#F44336'] // Green for Present, Red for Absent
    }
};

export { expenseAnalysis,
    invoiceReport,
    paymentReport,
    projectReport,
    donutAreaChart,
    taskReports,
    donutAreaChartOne,
    donutAreaChartTwo,
    donutAreaChartThree,
    userChart,
    employeeReports,
    payslipChart,
    attendanceReport,
    leaveReport,
    dailyReport,
};
