import { hashSync } from 'bcrypt';
import { getRepository, MigrationInterface, QueryRunner } from 'typeorm';
import User, { UserRole } from '../users/entities/user.entity';

export class supportSeeder1647422344592 implements MigrationInterface {
  public async up(_: QueryRunner): Promise<void> {

    const adminUser = new User();
    adminUser.username = 'support';
    adminUser.email = 'support@intopros.com';
    adminUser.role = UserRole.SUPPORT;
    adminUser.password = hashSync('Secret@123', 3);

    await getRepository(User).save(adminUser);
  }

  public async down(_: QueryRunner): Promise<void> {}
}
