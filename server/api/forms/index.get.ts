import { prisma } from '~~/lib/prisma'

export default defineEventHandler(async (event) => {
  try {
    // TODO: 認証機能実装後、ユーザーのテナントに基づいてフィルタリング
    const tenantId = 'default' // 暫定値
    
    const forms = await prisma.form.findMany({
      where: {
        tenantId
      },
      select: {
        id: true,
        title: true,
        publicPath: true,
        isPublic: true,
        version: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: {
            submissions: true
          }
        }
      },
      orderBy: {
        updatedAt: 'desc'
      }
    })

    return {
      success: true,
      data: forms
    }
  } catch (error) {
    console.error('フォーム一覧取得エラー:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'フォーム一覧の取得に失敗しました'
    })
  }
}) 