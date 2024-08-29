import { Module } from '@nestjs/common';
import { PlacesModule } from './places/places.module';
import { PlacesController } from './places/places.controller';
import { PlacesService } from './places/places.service';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [PlacesModule, PrismaModule],
  controllers: [PlacesController],
  providers: [PlacesService],
})
export class AppModule {}
