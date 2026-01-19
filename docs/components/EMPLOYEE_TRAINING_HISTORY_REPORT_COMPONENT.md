# Employee Training History Report Component Documentation

## 📋 Overview

The Employee Training History Report component (`employee-training-history-report.vue`) is a specialized reporting component that generates comprehensive training history reports for individual employees. It allows users to track all trainings completed by specific employees within a selected date range, providing valuable insights for employee development and compliance tracking.

## 🎯 Component Purpose

**Primary Function**: Generate reports showing all trainings completed by individual employees
**Use Cases**:
- Employee development tracking
- Skills assessment and planning
- Compliance verification for individual employees
- Performance review support
- Training record maintenance

## 📁 File Location

```
src/components/reports/employee-training-history-report.vue
```

## 🔧 Component Structure

### Template Structure

```vue
<template>
  <ReportRow :report="report" @preview="preview" @export-pdf="exportPDF" @export-excel="exportExcel" @export-csv="exportCSV">
    <template #input>
      <div class="d-flex gap-2 align-items-center" style="width: 100%;">
        <!-- Date Range Input - Primary filter -->
        <div class="input-icon-end position-relative" style="flex: 2; min-width: 200px;">
          <input type="text" ref="dateInput" class="form-control" placeholder="Select date range" />
          <span class="input-icon-addon">
            <i class="ti ti-calendar"></i>
          </span>
        </div>

        <!-- Staff ID Input - Secondary filter -->
        <div style="flex: 1; min-width: 180px;">
          <div class="input-icon-end position-relative">
            <input type="text" v-model="staffId" class="form-control" 
                   placeholder="Staff ID (optional)" 
                   @input="validateStaffId" />
            <span class="input-icon-addon">
              <i class="ti ti-id"></i>
            </span>
          </div>
        </div>
      </div>
    </template>
  </ReportRow>

  <OverallEmployeeTrainingHistoryReportModal ref="overallEmployeeTrainingHistoryReportModal" :pdf-url="pdfUrl" />
</template>
```

### Data Properties

```javascript
data() {
  return {
    report: {
      id: 9,
      name: "Employee Training History Report",
      description: "View training history for individual employees",
      path: "/administration/reports/employee-training-history-report",
      icon: "user-check"
    },
    pdfUrl: null,
    staffId: ''
  };
}
```

### Key Properties Explanation

| Property | Type | Description |
|----------|------|-------------|
| `report.id` | Number | Unique identifier for the report (9) |
| `report.name` | String | Display name shown in the report list |
| `report.description` | String | Brief description of report functionality |
| `report.path` | String | Route path for the report |
| `report.icon` | String | Tabler icon identifier (`user-check`) |
| `pdfUrl` | String | Generated PDF URL for preview modal |
| `staffId` | String | Input value for staff ID filter |

## 🎨 UI Components

### 1. Date Range Picker
- **Component**: DateRangePicker (third-party)
- **Position**: Primary filter (left side)
- **Features**:
  - Predefined date ranges (Today, Yesterday, Last 7 Days, etc.)
  - Custom date selection
  - DD-MM-YYYY display format
  - YYYY-MM-DD backend format

### 2. Staff ID Input Field
- **Component**: HTML input with validation
- **Position**: Secondary filter (right side)
- **Features**:
  - Real-time input validation
  - Alphanumeric characters only
  - Maximum 20 characters
  - Optional filter (can be empty)
  - Visual feedback with ID icon

### 3. Action Buttons
- **Preview Button**: Opens PDF in modal
- **Export Dropdown**: PDF, Excel, CSV options
- **Loading States**: Visual feedback during generation

## 🔄 Core Methods

### Date Range Management

```javascript
mounted() {
  const start = moment().subtract(29, 'days');
  const end = moment();

  // Initialize DateRangePicker with predefined ranges
  new DateRangePicker(this.$refs.dateInput, {
    startDate: start,
    endDate: end,
    locale: { format: 'DD-MM-YYYY' },
    ranges: {
      Today: [moment(), moment()],
      Yesterday: [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
      "Last 7 Days": [moment().subtract(6, 'days'), moment()],
      "Last 30 Days": [moment().subtract(29, 'days'), moment()],
      "This Month": [moment().startOf('month'), moment().endOf('month')],
      "Last Month": [
        moment().subtract(1, 'month').startOf('month'),
        moment().subtract(1, 'month').endOf('month')
      ],
      Annual: [moment().startOf('year'), moment().endOf('year')]
    }
  }, (start, end) => {
    // Update input value and data attributes
    const formattedStart = start.format('YYYY-MM-DD');
    const formattedEnd = end.format('YYYY-MM-DD');
    this.$refs.dateInput.value = `${start.format('DD-MM-YYYY')} - ${end.format('DD-MM-YYYY')}`;
    this.$refs.dateInput.dataset.startDate = formattedStart;
    this.$refs.dateInput.dataset.endDate = formattedEnd;
  });
}
```

### Staff ID Validation

```javascript
validateStaffId() {
  // Remove non-alphanumeric characters and limit length
  this.staffId = this.staffId.replace(/[^a-zA-Z0-9]/g, '').substring(0, 20);
}
```

**Validation Rules**:
- Only alphanumeric characters allowed
- Maximum 20 characters
- Real-time validation on input
- Optional field (can be empty)

### Parameter Collection

```javascript
getReportParameters() {
  const startDate = this.$refs.dateInput.dataset.startDate;
  const endDate = this.$refs.dateInput.dataset.endDate;

  const params = {
    start_date: startDate,
    end_date: endDate
  };

  if (this.staffId && this.staffId.trim()) {
    params.staff_id = this.staffId.trim();
  }

  return params;
}
```

### Report Generation Methods

#### Preview Method
```javascript
async preview() {
  try {
    const params = this.getReportParameters();

    if (!params.start_date || !params.end_date) {
      message.error('Please select a date range.');
      return;
    }

    message.loading({ content: 'Generating preview...', key: 'preview' });

    const pdfBlob = await reportTrainingService.generateEmployeeTrainingHistoryReportPDF(
      params.start_date,
      params.end_date,
      params.staff_id
    );

    this.pdfUrl = window.URL.createObjectURL(pdfBlob);
    this.$refs.overallEmployeeTrainingHistoryReportModal.openModal();

    message.success({ content: 'Preview ready!', key: 'preview' });
  } catch (error) {
    console.error('Error generating preview:', error);
    message.error({ content: 'Failed to generate preview. Please try again.', key: 'preview' });
  }
}
```

#### Export PDF Method
```javascript
async exportPDF() {
  try {
    const params = this.getReportParameters();

    if (!params.start_date || !params.end_date) {
      message.error('Please select a date range.');
      return;
    }

    message.loading({ content: 'Generating PDF...', key: 'pdfExport' });

    const pdfBlob = await reportTrainingService.generateEmployeeTrainingHistoryReportPDF(
      params.start_date,
      params.end_date,
      params.staff_id
    );

    // Generate filename with filters
    let filename = `employee-training-history-report-${params.start_date}-to-${params.end_date}`;
    if (params.staff_id) filename += `-${params.staff_id}`;
    filename += '.pdf';

    // Trigger download
    const url = window.URL.createObjectURL(pdfBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);

    message.success({ content: 'PDF generated successfully!', key: 'pdfExport' });
  } catch (error) {
    console.error('Error exporting PDF:', error);
    message.error({ content: 'Failed to generate PDF. Please try again.', key: 'pdfExport' });
  }
}
```

## 📊 Data Flow

### 1. User Input
```
User selects date range → DateRangePicker updates dataset attributes
User enters staff ID → validateStaffId() cleans input → staffId reactive property updated
```

### 2. Parameter Collection
```
getReportParameters() → Collects date range from dataset → Adds staff ID if provided → Returns params object
```

### 3. Report Generation
```
Service call → API request with parameters → Blob response → File download or preview
```

### 4. File Naming
```
Base: employee-training-history-report-{start_date}-to-{end_date}
With Staff ID: employee-training-history-report-{start_date}-to-{end_date}-{staff_id}
Extension: .pdf, .xlsx, or .csv
```

## 🎨 Styling and Responsive Design

### CSS Classes and Styling

```scss
/* Custom styling for input fields */
.input-icon-end {
  position: relative;
}

.input-icon-addon {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  pointer-events: none;
  color: #666;
  z-index: 2;
}

/* Input field styling */
.form-control {
  border-radius: 6px;
  border: 1px solid #d9d9d9;
  padding: 8px 35px 8px 12px; /* Right padding for icon */
  min-height: 38px;
  transition: border-color 0.3s, box-shadow 0.3s;
}

.form-control:hover {
  border-color: #4096ff;
}

.form-control:focus {
  border-color: #4096ff;
  box-shadow: 0 0 0 2px rgba(64, 150, 255, 0.2);
  outline: none;
}
```

### Responsive Behavior

```scss
/* Responsive adjustments */
@media (max-width: 768px) {
  .d-flex {
    flex-direction: column;
    gap: 0.75rem;
  }
  
  .d-flex > div {
    min-width: unset !important;
    flex: unset !important;
  }
}
```

**Breakpoints**:
- **Desktop (>768px)**: Horizontal layout with flex proportions
- **Mobile (≤768px)**: Vertical stacking for better usability

## 🔗 Dependencies

### Vue.js Components
```javascript
import ReportRow from '@/components/reports/report-row.vue';
import OverallEmployeeTrainingHistoryReportModal from '@/components/modal/reports/overall-employee-training-history-report-modal.vue';
```

### External Libraries
```javascript
import moment from 'moment';                    // Date manipulation
import DateRangePicker from 'daterangepicker'; // Date picker component
import { message } from 'ant-design-vue';      // Notification system
```

### Services
```javascript
import { reportTrainingService } from '@/services/report-training.service';
```

## 🔧 Configuration Options

### Date Range Presets
- **Today**: Current date
- **Yesterday**: Previous day
- **Last 7 Days**: Past week
- **Last 30 Days**: Past month (default)
- **This Month**: Current month full range
- **Last Month**: Previous month full range
- **Annual**: Current year full range

### Validation Settings
- **Staff ID Length**: Maximum 20 characters
- **Staff ID Pattern**: Alphanumeric only (`/[^a-zA-Z0-9]/g`)
- **Required Fields**: Date range (start_date, end_date)
- **Optional Fields**: Staff ID

## 📋 API Integration

### Service Methods Used
```javascript
// PDF Generation
reportTrainingService.generateEmployeeTrainingHistoryReportPDF(startDate, endDate, staffId)

// Excel Generation  
reportTrainingService.generateEmployeeTrainingHistoryReportExcel(startDate, endDate, staffId)

// CSV Generation
reportTrainingService.generateEmployeeTrainingHistoryReportCSV(startDate, endDate, staffId)
```

### Request Format
```json
{
  "start_date": "2024-01-01",
  "end_date": "2024-01-31",
  "staff_id": "EMP001" // optional
}
```

### API Endpoints
- **PDF**: `/reports/employee-training-history-report/export-pdf`
- **Excel**: `/reports/employee-training-history-report/export-excel`
- **CSV**: `/reports/employee-training-history-report/export-csv`

## 🧪 Testing Considerations

### Unit Tests
```javascript
// Component method testing
describe('EmployeeTrainingHistoryReport', () => {
  test('validateStaffId removes special characters', () => {
    const wrapper = mount(EmployeeTrainingHistoryReport);
    wrapper.vm.staffId = 'EMP@123#';
    wrapper.vm.validateStaffId();
    expect(wrapper.vm.staffId).toBe('EMP123');
  });

  test('getReportParameters includes staff_id when provided', () => {
    const wrapper = mount(EmployeeTrainingHistoryReport);
    wrapper.vm.staffId = 'EMP001';
    wrapper.vm.$refs.dateInput = {
      dataset: { startDate: '2024-01-01', endDate: '2024-01-31' }
    };
    
    const params = wrapper.vm.getReportParameters();
    expect(params.staff_id).toBe('EMP001');
  });
});
```

### Integration Tests
- Date picker functionality
- Staff ID validation
- Report generation flow
- File download process
- Modal integration

### E2E Tests
- Complete user workflow
- Form validation
- Export functionality
- Error handling

## 🚨 Error Handling

### Input Validation Errors
- **Missing Date Range**: "Please select a date range."
- **Invalid Staff ID**: Automatically cleaned via validation

### API Errors
- **Network Issues**: "Failed to generate report. Please try again."
- **Server Errors**: Detailed error logging with user-friendly messages

### File Download Errors
- **Browser Restrictions**: Handled via blob creation and programmatic download
- **Large Files**: Loading indicators and timeout handling

## 📈 Performance Considerations

### Optimization Strategies
1. **Debounced Validation**: Staff ID validation on input
2. **Lazy Loading**: Component loads only when accessed
3. **Memory Management**: Proper blob URL cleanup
4. **Efficient Rendering**: Minimal DOM updates

### Resource Management
```javascript
// Cleanup PDF URL after use
window.URL.revokeObjectURL(url);
document.body.removeChild(a);
```

## 🔮 Future Enhancements

### Potential Improvements
1. **Auto-complete Staff ID**: Integration with employee search
2. **Multiple Staff IDs**: Bulk reporting for multiple employees
3. **Advanced Filters**: Department, position, training type filters
4. **Training Categories**: Filter by training categories or types
5. **Date Range Shortcuts**: Training-specific date presets
6. **Export Scheduling**: Automated report generation

### Technical Enhancements
- **TypeScript Support**: Type definitions for better development experience
- **Internationalization**: Multi-language support
- **Accessibility**: Enhanced ARIA labels and keyboard navigation
- **Progressive Web App**: Offline capability

---

**Component Version**: 1.0  
**Last Updated**: January 2025  
**Compatibility**: Vue.js 3.x, Ant Design Vue 3.x  
**Browser Support**: Chrome 88+, Firefox 85+, Safari 14+, Edge 88+
