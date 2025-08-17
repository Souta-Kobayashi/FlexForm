import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('データベースをシード中...')

  // デフォルトテナントの作成
  const defaultTenant = await prisma.tenant.upsert({
    where: { id: 'default' },
    update: {},
    create: {
      id: 'default',
      name: 'デフォルトテナント'
    }
  })

  console.log(`デフォルトテナント作成: ${defaultTenant.name}`)

  // デフォルトユーザーの作成
  const defaultUser = await prisma.user.upsert({
    where: { email: 'admin@flexform.local' },
    update: {},
    create: {
      id: 'default-user',
      email: 'admin@flexform.local',
      name: 'システム管理者'
    }
  })

  console.log(`デフォルトユーザー作成: ${defaultUser.name}`)

  // ユーザーとテナントの関連付け
  await prisma.userTenant.upsert({
    where: {
      userId_tenantId: {
        userId: defaultUser.id,
        tenantId: defaultTenant.id
      }
    },
    update: {},
    create: {
      userId: defaultUser.id,
      tenantId: defaultTenant.id,
      role: 'OWNER'
    }
  })

  console.log('ユーザーとテナントを関連付けました')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  }) 