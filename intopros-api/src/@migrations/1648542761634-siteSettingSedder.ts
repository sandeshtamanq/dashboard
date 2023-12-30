import { getRepository, MigrationInterface, QueryRunner } from 'typeorm';

import { SiteSetting } from '../site-settings/entities/site-setting.entity';

export class siteSettingSedder1648542761634 implements MigrationInterface {
  public async up(_: QueryRunner): Promise<void> {
    const siteSettings = new SiteSetting();

    await getRepository(SiteSetting).save(siteSettings);
  }

  public async down(_: QueryRunner): Promise<void> {}
}
