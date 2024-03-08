import TelegramBot, { ChatId } from 'node-telegram-bot-api'
import { decreaseUserTryCounter, numberFromString } from '../utils/ulils.js'
import { User as TUser } from '../types/types.js'
import { floorOptions, streetOptions } from '../store/options.js'
import { FLOOR_NUMBER } from '../store/data.js'

export default class GuessFloor {
  data: string
  user: TUser
  bot: TelegramBot
  chatId: ChatId
  floorOptions: TelegramBot.SendMessageOptions
  streetOptions: TelegramBot.SendMessageOptions
  constructor(data: string, user: TUser, bot: TelegramBot) {
    this.user = user
    this.data = data
    this.chatId = this.user.chatId
    this.bot = bot
    this.floorOptions = floorOptions
    this.streetOptions = streetOptions
  }

  async guessedFloorNumber() {
    await this.bot.sendMessage(
      this.chatId,
      'Отлично! 🤭\nЭтот этаж действительно был местом для небольшого сюрприза. Продолжайте смело!'
    )
    await this.bot.sendMessage(
      this.chatId,
      'Выберите свою улицу из предложенного списка.',
      this.streetOptions
    )
  }

  async didNotGuessFloorNumber() {
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
        this.floorOptions
      )
  }

  async on(): Promise<void> {
    const floorNumber = numberFromString(this.data)
    if (!floorNumber) return
    if (!this.user) return
    if (floorNumber === FLOOR_NUMBER) {
      await this.guessedFloorNumber()
    } else {
      await this.didNotGuessFloorNumber()
    }
  }
}
