import { MiddlewareConsumer, Module } from '@nestjs/common';
import { PlacesTypeService } from './places-type.service';
import { PlacesTypeRepository } from './places-type-repository';
import { PlacesTypeController } from './places-type.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { RedisModule } from '../redis/redis.module';
import { JwtModule } from '@nestjs/jwt';
import { AuthMiddleware } from '../middlewares/auth.middleware';

@Module({
  imports: [PrismaModule, RedisModule, JwtModule.register({})],
  providers: [
    PlacesTypeService,
    {
      provide: 'PlacesTypeRepository',
      useClass: PlacesTypeRepository,
    },
  ],
  controllers: [PlacesTypeController],
})
export class PlacesTypeModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes(PlacesTypeController);
  }
}
