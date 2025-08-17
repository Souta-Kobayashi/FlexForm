export interface FormField {
  id: string
  type: 'text' | 'email' | 'select' | 'checkbox' | 'textarea' | 'number' | 'date'
  label: string
  placeholder?: string
  required: boolean
  options?: string[] // for select and checkbox
  validation?: {
    min?: number
    max?: number
    pattern?: string
    message?: string
  }
}

export interface FormSchema {
  title: string
  description?: string
  fields: FormField[]
}

export interface FormSubmission {
  [fieldId: string]: any
}

export interface Form {
  id: string
  tenantId: string
  title: string
  schema: FormSchema
  publicPath: string
  isPublic: boolean
  version: number
  createdAt: Date
  updatedAt: Date
}

export interface Submission {
  id: string
  formId: string
  payload: FormSubmission
  createdAt: Date
}

export interface User {
  id: string
  email: string
  name: string
  createdAt: Date
  updatedAt: Date
}

export interface Tenant {
  id: string
  name: string
  createdAt: Date
  updatedAt: Date
}

export interface UserTenant {
  id: string
  userId: string
  tenantId: string
  role: 'admin' | 'editor' | 'member'
} 