import Ajv from 'ajv'
import addFormats from 'ajv-formats'
import type { FormField, FormSchema, FormSubmission } from '~/types/form'

const ajv = new Ajv({ allErrors: true })
addFormats(ajv)

/**
 * フォームフィールドからJSON Schemaプロパティを生成
 */
function fieldToJsonSchemaProperty(field: FormField) {
  let property: any = {
    title: field.label
  }

  switch (field.type) {
    case 'text':
    case 'textarea':
      property.type = 'string'
      if (field.placeholder) {
        property.description = field.placeholder
      }
      break
    case 'email':
      property.type = 'string'
      property.format = 'email'
      break
    case 'number':
      property.type = 'number'
      break
    case 'date':
      property.type = 'string'
      property.format = 'date'
      break
    case 'select':
      property.type = 'string'
      if (field.options) {
        property.enum = field.options
      }
      break
    case 'checkbox':
      property.type = 'array'
      property.items = {
        type: 'string',
        enum: field.options || []
      }
      break
  }

  // バリデーション設定を追加
  if (field.validation) {
    if (field.validation.min !== undefined) {
      if (field.type === 'number') {
        property.minimum = field.validation.min
      } else {
        property.minLength = field.validation.min
      }
    }
    if (field.validation.max !== undefined) {
      if (field.type === 'number') {
        property.maximum = field.validation.max
      } else {
        property.maxLength = field.validation.max
      }
    }
    if (field.validation.pattern) {
      property.pattern = field.validation.pattern
    }
  }

  return property
}

/**
 * フォームスキーマからJSON Schemaを生成
 */
export function generateJsonSchema(formSchema: FormSchema) {
  const properties: Record<string, any> = {}
  const required: string[] = []

  formSchema.fields.forEach(field => {
    properties[field.id] = fieldToJsonSchemaProperty(field)
    if (field.required) {
      required.push(field.id)
    }
  })

  return {
    type: 'object',
    title: formSchema.title,
    description: formSchema.description,
    properties,
    required,
    additionalProperties: false
  }
}

/**
 * フォーム送信データをバリデーション
 */
export function validateFormSubmission(
  formSchema: FormSchema,
  submission: FormSubmission
) {
  const jsonSchema = generateJsonSchema(formSchema)
  const validate = ajv.compile(jsonSchema)
  const valid = validate(submission)

  return {
    valid,
    errors: validate.errors || []
  }
}

/**
 * バリデーションエラーを日本語メッセージに変換
 */
export function formatValidationErrors(errors: any[]) {
  return errors.map(error => {
    const fieldName = error.instancePath.replace('/', '') || error.params?.missingProperty || 'フィールド'
    
    switch (error.keyword) {
      case 'required':
        return `${error.params.missingProperty} は必須項目です`
      case 'format':
        if (error.params.format === 'email') {
          return `${fieldName} は有効なメールアドレスを入力してください`
        }
        return `${fieldName} の形式が正しくありません`
      case 'minLength':
        return `${fieldName} は${error.params.limit}文字以上で入力してください`
      case 'maxLength':
        return `${fieldName} は${error.params.limit}文字以下で入力してください`
      case 'minimum':
        return `${fieldName} は${error.params.limit}以上の値を入力してください`
      case 'maximum':
        return `${fieldName} は${error.params.limit}以下の値を入力してください`
      case 'enum':
        return `${fieldName} は有効な選択肢を選んでください`
      default:
        return `${fieldName} の入力値が正しくありません`
    }
  })
} 