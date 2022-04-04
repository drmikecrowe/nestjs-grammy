import { Bot } from 'grammy'
import { GrammyModuleOptions } from '../interfaces'

export async function createBotFactory(options: GrammyModuleOptions): Promise<Bot<any>> {
  const bot = new Bot<any>(options.token, options.options)

  bot.use(...(options.middlewares ?? []))

  if (options.pollingOptions) {
    console.log(`pollingOptions: `, options.pollingOptions)
    await bot.start(options.pollingOptions)
  }

  return bot
}
