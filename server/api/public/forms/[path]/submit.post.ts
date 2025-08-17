import { prisma } from '~~/lib/prisma'
import { validateFormSubmission, formatValidationErrors } from '~~/lib/validation'
import type { FormSchema, FormSubmission } from '~~/types/form'

export default defineEventHandler(async (event) => {
  try {
    const publicPath = getRouterParam(event, 'path')
    const submission: FormSubmission = await readBody(event)
    
    if (!publicPath) {
      throw createError({
        statusCode: 400,
        statusMessage: '公開パスが必要です'
      })
    }

    // フォームを取得
    const form = await prisma.form.findUnique({
      where: { 
        publicPath,
        isPublic: true
      }
    })

    if (!form) {
      throw createError({
        statusCode: 404,
        statusMessage: 'フォームが見つかりません'
      })
    }

    // スキーマバリデーション
    const formSchema = form.schema as unknown as FormSchema
    const validation = validateFormSubmission(formSchema, submission)
    
    if (!validation.valid) {
      const errorMessages = formatValidationErrors(validation.errors)
      throw createError({
        statusCode: 400,
        statusMessage: 'バリデーションエラー',
        data: { errors: errorMessages }
      })
    }

    // 回答を保存
    const submissionRecord = await prisma.submission.create({
      data: {
        formId: form.id,
        payload: submission as any
      }
    })

    // TODO: メール通知送信
    // await sendNotificationEmail(form, submissionRecord)

    return {
      success: true,
      message: '回答を送信しました',
      data: {
        submissionId: submissionRecord.id
      }
    }
  } catch (error) {
    console.error('回答送信エラー:', error)
    
    if ((error as any).statusCode) {
      throw error
    }
    
    throw createError({
      statusCode: 500,
      statusMessage: '回答の送信に失敗しました'
    })
  }
}) 