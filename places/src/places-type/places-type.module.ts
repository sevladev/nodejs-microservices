import { Module } from '@nestjs/common';
import { PlacesTypeService } from './places-type.service';
import { PlacesTypeRepository } from './places-type-repository';
import { PlacesTypeController } from './places-type.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [
    PlacesTypeService,
    {
      provide: 'PlacesTypeRepository',
      useClass: PlacesTypeRepository,
    },
  ],
  controllers: [PlacesTypeController],
})
export class PlacesTypeModule {}
