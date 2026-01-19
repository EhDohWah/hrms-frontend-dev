const empDepartment = {
    department: {
        chart: {
            height: 220,
            type: 'bar',
            padding: {
                top: 0,
                left: 0,
                right: 0,
                bottom: 0
            },
            toolbar: {
                show: false,
            }
        },
        colors: ['#FF6F28'],
        grid: {
            borderColor: '#E5E7EB',
            strokeDashArray: 5,
            padding: {
                top: -20,
                left: 0,
                right: 0,
                bottom: 0
            }
        },
        plotOptions: {
            bar: {
                borderRadius: 5,
                horizontal: true,
                barHeight: '35%',
                endingShape: 'rounded'
            }
        },
        dataLabels: {
            enabled: false
        },
        xaxis: {
            categories: ['UI/UX', 'Development', 'Management', 'HR', 'Testing', 'Marketing'],
            labels: {
                style: {
                    colors: '#111827',
                    fontSize: '13px',
                }
            }
        },
    },
    series: [{
        data: [80, 110, 80, 20, 60, 100],
        name: 'Employee'
    }],

}

const salesIncome = {
  inCome : {
      chart: {
    height: 290,
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
      categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct','Nov', 'Dec'],
      labels: {
        style: {
          colors: '#6B7280', 
          fontSize: '13px',
        }
      }
    },
    yaxis: {
      labels: {
        offsetX: -15,
        style: {
          colors: '#6B7280', 
          fontSize: '13px',
        }
      }
    },
    grid: {
      borderColor: '#E5E7EB',
      strokeDashArray: 5,
      padding: {
        left: -8,
      },
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
  },
  series: [{
    name: 'Income',
    data: [40, 30, 45, 80, 85, 90, 80, 80, 80, 85, 20, 80]
  }, {
    name: 'Expenses',
    data: [60, 70, 55, 20, 15, 10, 20, 20, 20, 15, 80, 20]
  }],
}

const attendancejs = {
  type: 'doughnut', // Chart type
  data: {
    labels: ['Late','Present', 'Permission', 'Absent'],
    datasets: [{
    label: 'Semi Donut',
    data: [40, 20, 30, 10],
    backgroundColor: ['#0C4B5E', '#03C95A', '#FFC107', '#E70D0D'],
    borderWidth: 5,
    borderRadius: 10,
      borderColor: '#fff', // Border between segments
      hoverBorderWidth: 0,   // Border radius for curved edges
      cutout: '60%',   
    }]
  },
  options: {
    rotation: -100,
    circumference: 200,
    layout: {
      padding: {
        top: -20,    // Set to 0 to remove top padding
        bottom: -20, // Set to 0 to remove bottom padding
      }
    },
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false // Hide the legend
      }
    },
  }
}

const mySemiDonutChartjs = {
  type: 'doughnut', // Chart type
  data: {
  labels: ['Ongoing','Onhold', 'Completed', 'Overdue'],
  datasets: [{
    label: 'Semi Donut',
    data: [20, 40, 20, 10],
    backgroundColor: ['#FFC107', '#1B84FF', '#03C95A', '#E70D0D'],
    borderWidth: -10,
    borderColor: 'transparent', // Border between segments
    hoverBorderWidth: 0,   // Border radius for curved edges
    cutout: '75%',   
    spacing: -30,
  }]
  },
  options: {
    rotation: -100,
    circumference: 185,
    layout: {
      padding: {
        top: -20,    // Set to 0 to remove top padding
        bottom: 20, // Set to 0 to remove bottom padding
      }
    },
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false // Hide the legend
      }
    },elements: {
      arc: {
        borderWidth: -30, // Ensure consistent overlap
        borderRadius: 30, // Add some rounding
      }
    },
  }
}

export { empDepartment,salesIncome, attendancejs, mySemiDonutChartjs };