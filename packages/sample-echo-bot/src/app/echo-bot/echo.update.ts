import debug from 'debug'
const log = debug('bot:echo.update')

import { UseFilters, UseGuards, UseInterceptors } from '@nestjs/common'
import { EchoService } from './echo.service'
import { ReverseTextPipe } from '../common/pipes/reverse-text.pipe'
import { ResponseTimeInterceptor } from '../common/interceptors/response-time.interceptor'
import { AdminGuard } from '../common/guards/admin.guard'
import { GrammyExceptionFilter } from '../common/filters/grammy-exception.filter'
import { EchoBotName } from './echo.constants'
import { Bot, Context } from 'grammy'
import { InjectBot, Update, Message, Start, Hears, Ctx, Help, Admin } from 'nestjs-grammy'

@Update()
@UseInterceptors(ResponseTimeInterceptor)
@UseFilters(GrammyExceptionFilter)
export class EchoUpdate {
  constructor(
    @InjectBot(EchoBotName)
    private readonly bot: Bot<Context>,
    private readonly echoService: EchoService,
  ) {
    log('echo update starting', this.bot ? this.bot.botInfo.id : '(booting)')
  }

  @Start()
  async onStart(@Ctx() ctx: Context): Promise<void> {
    // const me = await this.bot.api.getMe()
    log('onStart!!', this.bot ? this.bot.botInfo : '(booting)')
    ctx.reply(`Hey, I'm ${this.bot.botInfo.first_name}`)
  }

  @Help()
  async onHelp(@Ctx() ctx: Context): Promise<void> {
    ctx.reply('Send me any text')
  }

  @Admin()
  @UseGuards(AdminGuard)
  async onAdminCommand(@Ctx() ctx: Context): Promise<void> {
    ctx.reply('Welcome, Judge')
  }

  @Hears('greetings')
  async onMessage(@Ctx() ctx: Context, @Message('text', new ReverseTextPipe()) reversedText: string): Promise<void> {
    ctx.reply(reversedText)
  }
}
