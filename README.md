# SmartHR - Human Resource Management System Frontend

[![Vue.js](https://img.shields.io/badge/Vue.js-3.5.12-4FC08D?style=flat-square&logo=vue.js)](https://vuejs.org/)
[![Bootstrap](https://img.shields.io/badge/Bootstrap-5.3.3-7952B3?style=flat-square&logo=bootstrap)](https://getbootstrap.com/)
[![Ant Design Vue](https://img.shields.io/badge/Ant%20Design%20Vue-4.2.6-0170FE?style=flat-square&logo=ant-design)](https://antdv.com/)

A comprehensive Human Resource Management System frontend built with Vue.js 3, featuring role-based dashboards, employee management, payroll, attendance tracking, and more.

## 🚀 Features

### Core Modules
- **Multi-Role Dashboards**: Admin, HR Manager, HR Assistant, and Employee dashboards
- **Authentication & Authorization**: Secure login with role-based access control
- **Employee Management**: Complete employee lifecycle management
- **Attendance & Time Tracking**: Clock in/out, timesheet management
- **Payroll Management**: Salary processing, payslips, and tax calculations
- **Leave Management**: Leave requests, approvals, and holiday calendar
- **Performance Management**: Employee evaluations and goal tracking
- **Recruitment**: Job postings, candidate management, and hiring workflow

### Additional Features
- **Project Management**: Task tracking and project collaboration
- **CRM Integration**: Customer relationship management
- **Finance & Accounting**: Expense tracking and financial reports
- **Reports & Analytics**: Comprehensive reporting with charts and exports
- **Document Management**: File uploads and document storage
- **Settings & Configuration**: System-wide and user-specific settings

## 🛠️ Technology Stack

### Frontend Framework
- **Vue.js 3.5.12** - Progressive JavaScript framework
- **Vue Router 4.4.5** - Official router for Vue.js
- **Pinia 3.0.1** - State management library

### UI Components & Styling
- **Bootstrap 5.3.3** - CSS framework
- **Ant Design Vue 4.2.6** - Enterprise-class UI components
- **Bootstrap Vue 3** - Bootstrap components for Vue.js
- **Material Design Bootstrap** - Material design components

### Charts & Visualization
- **Vue3 ApexCharts** - Interactive charts and graphs
- **Chart.js** - Simple yet flexible charting library
- **FullCalendar** - Event calendar integration

### Form Handling & Validation
- **VeeValidate 4.13.2** - Form validation library
- **Vuelidate 2.0.4** - Model-based validation
- **Yup 1.4.0** - Schema validation

### Additional Libraries
- **CKEditor 5** - Rich text editor
- **SweetAlert2** - Beautiful popup alerts
- **Vue Draggable** - Drag and drop functionality
- **Date Range Picker** - Date selection components

## 📋 Prerequisites

- **Node.js** (v14.0.0 or higher)
- **npm** (v6.0.0 or higher) or **yarn**
- **Git** for version control

## 🚀 Getting Started

### 1. Clone the Repository
```bash
git clone <repository-url>
cd hrms-frontend-dev
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Configuration
Copy the example environment file and configure your settings:
```bash
cp .env.example .env.development
```

Update the environment variables in `.env.development`:
```env
VUE_APP_API_BASE_URL=http://your-api-url.com/api/v1
VUE_APP_ENV=development
```

### 4. Development Server
Start the development server with hot-reload:
```bash
npm run serve
```

The application will be available at `http://localhost:8080`

## 🏗️ Build & Deployment

### Production Build
```bash
npm run build
```

### Linting
```bash
npm run lint
```

### Environment-Specific Builds
The project supports multiple environments:
- **Development**: `.env.development`
- **Production**: `.env.production`

## 📁 Project Structure

```
src/
├── assets/          # Static assets (images, fonts, etc.)
├── components/      # Reusable Vue components
├── config/          # Configuration files
├── constants/       # Application constants
├── plugins/         # Vue plugins
├── router/          # Vue Router configuration
├── services/        # API services and HTTP clients
├── stores/          # Pinia state management
├── utils/           # Utility functions
├── views/           # Page components
│   ├── layouts/     # Layout components
│   └── pages/       # Application pages
│       ├── administration/  # Admin settings
│       ├── authentication/ # Login/auth pages
│       ├── dashboard/       # Dashboard pages
│       ├── hrm/            # HR management
│       ├── projects/       # Project management
│       └── ...
├── App.vue          # Root component
└── main.js          # Application entry point
```

## 🔐 User Roles & Permissions

The system supports multiple user roles with different access levels:

- **Admin**: Full system access and configuration
- **HR Manager**: HR operations and employee management
- **HR Assistant**: Limited HR operations and data entry
- **Employee**: Personal dashboard and self-service features

## 🎨 UI/UX Features

- **Responsive Design**: Mobile-first approach with Bootstrap
- **Dark/Light Theme**: Theme switching capability
- **RTL Support**: Right-to-left language support
- **Multiple Layouts**: Horizontal and vertical navigation options
- **Icon Libraries**: FontAwesome, Tabler Icons, Material Icons
- **Interactive Components**: Drag & drop, date pickers, rich text editors

## 🔧 Configuration

### Vue CLI Configuration
Customize the build process by modifying `vue.config.js`

### ESLint Configuration
Code quality rules are defined in the `eslintConfig` section of `package.json`

### Browser Support
Supports modern browsers as defined in `browserslist`:
- \> 1% market share
- Last 2 versions
- Not dead browsers
- Not IE 11

## 📚 Documentation

- [Vue.js Documentation](https://vuejs.org/guide/)
- [Vue Router Documentation](https://router.vuejs.org/)
- [Pinia Documentation](https://pinia.vuejs.org/)
- [Ant Design Vue Documentation](https://antdv.com/docs/vue/introduce)
- [Bootstrap Documentation](https://getbootstrap.com/docs/)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is private and proprietary. All rights reserved.

## 🆘 Support

For support and questions, please contact the development team or create an issue in the project repository.

---

**Version**: 1.8.3  
**Last Updated**: July 2025  
**Maintained by**: HRMS Development Team
