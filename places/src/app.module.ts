import { Module } from '@nestjs/common';
import { PlacesModule } from './places/places.module';
import { PlacesController } from './places/places.controller';
import { PlacesService } from './places/places.service';
import { PrismaModule } from './prisma/prisma.module';
import { PlacesTypeModule } from './places-type/places-type.module';
import { PlacesTypeRepository } from './places-type/places-type-repository';

@Module({
  imports: [PlacesModule, PrismaModule, PlacesTypeModule],
  controllers: [PlacesController],
  providers: [PlacesService],
})
export class AppModule {}
