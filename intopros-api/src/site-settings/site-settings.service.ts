import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';

import { UpdateSiteSettingDto } from './dto/site-setting.dto';
import { SiteSetting } from './entities/site-setting.entity';
import { removeFile } from '../@utils/utils';

@Injectable()
export class SiteSettingsService {
  constructor(
    @InjectRepository(SiteSetting)
    private readonly siteSettingRepository: Repository<SiteSetting>,
  ) {}

  async getSettings() {
    const data = await this.siteSettingRepository.findOne();
    if (data) return data;

    const settings = new SiteSetting();
    const newSettings = await this.siteSettingRepository.save(settings);

    return newSettings;
  }

  async updateSettings(data: UpdateSiteSettingDto) {
    const existingSettings = await this.getSettings();

    //for office 1
    if (data.officeName) existingSettings.officeName = data.officeName;
    if (data.address) existingSettings.address = data.address;
    if (data.phone) existingSettings.phone = data.phone;
    if (data.email) existingSettings.email = data.email;

    //for office 2
    if (data.officeName2) existingSettings.officeName2 = data.officeName2;
    if (data.address2) existingSettings.address2 = data.address2;
    if (data.phone2) existingSettings.phone2 = data.phone2;
    if (data.email2) existingSettings.email2 = data.email2;

    if (data.facebook) existingSettings.facebook = data.facebook;
    if (data.twitter) existingSettings.twitter = data.twitter;
    if (data.linkedIn) existingSettings.linkedIn = data.linkedIn;
    if (data.headerLogo) {
      // Removing old image from file system
      if (existingSettings.headerLogo) removeFile(existingSettings.headerLogo);
      existingSettings.headerLogo =
        data.headerLogo === '{{DELETE}}' ? null : data.headerLogo;
    }
    if (data.footerLogo) {
      // Removing old image from file system
      if (existingSettings.footerLogo) removeFile(existingSettings.footerLogo);
      existingSettings.footerLogo =
        data.footerLogo === '{{DELETE}}' ? null : data.footerLogo;
    }

    return this.siteSettingRepository.save(existingSettings);
  }
}
