import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

/**
 * 멱등 seed — upsert. 2회 실행해도 동일 결과.
 * 실 bcrypt(cost=12) 사용 — 로컬에서 'password'로 로그인 가능.
 */

const prisma = new PrismaClient();
const BCRYPT_COST = Number(process.env.BCRYPT_COST ?? 12);
const DEFAULT_PASSWORD = 'password';

async function main() {
  const passwordHash = await bcrypt.hash(DEFAULT_PASSWORD, BCRYPT_COST);

  const userA = await prisma.user.upsert({
    where: { username: 'conduit_admin' },
    update: {},
    create: {
      username: 'conduit_admin',
      email: 'admin@conduit.example',
      passwordHash,
      bio: 'Conduit admin (seed)',
      image: null,
    },
  });

  const userB = await prisma.user.upsert({
    where: { username: 'jane_dev' },
    update: {},
    create: {
      username: 'jane_dev',
      email: 'jane@conduit.example',
      passwordHash,
      bio: 'Frontend developer',
      image: null,
    },
  });

  const tagNames = ['typescript', 'react', 'express', 'prisma', 'realworld'];
  const tags = await Promise.all(
    tagNames.map((name) => prisma.tag.upsert({ where: { name }, update: {}, create: { name } })),
  );

  const articles = [
    {
      slug: 'how-to-conduit',
      title: 'How to Conduit',
      description: 'Intro to the RealWorld Conduit clone',
      body: '# Welcome\n\nThis is the seed article 1.',
      authorId: userA.id,
      tagIds: [tags[0]!.id, tags[4]!.id],
    },
    {
      slug: 'typescript-strict-tips',
      title: 'TypeScript strict tips',
      description: 'Best practices we learned',
      body: '## Strict mode\n\nUse `strict: true`. End of story.',
      authorId: userB.id,
      tagIds: [tags[0]!.id, tags[1]!.id],
    },
    {
      slug: 'express-error-mapping',
      title: 'Express error mapping done right',
      description: 'Mapping AppError to HTTP status',
      body: '...',
      authorId: userA.id,
      tagIds: [tags[2]!.id, tags[3]!.id],
    },
  ];

  for (const a of articles) {
    await prisma.article.upsert({
      where: { slug: a.slug },
      update: {},
      create: {
        slug: a.slug,
        title: a.title,
        description: a.description,
        body: a.body,
        authorId: a.authorId,
        tags: { create: a.tagIds.map((tagId) => ({ tagId })) },
      },
    });
  }

  // eslint-disable-next-line no-console
  console.info(
    `seed complete: users=2, tags=${tags.length}, articles=${articles.length}, password='${DEFAULT_PASSWORD}'`,
  );
}

main()
  .catch((e) => {
    // eslint-disable-next-line no-console
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
