import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { PlacesTypeModule } from './places-type/places-type.module';

@Module({
  imports: [PrismaModule, PlacesTypeModule], // PlacesTypeModule já importa o PrismaModule
})
export class AppModule {}
