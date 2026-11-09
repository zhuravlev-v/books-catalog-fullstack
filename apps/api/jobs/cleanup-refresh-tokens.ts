import { prisma } from '../prisma/prisma-client.ts';

const retentionDays = 30;
const cutoff = new Date(Date.now() - retentionDays * 864e5);

try {
  const result = await prisma.refresh_tokens.deleteMany({
    where: {
      expires_at: { lt: cutoff },
    },
  });

  console.log(`Deleted refresh tokens: ${result.count}`);
} finally {
  await prisma.$disconnect();
}
