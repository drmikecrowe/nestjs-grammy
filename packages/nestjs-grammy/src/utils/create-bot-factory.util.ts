import { Bot } from 'grammy'
import { GrammyModuleOptions } from '../interfaces'

import debug from 'debug'
const log = debug('nestjs-grammy:create-bot-factory.util')

export async function createBotFactory(options: GrammyModuleOptions): Promise<Bot<any>> {
  const bot = new Bot<any>(options.token, options.options)

  bot.use(...(options.middlewares ?? []))

  if (options.pollingOptions) {
    log('pollingOptions: ', options.pollingOptions)
    await bot.start(options.pollingOptions)
  }
  log(`createBotFactory creating bot: `, options.botName)
  return bot
}
