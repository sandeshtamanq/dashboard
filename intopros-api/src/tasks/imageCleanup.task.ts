import { Cron } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable, Logger } from '@nestjs/common';

import { Between, IsNull, Not, Repository } from 'typeorm';

import fs from 'fs';
import dayjs from 'dayjs';

@Injectable()
export class ImageCleanupTask {
  constructor(
  ) {}

  readonly logger = new Logger(ImageCleanupTask.name);

  @Cron('1 1 */1 * *', {
    name: 'ImageCleanup',
  })
  async cleanUnusedImages() {
    // TODO:: This is yet to be done

    const previousMonth = dayjs()
      // .subtract(1, 'week')
      .startOf('month')
      .format('YYYY-MM');

    const [prevMonthStart, prevMonthEnd] = [
      dayjs().subtract(1, 'week').startOf('month').format(),
      dayjs().subtract(1, 'week').endOf('month').format(),
    ];

    // const [userPortfolioData] = await Promise.all([
    //   this.userPortfolioRepository.find({
    //     select: ['images'],
    //     where: {
    //       images: Not(IsNull()),
    //       updatedAt: Between(prevMonthStart, prevMonthEnd),
    //     },
    //   }),
    // ]);

    // get all files
    const fileList = fs
      .readdirSync(`./uploads/${previousMonth}`)
      .map((file) => `./uploads/${previousMonth}/${file}`);

    // console.log(fileList);
  }
}
