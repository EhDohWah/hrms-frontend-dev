/**
 * Menu to Permission Mapping Configuration
 *
 * This configuration maps each menu item to the required permissions.
 *
 * Permission Levels:
 * - readPermission: Required to VIEW the menu (Read Only access)
 *   - If user has ONLY this permission, they see the menu but with read-only badge
 *   - CRUD buttons will be hidden
 *
 * - writePermissions: Required for FULL access (Create, Update, Delete, Export, Import)
 *   - If user has ANY of these permissions, they get full access with edit badge
 *   - CRUD buttons will be visible
 *
 * Permission Format: 'module.action'
 * Available actions: create, read, update, delete, import, export, bulk_create
 *
 * Menu Visibility Logic:
 * - Menu hidden: User has neither read nor write permissions
 * - Read-only (eye icon): User has readPermission but NO writePermissions
 * - Full access (edit icon): User has readPermission AND at least one writePermission
 */

export const MENU_PERMISSION_MAP = {
  // ============================================================================
  // MAIN MENU - Dashboard
  // ============================================================================
  'Dashboard': {
    readPermission: null, // Always visible to authenticated users
    writePermissions: []
  },

  // Dashboard Submenus - Role-specific dashboards
  'Admin Dashboard': {
    readPermission: null, // Visible if user is admin
    writePermissions: []
  },
  'HR Manager Dashboard': {
    readPermission: null, // Visible if user is hr-manager
    writePermissions: []
  },
  'HR Assistant Senior Dashboard': {
    readPermission: null, // Visible if user is hr-assistant-senior
    writePermissions: []
  },
  'HR Assistant Junior Dashboard': {
    readPermission: null, // Visible if user is hr-assistant-junior
    writePermissions: []
  },
  'Site Admin Dashboard': {
    readPermission: null, // Visible if user is site-admin
    writePermissions: []
  },

  // ============================================================================
  // USER MANAGEMENT
  // ============================================================================
  'User Management': {
    readPermission: 'user.read',
    writePermissions: ['user.create', 'user.update', 'user.delete']
  },

  'Users': {
    readPermission: 'user.read',
    writePermissions: ['user.create', 'user.update', 'user.delete', 'user.import', 'user.export']
  },

  'Roles': {
    readPermission: 'admin.read',
    writePermissions: ['admin.create', 'admin.update', 'admin.delete']
  },

  // ============================================================================
  // GRANTS
  // ============================================================================
  'Grants': {
    readPermission: 'grant.read',
    writePermissions: ['grant.create', 'grant.update', 'grant.delete', 'grant.import', 'grant.export']
  },

  'Grants List': {
    readPermission: 'grant.read',
    writePermissions: ['grant.create', 'grant.update', 'grant.delete', 'grant.import', 'grant.export']
  },

  'Grant Position': {
    readPermission: 'grant.read',
    writePermissions: ['grant.create', 'grant.update', 'grant.delete']
  },

  // ============================================================================
  // RECRUITMENT
  // ============================================================================
  'Recruitment': {
    readPermission: 'interview.read',
    writePermissions: ['interview.create', 'interview.update', 'interview.delete']
  },

  'Interviews': {
    readPermission: 'interview.read',
    writePermissions: ['interview.create', 'interview.update', 'interview.delete', 'interview.export']
  },

  'Job Offers': {
    readPermission: 'job_offer.read',
    writePermissions: ['job_offer.create', 'job_offer.update', 'job_offer.delete', 'job_offer.export']
  },

  'Jobs': {
    readPermission: 'interview.read',
    writePermissions: ['interview.create', 'interview.update', 'interview.delete']
  },

  'Candidates': {
    readPermission: 'interview.read',
    writePermissions: ['interview.create', 'interview.update', 'interview.delete']
  },

  'Referrals': {
    readPermission: 'reference.read',
    writePermissions: ['reference.create', 'reference.update', 'reference.delete']
  },

  'References': {
    readPermission: 'reference.read',
    writePermissions: ['reference.create', 'reference.update', 'reference.delete']
  },

  // ============================================================================
  // EMPLOYEE MANAGEMENT
  // ============================================================================
  'Employee': {
    readPermission: 'employee.read',
    writePermissions: ['employee.create', 'employee.update', 'employee.delete', 'employee.import', 'employee.export']
  },

  'Employees': {
    readPermission: 'employee.read',
    writePermissions: ['employee.create', 'employee.update', 'employee.delete', 'employee.import', 'employee.export']
  },

  'Employment Records': {
    readPermission: 'employment.read',
    writePermissions: ['employment.create', 'employment.update', 'employment.delete']
  },

  'Employee Resignation': {
    readPermission: 'employee.read',
    writePermissions: ['employee.update', 'employee.delete']
  },

  'Site Location': {
    readPermission: 'admin.read',
    writePermissions: ['admin.create', 'admin.update', 'admin.delete']
  },

  // ============================================================================
  // EMPLOYMENT
  // ============================================================================
  'Employment': {
    readPermission: 'employment.read',
    writePermissions: ['employment.create', 'employment.update', 'employment.delete']
  },

  'Employment List': {
    readPermission: 'employment.read',
    writePermissions: ['employment.create', 'employment.update', 'employment.delete', 'employment.import', 'employment.export']
  },

  'Employment History': {
    readPermission: 'employment_history.read',
    writePermissions: ['employment_history.create', 'employment_history.update', 'employment_history.delete']
  },

  // ============================================================================
  // EMPLOYEE INFORMATION
  // ============================================================================
  'Children': {
    readPermission: 'children.read',
    writePermissions: ['children.create', 'children.update', 'children.delete']
  },

  'Questionnaire': {
    readPermission: 'questionnaire.read',
    writePermissions: ['questionnaire.create', 'questionnaire.update', 'questionnaire.delete']
  },

  'Language': {
    readPermission: 'language.read',
    writePermissions: ['language.create', 'language.update', 'language.delete']
  },

  'Reference': {
    readPermission: 'reference.read',
    writePermissions: ['reference.create', 'reference.update', 'reference.delete']
  },

  'Education': {
    readPermission: 'education.read',
    writePermissions: ['education.create', 'education.update', 'education.delete']
  },

  // ============================================================================
  // PAYROLL
  // ============================================================================
  'Payroll': {
    readPermission: 'employee_salary.read',
    writePermissions: ['employee_salary.edit']
  },

  'Employee Salary': {
    readPermission: 'employee_salary.read',
    writePermissions: ['employee_salary.edit']
  },

  'Payslip': {
    readPermission: 'employee_salary.read',
    writePermissions: ['employee_salary.edit']
  },

  'Payroll Items': {
    readPermission: 'payroll_items.read',
    writePermissions: ['payroll_items.edit']
  },

  'Tax Settings': {
    readPermission: 'tax_settings.read',
    writePermissions: ['tax_settings.edit']
  },

  'Benefit Settings': {
    readPermission: 'benefit_settings.read',
    writePermissions: ['benefit_settings.edit']
  },

  // ============================================================================
  // ATTENDANCE (uses attendance_admin module permissions)
  // ============================================================================
  'Attendance': {
    readPermission: 'attendance_admin.read',
    writePermissions: ['attendance_admin.edit']
  },

  'Attendance List': {
    readPermission: 'attendance_admin.read',
    writePermissions: ['attendance_admin.edit']
  },

  // ============================================================================
  // TRAINING
  // ============================================================================
  'Training': {
    readPermission: 'training_list.read',
    writePermissions: ['training_list.edit']
  },

  'Training List': {
    readPermission: 'training_list.read',
    writePermissions: ['training_list.edit']
  },

  'Employee Training': {
    readPermission: 'employee_training.read',
    writePermissions: ['employee_training.edit']
  },

  // ============================================================================
  // REPORTS
  // ============================================================================
  'Reports': {
    readPermission: 'reports.read',
    writePermissions: ['reports.export']
  },

  'Report List': {
    readPermission: 'reports.read',
    writePermissions: ['reports.export']
  },

  // ============================================================================
  // LEAVE MANAGEMENT
  // ============================================================================
  'Leaves': {
    readPermission: 'leave_request.read',
    writePermissions: ['leave_request.create', 'leave_request.update', 'leave_request.delete', 'leave_request.export']
  },

  'Leaves (Admin)': {
    readPermission: 'leave_request.read',
    writePermissions: ['leave_request.create', 'leave_request.update', 'leave_request.delete', 'leave_request.export']
  },

  'Leave Types': {
    readPermission: 'leave_request.read',
    writePermissions: ['leave_request.create', 'leave_request.update', 'leave_request.delete']
  },

  'Leave Balances': {
    readPermission: 'leave_request.read',
    writePermissions: ['leave_request.update']
  },

  // ============================================================================
  // TRAVEL MANAGEMENT
  // ============================================================================
  'Travel': {
    readPermission: 'travel_request.read',
    writePermissions: ['travel_request.create', 'travel_request.update', 'travel_request.delete', 'travel_request.export']
  },

  'Travel (Admin)': {
    readPermission: 'travel_request.read',
    writePermissions: ['travel_request.create', 'travel_request.update', 'travel_request.delete', 'travel_request.export']
  },

  'Travel (Employee)': {
    readPermission: 'travel_request.read',
    writePermissions: ['travel_request.create', 'travel_request.update']
  },

  'Travel Requests': {
    readPermission: 'travel_request.read',
    writePermissions: ['travel_request.create', 'travel_request.update', 'travel_request.delete']
  },

  // ============================================================================
  // TAX
  // ============================================================================
  'Tax': {
    readPermission: 'tax_settings.read',
    writePermissions: ['tax_settings.edit']
  },

  // ============================================================================
  // LOOKUPS (SYSTEM CONFIGURATION)
  // ============================================================================
  'Lookups': {
    readPermission: 'admin.read',
    writePermissions: ['admin.create', 'admin.update', 'admin.delete']
  },

  'Lookup List': {
    readPermission: 'admin.read',
    writePermissions: ['admin.create', 'admin.update', 'admin.delete']
  },

  // ============================================================================
  // ORGANIZATION STRUCTURE
  // ============================================================================
  'Organization Structure': {
    readPermission: 'admin.read',
    writePermissions: ['admin.create', 'admin.update', 'admin.delete']
  },

  'Sites': {
    readPermission: 'admin.read',
    writePermissions: ['admin.create', 'admin.update', 'admin.delete']
  },

  'Departments': {
    readPermission: 'admin.read',
    writePermissions: ['admin.create', 'admin.update', 'admin.delete']
  },

  'Positions': {
    readPermission: 'admin.read',
    writePermissions: ['admin.create', 'admin.update', 'admin.delete']
  },

  'Section Departments': {
    readPermission: 'admin.read',
    writePermissions: ['admin.create', 'admin.update', 'admin.delete']
  },

  // ============================================================================
  // LETTER TEMPLATES
  // ============================================================================
  'Letter Templates': {
    readPermission: 'letter_templates.read',
    writePermissions: ['letter_templates.edit']
  },

  'Template List': {
    readPermission: 'letter_templates.read',
    writePermissions: ['letter_templates.edit']
  },

  // ============================================================================
  // RECYCLE BIN
  // ============================================================================
  'Recycle Bin': {
    readPermission: 'admin.read',
    writePermissions: ['admin.delete'] // Can restore/permanently delete
  },

  'Recycle Bin List': {
    readPermission: 'admin.read',
    writePermissions: ['admin.delete']
  },

  // ============================================================================
  // FILE UPLOADS
  // ============================================================================
  'File Uploads': {
    readPermission: 'upload.read',
    writePermissions: ['upload.create', 'upload.delete']
  },

  'File Uploads List': {
    readPermission: 'upload.read',
    writePermissions: ['upload.create', 'upload.delete']
  },

  // ============================================================================
  // TICKETS (if exists)
  // ============================================================================
  'Tickets': {
    readPermission: 'admin.read',
    writePermissions: ['admin.create', 'admin.update']
  },

  // ============================================================================
  // REQUESTS (General)
  // ============================================================================
  'Requests': {
    readPermission: 'leave_request.read', // Assuming requests include leave/travel
    writePermissions: ['leave_request.create', 'travel_request.create']
  }
};

/**
 * Get permission configuration for a menu item
 * @param {string} menuValue - Menu label
 * @returns {object|null} Permission configuration or null if not found
 */
export function getMenuPermissionConfig(menuValue) {
  return MENU_PERMISSION_MAP[menuValue] || null;
}

/**
 * Check if a menu item has permission configuration
 * @param {string} menuValue - Menu label
 * @returns {boolean}
 */
export function hasMenuPermissionConfig(menuValue) {
  return menuValue in MENU_PERMISSION_MAP;
}

/**
 * Get all configured menu items
 * @returns {string[]} Array of menu labels
 */
export function getAllConfiguredMenus() {
  return Object.keys(MENU_PERMISSION_MAP);
}

/**
 * Validate if all menus have proper configuration
 * @param {Array} sidebarData - Sidebar data from JSON
 * @returns {object} Validation result with missing and extra menus
 */
export function validateMenuConfiguration(sidebarData) {
  const configuredMenus = new Set(getAllConfiguredMenus());
  const actualMenus = new Set();

  // Extract all menu values from sidebar data
  sidebarData.forEach(section => {
    section.menu.forEach(menuItem => {
      actualMenus.add(menuItem.menuValue);

      if (menuItem.subMenus) {
        menuItem.subMenus.forEach(subMenu => {
          actualMenus.add(subMenu.menuValue);

          if (subMenu.subMenusTwo) {
            subMenu.subMenusTwo.forEach(subMenuTwo => {
              actualMenus.add(subMenuTwo.menuValue);
            });
          }
        });
      }
    });
  });

  // Find missing configurations
  const missingInConfig = [...actualMenus].filter(menu => !configuredMenus.has(menu));

  // Find extra configurations (not in sidebar data)
  const extraInConfig = [...configuredMenus].filter(menu => !actualMenus.has(menu));

  return {
    isValid: missingInConfig.length === 0,
    missingInConfig,
    extraInConfig,
    totalConfigured: configuredMenus.size,
    totalActual: actualMenus.size
  };
}
