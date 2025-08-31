import { Module } from '@nestjs/common';
import { ThrottlerModule } from '@nestjs/throttler';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => [
        {
          ttl: 60000, // 1 minute
          limit: 100, // 100 requests per minute
        },
        {
          ttl: 60000, // 1 minute
          limit: 10, // 10 requests per minute for auth endpoints
          name: 'auth',
        },
      ],
    }),
  ],
})
export class AppThrottlerModule {}
