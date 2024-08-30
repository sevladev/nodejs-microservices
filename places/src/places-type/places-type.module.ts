import { Module } from '@nestjs/common';
import { PlacesTypeService } from './places-type.service';
import { PlacesTypeController } from './places-type.controller';
import { PlacesTypeRepository } from './places-type-repository';

@Module({
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
