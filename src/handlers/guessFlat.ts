import TelegramBot, { ChatId } from 'node-telegram-bot-api'
import { decreaseUserTryCounter, numberFromString } from '../utils/ulils.js'
import { User as TUser } from '../types/types.js'
import { floorOptions, startTestOptions } from '../store/options.js'
import { FLAT_NUMBER } from '../store/data.js'

export default class GuessFlat {
  data: string
  user: TUser
  bot: TelegramBot
  chatId: ChatId
  floorOptions: TelegramBot.SendMessageOptions
  startTestOptions: TelegramBot.SendMessageOptions
  constructor(data: string, user: TUser, bot: TelegramBot) {
    this.user = user
    this.data = data
    this.chatId = this.user.chatId
    this.bot = bot
    this.floorOptions = floorOptions
    this.startTestOptions = startTestOptions
  }

  async guessedFlatNumber() {
    await this.bot.sendMessage(
      this.chatId,
      'Поздравляю! 🤗\nВы выбрали правильный номер квартиры. Продолжайте далее!'
    )
    await this.bot.sendMessage(
      this.chatId,
      'Выберите этаж вашего проживания, на котором был оставлен подарок.',
      this.floorOptions
    )
  }

  async didNotGuessFlatNumber() {
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
        this.startTestOptions
      )
  }

  async on(): Promise<void> {
    const flatNumber = numberFromString(this.data)
    if (!flatNumber) return
    if (!this.user) return
    if (flatNumber === FLAT_NUMBER) {
      await this.guessedFlatNumber()
    } else {
      await this.didNotGuessFlatNumber()
    }
  }
}
