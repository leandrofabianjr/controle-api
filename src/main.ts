import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { AppModule } from './app.module';
import * as exphbs from 'express-handlebars';
import * as passport from 'passport';
import session = require('express-session');
import flash = require('connect-flash');
import inputWithError from './handlebars/input-with-error.helper';
import selectWithError from './handlebars/select-with-error.helper';
import isInvalidClass from './handlebars/is-invalid-class.helper';
import invalidFeedback from './handlebars/invalid-feedback.helper';
import ifCond from './handlebars/if-cond.helper';
import ifError from './handlebars/if-error.helper';
import { arrayElement } from './handlebars/array-element.helper';
import json from './handlebars/json.helper';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.useStaticAssets(join(__dirname, '..', 'statics'));
  app.setBaseViewsDir(join(__dirname, '..', 'views'));
  app.setViewEngine('hbs');

  app.engine(
    '.hbs',
    exphbs({
      extname: '.hbs',
      defaultLayout: 'main',
      helpers: {
        json,
        inputWithError,
        selectWithError,
        isInvalidClass,
        invalidFeedback,
        ifCond,
        ifError,
        arrayElement,
      },
    }),
  );

  app.use(
    session({
      secret: 'very secret',
      resave: false,
      saveUninitialized: false,
    }),
  );

  app.use(passport.initialize());
  app.use(passport.session());
  app.use(flash());

  await app.listen(3000);
}
bootstrap();
