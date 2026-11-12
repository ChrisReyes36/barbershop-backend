import * as bcrypt from 'bcrypt';
import dataSource from '../data-source';

const SALT_ROUNDS = 10;
const ADMIN_ROLE = 'admin';
const MIN_PASSWORD_LENGTH = 8;

async function seedAdmin(): Promise<void> {
  const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD;
  const name = process.env.ADMIN_NAME?.trim() || 'Administrador';

  if (!email || !password) {
    throw new Error('ADMIN_EMAIL and ADMIN_PASSWORD must be set in .env');
  }
  if (password.length < MIN_PASSWORD_LENGTH) {
    throw new Error(
      `ADMIN_PASSWORD must have at least ${MIN_PASSWORD_LENGTH} characters`,
    );
  }

  await dataSource.initialize();
  try {
    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

    const inserted: { id: string }[] = await dataSource.query(
      `INSERT INTO users (name, email, password, role)
      VALUES ($1, $2, $3, $4)
      ON CONFLICT (email) DO NOTHING
      RETURNING id`,
      [name, email, passwordHash, ADMIN_ROLE],
    );

    console.log(
      inserted.length > 0
        ? `Admin user created: ${email}`
        : `Admin user already exists, nothing changed: ${email}`,
    );
  } finally {
    await dataSource.destroy();
  }
}

seedAdmin().catch((error: unknown) => {
  console.error('Admin seed failed:', error);
  process.exit(1);
});
