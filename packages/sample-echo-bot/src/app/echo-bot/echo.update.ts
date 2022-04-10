import { UseFilters, UseGuards, UseInterceptors } from '@nestjs/common'
import { EchoService } from './echo.service'
import { ReverseTextPipe } from '../common/pipes/reverse-text.pipe'
import { ResponseTimeInterceptor } from '../common/interceptors/response-time.interceptor'
import { AdminGuard } from '../common/guards/admin.guard'
import { GrammyExceptionFilter } from '../common/filters/grammy-exception.filter'
import { EchoBotName } from './echo.constants'
import debug from 'debug'
const log = debug('bot:echo.update')

import { Bot, Context } from 'grammy'
import { InjectBot, Update, Message } from 'nestjs-grammy'

@Update()
@UseInterceptors(ResponseTimeInterceptor)
@UseFilters(GrammyExceptionFilter)
export class EchoUpdate {
  constructor(
    @InjectBot(EchoBotName)
    private readonly bot: Bot<Context>,
    private readonly echoService: EchoService,
  ) {
    log('echo update starting', this.bot ? this.bot.botInfo : '(booting)')
    bot.command('start', this.onStart)
    bot.command('help', this.onHelp)
    bot.on('message', this.onSomething)
    // bot.on('message', this.onMessage)
  }

  // @Start()
  async onStart(): Promise<string> {
    // const me = await this.bot.api.getMe()
    log('echo update starting', this.bot ? this.bot.botInfo : '(booting)')
    return `Hey, I'm ${this.bot.botInfo.first_name}`
  }

  async onSomething(any: any): Promise<string> {
    log(`Received: `, any)
    return 'Called onSomething'
  }

  async onHelp(): Promise<string> {
    return 'Send me any text'
  }

  // @Command('admin')
  @UseGuards(AdminGuard)
  onAdminCommand(): string {
    return 'Welcome judge'
  }

  // @On('message')
  onMessage(@Message('text', new ReverseTextPipe()) reversedText: string): string {
    return this.echoService.echo(reversedText)
  }
}
