import { PrismaClient } from '@prisma/client';

/**
 * 멱등 seed — upsert 기반. 2회 실행해도 동일 결과.
 * User 2명 / Tag 5개 / Article 3건 / 각 Article에 tag 2개씩.
 *
 * 비밀번호: "password" — bcrypt cost=4의 stub hash로 직접 작성. 본 hash는
 * 실 bcrypt(`$2b$04$...`) 형식과 호환되지 않으므로 ISS-BE-USR-01에서 실 bcrypt로 교체 필요.
 * 본 이슈 acceptance(seed 멱등 + UNIQUE 동작)는 hash 정확성에 의존하지 않음.
 */

const prisma = new PrismaClient();

const STUB_HASH = '$2b$04$dev_seed_only_replace_with_real_bcrypt_in_USR_01';

async function main() {
  const userA = await prisma.user.upsert({
    where: { username: 'conduit_admin' },
    update: {},
    create: {
      username: 'conduit_admin',
      email: 'admin@conduit.example',
      passwordHash: STUB_HASH,
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
      passwordHash: STUB_HASH,
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
        tags: {
          create: a.tagIds.map((tagId) => ({ tagId })),
        },
      },
    });
  }

  // eslint-disable-next-line no-console
  console.info(`seed complete: users=2, tags=${tags.length}, articles=${articles.length}`);
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
