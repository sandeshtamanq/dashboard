import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleModule } from '@nestjs/schedule';
import { MailerModule } from '@nestjs-modules/mailer';
import { MulterModule } from '@nestjs/platform-express';

import { CmsModule } from './cms/cms.module';
import { OtpModule } from './otp/otp.module';
import { AuthModule } from './auth/auth.module';
import { BlogModule } from './blog/blog.module';
import { TasksModule } from './tasks/tasks.module';
import { UploadModule } from './upload/upload.module';
import { GalleryModule } from './gallery/gallery.module';
import { ContactUsModule } from './contact-us/contact-us.module';
import { TestimonialsModule } from './testimonials/testimonials.module';
import { UsersModule } from './users/users.module';

import { DashboardModule } from './dashboard/dashboard.module';
import { SiteSettingsModule } from './site-settings/site-settings.module';
import { CareerModule } from './career/career.module';
import { ServicesModule } from './services/services.module';
import { TrainingsModule } from './trainings/trainings.module';

import ApiLog from './@entities/apiLog.entity';

import ormConfig from './ormconfig';
import mailerConfig from './@utils/smtpConfig';
import { TechnologiesModule } from './technologies/technologies.module';
import { OurTeamModule } from './our-team/our-team.module';
import { WorksModule } from './works/works.module';
import { OurClientModule } from './our-clients/our-clients.module';

@Module({
  imports: [
    // TypeORM
    TypeOrmModule.forRoot(ormConfig as any),
    TypeOrmModule.forFeature([ApiLog]),
    // Nodemailer for SMTP
    MailerModule.forRoot(mailerConfig),
    // Multer for file uploads
    MulterModule.register(),
    // Tasks scheduling
    ScheduleModule.forRoot(),
    // App Modules
    AuthModule,
    UsersModule,
    TestimonialsModule,
    BlogModule,
    OtpModule,
    SiteSettingsModule,
    DashboardModule,
    ContactUsModule,
    CmsModule,
    UploadModule,
    TasksModule,
    GalleryModule,
    CareerModule,
    ServicesModule,
    TrainingsModule,
    TechnologiesModule,
    OurTeamModule,
    WorksModule,
    OurClientModule
  ],
  exports: [MulterModule],
  
})


export class AppModule {}
