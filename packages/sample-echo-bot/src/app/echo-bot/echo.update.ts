import { UseFilters, UseGuards, UseInterceptors } from '@nestjs/common'
import { EchoService } from './echo.service'
import { ReverseTextPipe } from '../common/pipes/reverse-text.pipe'
import { ResponseTimeInterceptor } from '../common/interceptors/response-time.interceptor'
import { AdminGuard } from '../common/guards/admin.guard'
import { GrammyExceptionFilter } from '../common/filters/grammy-exception.filter'
import { EchoBotName } from './echo.constants'
import { Bot, Context } from 'grammy'
import { InjectBot, Update, Message } from 'nestjs-grammy'

import debug from 'debug'
const log = debug('bot:echo.update')

@Update()
@UseInterceptors(ResponseTimeInterceptor)
@UseFilters(GrammyExceptionFilter)
export class EchoUpdate {
  constructor(
    @InjectBot(EchoBotName)
    private readonly bot: Bot<Context>,
    private readonly echoService: EchoService,
  ) {
    log('echo update starting', bot ? bot.botInfo : '(booting)')
    bot.on('my_chat_member', this.onStart)
    bot.command('help', this.onHelp)
    // bot.on('message', this.onMessage)
  }

  // @Start()
  async onStart(): Promise<string> {
    const me = await this.bot.api.getMe()
    return `Hey, I'm ${me.first_name}`
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
