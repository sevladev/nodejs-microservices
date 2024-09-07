import { MiddlewareConsumer, Module } from '@nestjs/common';

import { JwtModule } from '@nestjs/jwt';
import { PrismaModule } from '../../providers/prisma/prisma.module';
import { AuthMiddleware } from '../../middlewares/auth.middleware';
import { RedisModule } from '../../providers/redis/redis.module';
import { PlacesLocationService } from './places-location.service';
import { PlacesLocationController } from './places-location.controller';
import { PlacesLocationRepository } from './places-location.repository';
import { LocationModule } from '../../providers/location/location.module';

@Module({
  imports: [PrismaModule, RedisModule, JwtModule.register({}), LocationModule],
  providers: [
    PlacesLocationService,
    {
      provide: 'PlacesLocationRepository',
      useClass: PlacesLocationRepository,
    },
  ],
  controllers: [PlacesLocationController],
})
export class PlacesLocationModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes(PlacesLocationController);
  }
}
