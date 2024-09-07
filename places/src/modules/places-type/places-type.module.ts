import { MiddlewareConsumer, Module } from '@nestjs/common';
import { PlacesTypeService } from './places-type.service';
import { PlacesTypeRepository } from './places-type-repository';
import { PlacesTypeController } from './places-type.controller';
import { JwtModule } from '@nestjs/jwt';
import { PrismaModule } from '../../providers/prisma/prisma.module';
import { AuthMiddleware } from '../../middlewares/auth.middleware';
import { RedisModule } from '../../providers/redis/redis.module';

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
