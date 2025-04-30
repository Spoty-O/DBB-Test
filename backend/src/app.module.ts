import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { WorkerModule } from './modules';
import { CacheModule } from '@nestjs/cache-manager';
import { CACHE_MAX_VALUES, CACHE_TTL } from './shared/constants/cache.const';
import { APP_FILTER } from '@nestjs/core';
import { HttpExceptionFilter } from './shared/filters/http-error.filter';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Worker } from './shared/entities';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    CacheModule.register({
      ttl: CACHE_TTL,
      max: CACHE_MAX_VALUES,
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      url: process.env.DB_URL,
      type: 'postgres',
      synchronize: true,
      entities: [Worker],
      poolErrorHandler: (error) => {
        console.log(error);
        process.exit(1);
      },
    }),
    WorkerModule,
  ],
  providers: [
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
    HttpExceptionFilter,
  ],
})
export class AppModule {}
