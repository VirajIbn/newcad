import { z } from 'zod'

// User Authentication Schemas
export const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Invalid email format')
    .max(255, 'Email is too long'),
  password: z
    .string()
    .min(1, 'Password is required')
    .min(6, 'Password must be at least 6 characters')
    .max(100, 'Password is too long'),
  rememberMe: z.boolean().optional()
})

export const registerSchema = z.object({
  firstName: z
    .string()
    .min(1, 'First name is required')
    .min(2, 'First name must be at least 2 characters')
    .max(50, 'First name is too long')
    .regex(/^[a-zA-Z\s]+$/, 'First name can only contain letters and spaces'),
  lastName: z
    .string()
    .min(1, 'Last name is required')
    .min(2, 'Last name must be at least 2 characters')
    .max(50, 'Last name is too long')
    .regex(/^[a-zA-Z\s]+$/, 'Last name can only contain letters and spaces'),
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Invalid email format')
    .max(255, 'Email is too long'),
  password: z
    .string()
    .min(1, 'Password is required')
    .min(8, 'Password must be at least 8 characters')
    .max(100, 'Password is too long')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Password must contain at least one uppercase letter, one lowercase letter, and one number'),
  confirmPassword: z
    .string()
    .min(1, 'Please confirm your password'),
  acceptTerms: z
    .boolean()
    .refine(val => val === true, 'You must accept the terms and conditions')
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"]
})

// User Profile Schema
export const profileSchema = z.object({
  firstName: z
    .string()
    .min(1, 'First name is required')
    .min(2, 'First name must be at least 2 characters')
    .max(50, 'First name is too long'),
  lastName: z
    .string()
    .min(1, 'Last name is required')
    .min(2, 'Last name must be at least 2 characters')
    .max(50, 'Last name is too long'),
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Invalid email format'),
  phone: z
    .string()
    .optional()
    .refine(val => !val || /^\+?[\d\s\-\(\)]+$/.test(val), 'Invalid phone number format'),
  bio: z
    .string()
    .max(500, 'Bio must be less than 500 characters')
    .optional(),
  avatar: z
    .string()
    .url('Invalid URL format')
    .optional()
})

// Dashboard Settings Schema
export const dashboardSettingsSchema = z.object({
  refreshInterval: z
    .number()
    .min(5, 'Refresh interval must be at least 5 seconds')
    .max(3600, 'Refresh interval must be less than 1 hour'),
  defaultView: z
    .enum(['grid', 'list', 'table'], 'Invalid view type'),
  notifications: z.object({
    email: z.boolean(),
    push: z.boolean(),
    sms: z.boolean()
  }),
  theme: z
    .enum(['light', 'dark', 'auto'], 'Invalid theme'),
  language: z
    .enum(['en', 'es', 'fr', 'de'], 'Invalid language')
})

// Data Export Schema
export const exportSchema = z.object({
  dateRange: z.object({
    startDate: z
      .date()
      .refine(date => date <= new Date(), 'Start date cannot be in the future'),
    endDate: z
      .date()
      .refine(date => date <= new Date(), 'End date cannot be in the future')
  }).refine(data => data.startDate <= data.endDate, {
    message: 'Start date must be before end date',
    path: ['endDate']
  }),
  format: z
    .enum(['csv', 'xlsx', 'pdf', 'json'], 'Invalid export format'),
  includeHeaders: z.boolean(),
  dataTypes: z.array(z.string()).min(1, 'Select at least one data type')
})

// Search and Filter Schema
export const searchSchema = z.object({
  query: z
    .string()
    .min(1, 'Search query is required')
    .max(100, 'Search query is too long'),
  filters: z.object({
    category: z.array(z.string()).optional(),
    dateRange: z.object({
      from: z.date().optional(),
      to: z.date().optional()
    }).optional(),
    status: z.array(z.enum(['active', 'inactive', 'pending', 'completed'])).optional(),
    priceRange: z.object({
      min: z.number().min(0, 'Minimum price cannot be negative').optional(),
      max: z.number().min(0, 'Maximum price cannot be negative').optional()
    }).optional()
  }).optional(),
  sortBy: z
    .enum(['name', 'date', 'price', 'status'], 'Invalid sort field')
    .optional(),
  sortOrder: z
    .enum(['asc', 'desc'], 'Invalid sort order')
    .optional()
})

// API Response Schemas
export const apiResponseSchema = z.object({
  success: z.boolean(),
  data: z.any().optional(),
  message: z.string().optional(),
  errors: z.array(z.string()).optional(),
  timestamp: z.string().datetime().optional()
})

// Pagination Schema
export const paginationSchema = z.object({
  page: z
    .number()
    .int()
    .min(1, 'Page number must be at least 1'),
  limit: z
    .number()
    .int()
    .min(1, 'Limit must be at least 1')
    .max(100, 'Limit cannot exceed 100'),
  total: z
    .number()
    .int()
    .min(0, 'Total cannot be negative')
    .optional()
})

// Utility function to get field error
export const getFieldError = (errors, fieldName) => {
  return errors?.find(error => error.path.includes(fieldName))?.message
}

// Utility function to validate form data
export const validateForm = (schema, data) => {
  try {
    const validatedData = schema.parse(data)
    return { success: true, data: validatedData, errors: null }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, data: null, errors: error.errors }
    }
    return { success: false, data: null, errors: [{ message: 'Validation failed' }] }
  }
}

// Utility function to validate partial data
export const validatePartial = (schema, data) => {
  try {
    const validatedData = schema.partial().parse(data)
    return { success: true, data: validatedData, errors: null }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, data: null, errors: error.errors }
    }
    return { success: false, data: null, errors: [{ message: 'Validation failed' }] }
  }
}

// Vendor Schema
export const vendorSchema = z.object({
  vendorname: z
    .string()
    .min(1, 'Vendor name is required')
    .max(100, 'Vendor name must be less than 100 characters'),
  gstno: z
    .string()
    .max(100, 'GST number must be less than 100 characters')
    .optional(),
  contactperson: z
    .string()
    .max(200, 'Contact person must be less than 200 characters')
    .optional(),
  email: z
    .string()
    .email('Invalid email format')
    .max(100, 'Email must be less than 100 characters')
    .optional()
    .or(z.literal('')),
  mobilenumber: z
    .string()
    .max(100, 'Mobile number must be less than 100 characters')
    .optional(),
  address: z
    .string()
    .max(500, 'Address must be less than 500 characters')
    .optional(),
  countryid: z
    .any()
    .refine((val) => val === undefined || val === null || val === '' || (typeof val === 'number' && val > 0) || (typeof val === 'string' && val.length > 0), 'Country is required')
    .transform((val) => val && val !== '' ? parseInt(val) : null)
    .optional(),
  stateid: z
    .any()
    .refine((val) => val === undefined || val === null || val === '' || (typeof val === 'number' && val > 0) || (typeof val === 'string' && val.length > 0), 'State is required')
    .transform((val) => val && val !== '' ? parseInt(val) : null)
    .optional(),
  cityid: z
    .any()
    .refine((val) => val === undefined || val === null || val === '' || (typeof val === 'number' && val > 0) || (typeof val === 'string' && val.length > 0), 'City is required')
    .transform((val) => val && val !== '' ? parseInt(val) : null)
    .optional(),
  zip: z
    .string()
    .max(10, 'ZIP code must be less than 10 characters')
    .optional(),
  description: z
    .string()
    .max(1000, 'Description must be less than 1000 characters')
    .optional(),
  orgid: z
    .number()
    .int()
    .min(1, 'Organization is required')
    .optional(),
  addedby: z
    .number()
    .int()
    .min(1, 'Added by user ID is required')
    .optional(),
  modifiedby: z
    .number()
    .int()
    .min(1, 'Modified by user ID is required')
    .optional(),
});

// Vendor Search Schema
export const vendorSearchSchema = z.object({
  search: z
    .string()
    .max(100, 'Search term is too long')
    .optional(),
  page: z
    .number()
    .int()
    .min(1, 'Page number must be at least 1')
    .optional(),
  page_size: z
    .union([z.number().int().min(1).max(100), z.literal('all')])
    .optional(),
  ordering: z
    .string()
    .optional(),
});

// Asset Details Schema
export const assetDetailsSchema = z.object({
  orgid: z
    .number()
    .int()
    .min(1, 'Organization is required')
    .optional(),
  assettypeid: z
    .any()
    .refine((val) => val !== undefined && val !== null && val !== '', 'Asset Type is required')
    .transform((val) => val ? parseInt(val) : undefined),
  status: z
    .any()
    .refine((val) => val !== undefined && val !== null && val !== '', 'Asset Status is required')
    .transform((val) => val ? parseInt(val) : undefined),
  manufacturerid: z
    .any()
    .refine((val) => val !== undefined && val !== null && val !== '', 'Manufacturer is required')
    .transform((val) => val ? parseInt(val) : undefined),
  vendorid: z
    .any()
    .refine((val) => val !== undefined && val !== null && val !== '', 'Vendor is required')
    .transform((val) => val ? parseInt(val) : undefined),
  model: z
    .string()
    .min(1, 'Model is required')
    .max(100, 'Model name is too long'),
  serialnumber: z
    .string()
    .min(1, 'Serial number is required')
    .max(100, 'Serial number is too long'),
  purchasedate: z
    .string()
    .min(1, 'Purchase date is required')
    .refine((date) => {
      if (!date) return true;
      const purchaseDate = new Date(date);
      const currentDate = new Date();
      currentDate.setHours(23, 59, 59, 999); // Set to end of day for comparison
      return purchaseDate <= currentDate;
    }, {
      message: 'Purchase date cannot be greater than current date'
    }),
  purchasecost: z
    .string()
    .min(1, 'Purchase cost is required')
    .regex(/^\d+(\.\d{1,2})?$/, 'Invalid purchase cost format'),
  branchid: z
    .any()
    .refine((val) => val === undefined || val === null || val === '' || (typeof val === 'number' && val > 0), 'Branch is required')
    .transform((val) => val && val !== '' ? parseInt(val) : undefined)
    .optional(),
  departmentid: z
    .any()
    .refine((val) => val === undefined || val === null || val === '' || (typeof val === 'number' && val > 0), 'Department is required')
    .transform((val) => val && val !== '' ? parseInt(val) : undefined)
    .optional(),
  depreciationrate: z
    .string()
    .optional()
    .transform((val) => val === '' || val === undefined ? '0' : val)
    .refine((val) => /^(0|[1-9]\d*)(\.\d{1,2})?$/.test(val), 'Invalid depreciation rate format'),
  currentvalue: z
    .string()
    .optional()
    .transform((val) => val === '' || val === undefined ? '0' : val)
    .refine((val) => /^(0|[1-9]\d*)(\.\d{1,2})?$/.test(val), 'Invalid current value format'),
  acquisitiontype: z
    .string()
    .max(1000, 'Acquisition type is too long')
    .optional(),
  conditionid: z
    .any()
    .refine((val) => val !== undefined && val !== null && val !== '', 'Asset condition is required')
    .transform((val) => val ? parseInt(val) : undefined),
  warrantystartdate: z
    .string()
    .optional(),
  warrantyenddate: z
    .string()
    .optional(),
  insurancedetails: z
    .string()
    .max(1000, 'Insurance details are too long')
    .optional(),
  description: z
    .string()
    .max(1000, 'Description is too long')
    .optional(),
  employeeid: z
    .any()
    .refine((val) => val === undefined || val === null || val === '' || (typeof val === 'number' && val > 0), 'Employee is required')
    .transform((val) => val && val !== '' ? parseInt(val) : undefined)
    .optional(),
  storedlocation: z
    .string()
    .max(1000, 'Storage location is too long')
    .optional(),
  financialyearid: z
    .number()
    .int()
    .min(1, 'Financial year ID is required')
    .optional(),
  assignedondate: z
    .string()
    .optional(),
}).refine((data) => {
  // If status is "Assigned" (codeid: 484), then employeeid is required
  if (data.status === 484) {
    return data.employeeid !== undefined && data.employeeid !== null && data.employeeid !== '';
  }
  return true;
}, {
  message: 'Assigned Employee is required when status is set to Assigned',
  path: ['employeeid']
}).refine((data) => {
  // If status is "In Stock" (codeid: 481), then storedlocation is required
  if (data.status === 481) {
    return data.storedlocation !== undefined && data.storedlocation !== null && data.storedlocation !== '';
  }
  return true;
}, {
  message: 'Storage Location is required when status is set to In Stock',
  path: ['storedlocation']
}).refine((data) => {
  // If status is "In Stock" (codeid: 481), then employeeid should be blank
  if (data.status === 481) {
    return data.employeeid === undefined || data.employeeid === null || data.employeeid === '';
  }
  return true;
}, {
  message: 'Assigned Employee should be blank when status is set to In Stock',
  path: ['employeeid']
}).refine((data) => {
  // If status is "Assigned" (codeid: 484), then storedlocation should be blank
  if (data.status === 484) {
    return data.storedlocation === undefined || data.storedlocation === null || data.storedlocation === '';
  }
  return true;
}, {
  message: 'Storage Location should be blank when status is set to Assigned',
  path: ['storedlocation']
}).refine((data) => {
  // Warranty start date must be equal to or greater than purchase date
  if (data.warrantystartdate && data.purchasedate) {
    const warrantyDate = new Date(data.warrantystartdate);
    const purchaseDate = new Date(data.purchasedate);
    return warrantyDate >= purchaseDate;
  }
  return true;
}, {
  message: 'Warranty start date must be equal to or greater than purchase date',
  path: ['warrantystartdate']
}).refine((data) => {
  // Warranty end date must be equal to or greater than warranty start date
  if (data.warrantyenddate && data.warrantystartdate) {
    const warrantyEndDate = new Date(data.warrantyenddate);
    const warrantyStartDate = new Date(data.warrantystartdate);
    return warrantyEndDate >= warrantyStartDate;
  }
  return true;
}, {
  message: 'Warranty end date must be equal to or greater than warranty start date',
  path: ['warrantyenddate']
});

// Asset Details Search Schema
export const assetDetailsSearchSchema = z.object({
  search: z
    .string()
    .max(100, 'Search term is too long')
    .optional(),
  page: z
    .number()
    .int()
    .min(1, 'Page number must be at least 1')
    .optional(),
  page_size: z
    .number()
    .int()
    .min(1, 'Page size must be at least 1')
    .max(100, 'Page size cannot exceed 100')
    .optional(),
});

// Deal Schema
export const dealSchema = z.object({
  // Deal Information
  dealname: z
    .string()
    .min(1, 'Deal name is required')
    .max(200, 'Deal name must be less than 200 characters'),
  dealownerid: z
    .any()
    .refine((val) => val !== undefined && val !== null && val !== '', 'Deal owner is required')
    .transform((val) => val && val !== '' ? parseInt(val) : null),
  dealstage: z
    .string()
    .min(1, 'Deal stage is required'),
  dealvalue: z
    .any()
    .refine((val) => val !== undefined && val !== null && val !== '', 'Deal value is required')
    .transform((val) => parseFloat(val))
    .refine((val) => val >= 0, 'Deal value must be greater than or equal to 0'),
  discountvalue: z
    .any()
    .transform((val) => val && val !== '' ? parseFloat(val) : null)
    .refine((val) => val === null || val >= 0, 'Discount value must be greater than or equal to 0')
    .optional()
    .nullable(),
  mrr: z
    .any()
    .transform((val) => val && val !== '' ? parseFloat(val) : null)
    .optional()
    .nullable(),
  arr: z
    .any()
    .transform((val) => val && val !== '' ? parseFloat(val) : null)
    .optional()
    .nullable(),
  revenuetype: z
    .string()
    .min(1, 'Revenue type is required'),
  expectedclosedate: z
    .string()
    .min(1, 'Expected close date is required')
    .refine((date) => {
      const selectedDate = new Date(date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return selectedDate >= today;
    }, 'Expected close date must be today or in the future'),
  actualclosedate: z
    .string()
    .optional()
    .nullable(),
  probability: z
    .any()
    .transform((val) => val && val !== '' ? parseInt(val) : null)
    .refine((val) => val === null || (val >= 0 && val <= 100), 'Probability must be between 0 and 100')
    .optional()
    .nullable(),
  dealtype: z
    .string()
    .optional()
    .nullable(),
  leadsource: z
    .string()
    .optional()
    .nullable(),
  attachments: z
    .any()
    .optional()
    .nullable(),
  engagementscore: z
    .any()
    .transform((val) => val && val !== '' ? parseInt(val) : null)
    .optional()
    .nullable(),
  dealhealthindicator: z
    .string()
    .optional()
    .nullable(),
  
  // Customer & Contact Details
  customertype: z
    .string()
    .min(1, 'Customer type is required'),
  customername: z
    .string()
    .min(1, 'Customer name is required')
    .max(200, 'Customer name must be less than 200 characters'),
  companyname: z
    .string()
    .min(1, 'Company name is required')
    .max(200, 'Company name must be less than 200 characters'),
  industry: z
    .string()
    .optional()
    .nullable(),
  mobilenumber: z
    .string()
    .min(1, 'Mobile number is required')
    .max(20, 'Mobile number must be less than 20 characters')
    .regex(/^\+?[\d\s\-\(\)]+$/, 'Invalid mobile number format'),
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Invalid email format')
    .max(200, 'Email must be less than 200 characters'),
  whatsappnumber: z
    .string()
    .max(20, 'WhatsApp number must be less than 20 characters')
    .regex(/^$|^\+?[\d\s\-\(\)]+$/, 'Invalid WhatsApp number format')
    .optional()
    .nullable(),
  contactpreference: z
    .array(z.string())
    .optional()
    .nullable(),
  decisionmaker: z
    .string()
    .min(1, 'Decision maker is required')
    .max(200, 'Decision maker must be less than 200 characters'),
  stakeholderscount: z
    .any()
    .transform((val) => val && val !== '' ? parseInt(val) : null)
    .optional()
    .nullable(),
  customerrisklevel: z
    .string()
    .optional()
    .nullable(),
  customerlocation: z
    .string()
    .optional()
    .nullable(),
  
  // Closing Details
  dealstatus: z
    .string()
    .min(1, 'Deal status is required'),
  lostreason: z
    .string()
    .optional()
    .nullable(),
  nextsteps: z
    .string()
    .optional()
    .nullable(),
  comments: z
    .string()
    .max(1000, 'Comments must be less than 1000 characters')
    .optional()
    .nullable(),
  
  // System fields
  orgid: z
    .number()
    .int()
    .min(1, 'Organization is required')
    .optional(),
  addedby: z
    .number()
    .int()
    .min(1, 'Added by user ID is required')
    .optional(),
  modifiedby: z
    .number()
    .int()
    .min(1, 'Modified by user ID is required')
    .optional(),
}).refine((data) => {
  // If deal status is Closed-Lost, lost reason is required
  if (data.dealstatus === 'Closed-Lost' && !data.lostreason) {
    return false;
  }
  return true;
}, {
  message: 'Lost reason is required when deal status is Closed-Lost',
  path: ['lostreason']
}).refine((data) => {
  // If deal status is Closed (Won or Lost), actual close date is required
  if ((data.dealstatus === 'Closed-Won' || data.dealstatus === 'Closed-Lost') && !data.actualclosedate) {
    return false;
  }
  return true;
}, {
  message: 'Actual close date is required when deal is closed',
  path: ['actualclosedate']
}).refine((data) => {
  // If discount value is provided, it should not exceed deal value
  if (data.discountvalue && data.dealvalue && data.discountvalue > data.dealvalue) {
    return false;
  }
  return true;
}, {
  message: 'Discount value cannot exceed deal value',
  path: ['discountvalue']
});
