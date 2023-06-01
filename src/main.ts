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
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // DTO에 정의되지 않은 프로퍼티 자동 제거
      forbidNonWhitelisted: true, // DTO에 정의도지 않은 프로퍼티 요청에 포함 > 요청 거부
      transform: true, // 받아온 데이터를 DTO 클래스로 변환해줌
    }),
  );
  // httpExceptionFilter 적용
  app.useGlobalFilters(new HttpExceptionFilter());
  app.enableCors({
    origin: true,
    credentials: true,
  });
  await app.listen(port);
  Logger.log(`Application running on port ${port}`);
}
bootstrap();
