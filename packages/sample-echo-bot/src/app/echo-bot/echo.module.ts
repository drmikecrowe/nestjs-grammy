import debug from 'debug'
const log = debug('bot:echo.module')

import { Module } from '@nestjs/common'
// import { EchoUpdate } from './echo.update'
import { EchoService } from './echo.service'
import { NestjsGrammyModule, getBotName } from 'nestjs-grammy'

@Module({
  providers: [EchoService],
  imports: [],
})
export class EchoBotModule {
  /**
   * constructor(private echoService: EchoService)
   */
  constructor() {
    log('EchoBotModule starting')
  }
}
