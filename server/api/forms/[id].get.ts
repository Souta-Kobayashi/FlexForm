import { prisma } from '~~/lib/prisma'

export default defineEventHandler(async (event) => {
  try {
    const formId = getRouterParam(event, 'id')
    
    if (!formId) {
      throw createError({
        statusCode: 400,
        statusMessage: 'フォームIDが必要です'
      })
    }

    const form = await prisma.form.findUnique({
      where: { id: formId },
      include: {
        _count: {
          select: {
            submissions: true
          }
        }
      }
    })

    if (!form) {
      throw createError({
        statusCode: 404,
        statusMessage: 'フォームが見つかりません'
      })
    }

    return {
      success: true,
      data: form
    }
  } catch (error) {
    console.error('フォーム取得エラー:', error)
    
    if ((error as any).statusCode) {
      throw error
    }
    
    throw createError({
      statusCode: 500,
      statusMessage: 'フォームの取得に失敗しました'
    })
  }
}) 