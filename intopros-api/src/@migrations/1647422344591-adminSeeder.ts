import { hashSync } from 'bcrypt';
import { getRepository, MigrationInterface, QueryRunner } from 'typeorm';
import User, { UserRole } from '../users/entities/user.entity';

export class adminSeeder1647422344591 implements MigrationInterface {
  public async up(_: QueryRunner): Promise<void> {


    const adminUser = new User();
    adminUser.username = 'intopros';
    adminUser.email = 'admin@intopros.com';
    adminUser.role = UserRole.ADMIN;
    adminUser.password = hashSync('Secret@123', 3);

    await getRepository(User).save(adminUser);
  }

  public async down(_: QueryRunner): Promise<void> {}
}
