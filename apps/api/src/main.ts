import { NestFactory } from '@nestjs/core';
import { AppModule, ObserveInstrument } from './app.module.js';
import { AllExceptionsFilter } from './common/all-exceptions.filter.js';
import { ResponseInterceptor } from './common/response.interceptor.js';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    instrument: ObserveInstrument,
  });
  app.setGlobalPrefix('v1');
  app.useGlobalInterceptors(new ResponseInterceptor());
  app.useGlobalFilters(new AllExceptionsFilter());
  // `localhost` and `127.0.0.1` are distinct origins to the browser, so allow both
  // for the Vite dev server. Override with a comma-separated CORS_ORIGIN in prod.
  app.enableCors({
    origin: process.env.CORS_ORIGIN?.split(',').map((origin) => origin.trim()) ?? [
      'http://localhost:5173',
      'http://127.0.0.1:5173',
    ],
  });
  await app.listen(process.env.PORT ?? 3000);
}
await bootstrap();
