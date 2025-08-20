# Technology Stack & Build System

## Frontend Framework
- **Vue.js 3.5.12** - Composition API preferred, Options API acceptable
- **Vue Router 4.4.5** - Client-side routing with route guards
- **Pinia 3.0.1** - State management (preferred over Vuex)

## UI Framework & Styling
- **Bootstrap 5.3.3** - Primary CSS framework
- **Ant Design Vue 4.2.6** - Enterprise UI components
- **Bootstrap Vue 3** - Vue-specific Bootstrap components
- **SCSS** - CSS preprocessing with modular architecture

## Build System
- **Vue CLI 5.0** - Project scaffolding and build tooling
- **Webpack 5** - Module bundling with filesystem caching enabled
- **Babel** - JavaScript transpilation
- **ESLint** - Code linting with Vue 3 essential rules

## Key Libraries
- **Form Handling**: VeeValidate 4.13.2, Vuelidate 2.0.4, Yup 1.4.0
- **Charts**: Vue3 ApexCharts, Chart.js integration
- **Rich Text**: CKEditor 5 for content editing
- **Date/Time**: Vue3 DatePicker, V-Calendar, DateRangePicker
- **UI Enhancements**: SweetAlert2, Vue Easy Lightbox, Vue Draggable
- **Icons**: FontAwesome, Tabler Icons, Material Icons, Themify Icons

## Development Commands
```bash
# Install dependencies
npm install

# Development server with hot reload
npm run serve

# Production build
npm run build

# Code linting
npm run lint
```

## Environment Configuration
- **Development**: `.env.development`
- **Production**: `.env.production`
- **Required Variables**: `VUE_APP_API_BASE_URL`, `VUE_APP_ENV`

## Browser Support
- Modern browsers (> 1% market share)
- Last 2 versions
- No IE 11 support

## Performance Optimizations
- Webpack 5 filesystem caching enabled
- Cache-loader removed for better performance
- Component lazy loading via Vue Router
- Asset optimization and minification