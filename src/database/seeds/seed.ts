import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';

import { AppDataSource } from '../data-source';
import { User } from '../../users/entities/user.entity';
import { UserRole } from '../../users/interface/user.interface';

type SeedUser = {
  email: string;
  name: string;
  role: UserRole;
  password: string;
};

const DEFAULT_USERS: SeedUser[] = [
  {
    email: 'alice@taskflow.dev',
    name: 'Alice Admin',
    role: UserRole.ADMIN,
    password: 'MotDePasse123',
  },
  {
    email: 'bob@taskflow.dev',
    name: 'Bob Member',
    role: UserRole.MEMBER,
    password: 'password123',
  },
  {
    email: 'charlie@taskflow.dev',
    name: 'Charlie Viewer',
    role: UserRole.VIEWER,
    password: 'password123',
  },
];

async function upsertUser(dataSource: DataSource, user: SeedUser) {
  const repo = dataSource.getRepository(User);
  const existing = await repo.findOne({ where: { email: user.email } });
  const passwordHash = await bcrypt.hash(user.password, 10);

  if (!existing) {
    await repo.save(
      repo.create({
        email: user.email,
        name: user.name,
        role: user.role,
        passwordHash,
      }),
    );
    return 'created';
  }

  await repo.update(existing.id, {
    name: user.name,
    role: user.role,
    passwordHash,
  });
  return 'updated';
}

async function seed() {
  await AppDataSource.initialize();
  try {
    for (const user of DEFAULT_USERS) {
      const status = await upsertUser(AppDataSource, user);
      console.log(`[seed] ${status}: ${user.email}`);
    }
    console.log('[seed] done');
  } finally {
    await AppDataSource.destroy();
  }
}

seed().catch((error) => {
  console.error('[seed] failed', error);
  process.exit(1);
});
