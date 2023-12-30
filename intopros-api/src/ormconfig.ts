export default {
  type: 'postgres',
  host: process.env.DB_HOST,
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  port: +process.env.DB_PORT!,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,

  entities: [__dirname + '/**/*.entity{.ts,.js}'],
  migrations: [__dirname + '/@migrations/**/*{.ts,.js}'],

  // This is a deadly thing to be used in production
  // synchronize: process.env.NODE_ENV !== 'production',

  // TODO:: Remove it in near future
  synchronize: true,

  // Logging, but not in production
  logging: false,

  cli: {
    migrationsDir: 'src/@migrations',
  },
};
