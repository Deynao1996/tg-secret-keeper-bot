import TelegramBot, { ChatId } from 'node-telegram-bot-api'
import { decreaseUserTryCounter, numberFromString } from '../utils/ulils.js'
import { User as TUser } from '../types/types.js'
import { startConversationOptions, streetOptions } from '../store/options.js'
import { STREET_NAME } from '../store/data.js'

export default class GuessStreet {
  data: string
  user: TUser
  bot: TelegramBot
  chatId: ChatId
  streetOptions: TelegramBot.SendMessageOptions
  startConversationOptions: TelegramBot.SendMessageOptions
  constructor(data: string, user: TUser, bot: TelegramBot) {
    this.user = user
    this.data = data
    this.chatId = this.user.chatId
    this.bot = bot
    this.streetOptions = streetOptions
    this.startConversationOptions = startConversationOptions
  }

  async guessedStreet() {
    await this.bot.sendMessage(
      this.chatId,
      'Верно! 🥳\nВы выбрали свою улицу. Продолжайте дальше!'
    )
    await this.bot.sendMessage(
      this.chatId,
      'Ну что же, поздравляю! Это действительно ты, нет сомнений! 🎉',
      this.startConversationOptions
    )
  }

  async didNotGuessStreet() {
    await decreaseUserTryCounter(this.user)
    const isStillTry = this.user?.tryCount > 0
    const pluralText = isStillTry ? 'попытка' : 'попыток'
    const pluralTryText = isStillTry ? 'Осталась' : 'Осталось'
    await this.bot.sendMessage(
      this.chatId,
      `К сожалению, это неверно. ${pluralTryText} всего ${
        this.user?.tryCount || 0
      } ${pluralText}`
    )
    if (isStillTry)
      await this.bot.sendMessage(
        this.chatId,
        'Попробуйте еще',
        this.streetOptions
      )
  }

  async on(): Promise<void> {
    const streetName = this.data
    if (!streetName) return
    if (!this.user) return
    if (streetName.includes(STREET_NAME)) {
      await this.guessedStreet()
    } else {
      await this.didNotGuessStreet()
    }
  }
}
