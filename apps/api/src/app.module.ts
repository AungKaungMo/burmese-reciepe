import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { createObserveModule } from '@nestjs/observe';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { validateEnv } from './config/env.validation.js';
import { AuthModule } from './modules/auth/auth.module.js';
import { CategoriesModule } from './modules/categories/categories.module.js';
import { IngredientsModule } from './modules/ingredients/ingredients.module.js';
import { IngredientSubstitutionsModule } from './modules/ingredient-substitutions/ingredient-substitutions.module.js';
import { MediaModule } from './modules/media/media.module.js';
import { RecipesModule } from './modules/recipes/recipes.module.js';
import { UsersModule } from './modules/users/users.module.js';
import { PrismaModule } from './prisma/prisma.module.js';

export const { ObserveModule, ObserveInstrument } = createObserveModule();

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, validate: validateEnv }),
    PrismaModule,
    AuthModule,
    UsersModule,
    CategoriesModule,
    RecipesModule,
    IngredientsModule,
    IngredientSubstitutionsModule,
    MediaModule,
    // Distributed tracing, auto-correlated logs, request/job metrics, error
    // telemetry, alarms, and more — out of the box. Sign up at https://observe.nestjs.com
    // ObserveModule.forRoot({
    //   appKey: 'YOUR_APP_KEY',
    //   appSecret: 'YOUR_APP_SECRET',
    //   serviceId: 'api',
    // }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
