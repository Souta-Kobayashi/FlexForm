import { prisma } from '~~/lib/prisma'
import type { FormSchema } from '~~/types/form'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const { title, schema, publicPath } = body
    
    // バリデーション
    if (!title || !schema || !publicPath) {
      throw createError({
        statusCode: 400,
        statusMessage: 'タイトル、スキーマ、公開パスは必須です'
      })
    }

    // 公開パスの重複チェック
    const existingForm = await prisma.form.findUnique({
      where: { publicPath }
    })

    if (existingForm) {
      throw createError({
        statusCode: 400,
        statusMessage: 'この公開パスは既に使用されています'
      })
    }

    // TODO: 認証機能実装後、ユーザーのテナントIDを取得
    const tenantId = 'default' // 暫定値

    const form = await prisma.form.create({
      data: {
        tenantId,
        title,
        schema: schema as any,
        publicPath,
        isPublic: true,
        version: 1
      }
    })

    return {
      success: true,
      data: form
    }
  } catch (error) {
    console.error('フォーム作成エラー:', error)
    
    if ((error as any).statusCode) {
      throw error
    }
    
    throw createError({
      statusCode: 500,
      statusMessage: 'フォームの作成に失敗しました'
    })
  }
}) 