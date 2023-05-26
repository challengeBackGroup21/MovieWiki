import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import * as config from 'config';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/exceptions/http-exception-filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const serverConfig = config.get('server');
  const port = serverConfig.port;
  // class-validator 적용
  app.useGlobalPipes(new ValidationPipe());
  // httpExceptionFilter 적용
  app.useGlobalFilters(new HttpExceptionFilter());
  await app.listen(port);
  Logger.log(`Application running on port ${port}`);
}
bootstrap();
