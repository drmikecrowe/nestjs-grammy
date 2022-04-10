import debug from 'debug'
const log = debug('bot:app.module')

import { Module } from '@nestjs/common'
import { EchoBotModule } from './echo-bot/echo.module'
import { NestjsGrammyModule } from 'nestjs-grammy'
import { EchoBotName } from './echo-bot/echo.constants'

@Module({
  imports: [
    NestjsGrammyModule.forRoot({
      botName: EchoBotName,
      options: { botInfo: JSON.parse(process.env.BOT_INFO) },
      pollingOptions: {
        onStart: botInfo => {
          log(`Started!  I am ${botInfo.id}`)
        },
      },
      token: process.env.BOT_TOKEN,
      include: [EchoBotModule],
    }),
    EchoBotModule,
  ],
})
export class AppModule {}
