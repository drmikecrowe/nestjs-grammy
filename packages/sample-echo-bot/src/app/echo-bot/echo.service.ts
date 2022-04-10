import debug from 'debug'
const log = debug('bot:echo.service')

import { Injectable } from '@nestjs/common'
import { Bot, Context } from 'grammy'
import { InjectBot } from 'nestjs-grammy'
import { EchoBotName } from './echo.constants'

@Injectable()
export class EchoService {
  /**
   *  constructor(@InjectBot(EchoBotName) private readonly bot: Bot<Context>) {
   */
  constructor() {
    log('EchoService starting ')
  }
  echo(text: string): string {
    return `Echo: ${text}`
  }
  showBot() {
    log(this)
  }
}
