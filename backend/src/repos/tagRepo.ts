import { getPrisma } from '../config/prisma.js';

export async function listAll(): Promise<string[]> {
  const rows = await getPrisma().tag.findMany({ orderBy: { name: 'asc' }, select: { name: true } });
  return rows.map((r) => r.name);
}

export async function ensureTags(names: string[]): Promise<{ id: number; name: string }[]> {
  if (names.length === 0) return [];
  const unique = Array.from(new Set(names.map((n) => n.trim()).filter((n) => n.length > 0)));
  const prisma = getPrisma();
  const result: { id: number; name: string }[] = [];
  for (const name of unique) {
    const tag = await prisma.tag.upsert({
      where: { name },
      update: {},
      create: { name },
      select: { id: true, name: true },
    });
    result.push(tag);
  }
  return result;
}
