import { prisma } from '~~/lib/prisma'

export default defineEventHandler(async (event) => {
  try {
    const formId = getRouterParam(event, 'id')
    const query = getQuery(event)
    
    if (!formId) {
      throw createError({
        statusCode: 400,
        statusMessage: 'フォームIDが必要です'
      })
    }

    // ページネーション設定
    const page = parseInt(query.page as string) || 1
    const limit = parseInt(query.limit as string) || 20
    const skip = (page - 1) * limit

    // フォームの存在確認
    const form = await prisma.form.findUnique({
      where: { id: formId }
    })

    if (!form) {
      throw createError({
        statusCode: 404,
        statusMessage: 'フォームが見つかりません'
      })
    }

    // 回答取得
    const [submissions, total] = await Promise.all([
      prisma.submission.findMany({
        where: { formId },
        select: {
          id: true,
          payload: true,
          createdAt: true
        },
        orderBy: {
          createdAt: 'desc'
        },
        skip,
        take: limit
      }),
      prisma.submission.count({
        where: { formId }
      })
    ])

    return {
      success: true,
      data: {
        submissions,
        pagination: {
          current: page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      }
    }
  } catch (error) {
    console.error('回答一覧取得エラー:', error)
    
    if ((error as any).statusCode) {
      throw error
    }
    
    throw createError({
      statusCode: 500,
      statusMessage: '回答一覧の取得に失敗しました'
    })
  }
}) 