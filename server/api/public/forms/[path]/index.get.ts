import { prisma } from '~~/lib/prisma'

export default defineEventHandler(async (event) => {
  try {
    const publicPath = getRouterParam(event, 'path')
    
    if (!publicPath) {
      throw createError({
        statusCode: 400,
        statusMessage: '公開パスが必要です'
      })
    }

    const form = await prisma.form.findUnique({
      where: { 
        publicPath,
        isPublic: true
      },
      select: {
        id: true,
        title: true,
        schema: true,
        publicPath: true,
        version: true
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
    console.error('公開フォーム取得エラー:', error)
    
    if ((error as any).statusCode) {
      throw error
    }
    
    throw createError({
      statusCode: 500,
      statusMessage: 'フォームの取得に失敗しました'
    })
  }
}) 