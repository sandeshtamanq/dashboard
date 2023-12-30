import { decode } from 'jsonwebtoken';
import { Logger } from '@nestjs/common';
import { getRepository } from 'typeorm';
import { ExtractJwt } from 'passport-jwt';
import { Request, NextFunction } from 'express';

import ApiLog from '../@entities/apiLog.entity';
import User from '../users/entities/user.entity';

export async function APILogger(req: Request, _: any, next: NextFunction) {
  // No need to worry about OPTIONS method
  if (req.method === 'OPTIONS') return next();

  // Logging every API call to terminal
  const logger = new Logger('API CALL');
  logger.log(`${req.method} - ${req.path} :: ${JSON.stringify(req.query)}`);

  // Exit if no token provided
  const token = ExtractJwt.fromAuthHeaderAsBearerToken()(req);
  if (!token) return next();

  const details = decode(token);
  if (!details) return next();

  const apiLog = new ApiLog();
  apiLog.method = req.method;
  apiLog.path = req.path;
  apiLog.queryParams = JSON.stringify(req.query);
  apiLog.source = req.get('intopros-source') ?? 'web';
  apiLog.userId = details.sub as any as number;

  const userRepository = getRepository(User);

  // Save the data to the DB
  await Promise.all([
    // Save the API log
    getRepository(ApiLog).save(apiLog),
    // Update the user's last active date
    userRepository.update(
      { id: details.sub as any as number },
      { lastActiveDate: new Date() },
    ),
  ]).catch(() => null);

  next();
}
