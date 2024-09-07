import { Module } from '@nestjs/common';
import { PrismaModule } from './providers/prisma/prisma.module';
import { PlacesTypeModule } from './modules/places-type/places-type.module';
import { PlacesLocationModule } from './modules/places-location/places-location.module';

@Module({
  imports: [PrismaModule, PlacesTypeModule, PlacesLocationModule],
})
export class AppModule {}
