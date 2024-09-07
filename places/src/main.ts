import 'reflect-metadata';

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { CustomForbidden } from './global-filters/forbidden';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalFilters(new CustomForbidden());

  await app.listen(3002);
}
bootstrap();
