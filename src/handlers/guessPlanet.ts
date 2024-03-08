import TelegramBot, { ChatId } from 'node-telegram-bot-api'
import { decreaseUserTryCounter } from '../utils/ulils.js'
import { User as TUser } from '../types/types.js'
import { planetOptions, authorOptions } from '../store/options.js'
import { PLANET_CORRECT } from '../store/data.js'

export default class GuessPlanet {
  data: string
  user: TUser
  bot: TelegramBot
  chatId: ChatId
  planetOptions: TelegramBot.SendMessageOptions
  authorOptions: TelegramBot.SendMessageOptions
  constructor(data: string, user: TUser, bot: TelegramBot) {
    this.user = user
    this.data = data
    this.chatId = this.user.chatId
    this.bot = bot
    this.planetOptions = planetOptions
    this.authorOptions = authorOptions
  }

  async guessedPlanet() {
    await this.bot.sendMessage(
      this.chatId,
      "Excellent! You've answered correctly. You're one step closer to unlocking the secrets."
    )
    await this.bot.sendMessage(
      this.chatId,
      "Who is the author of 'The Great Gatsby'?",
      this.authorOptions
    )
  }

  async didNotGuessPlanet() {
    await decreaseUserTryCounter(this.user)
    const isStillTry = this.user?.tryCount > 0
    await this.bot.sendMessage(
      this.chatId,
      `I'm sorry, that's not the correct answer. You have ${
        this.user?.tryCount || 0
      } tries remaining. Keep trying!`
    )
    if (isStillTry)
      await this.bot.sendMessage(this.chatId, 'Try again!', this.planetOptions)
  }

  async on(): Promise<void> {
    const planetName = this.data
    if (!planetName) return
    if (!this.user) return
    if (planetName.includes(PLANET_CORRECT)) {
      await this.guessedPlanet()
    } else {
      await this.didNotGuessPlanet()
    }
  }
}
