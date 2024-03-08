import TelegramBot, { ChatId } from 'node-telegram-bot-api'
import { decreaseUserTryCounter } from '../utils/ulils.js'
import { User as TUser } from '../types/types.js'
import { planetOptions, startTestOptions } from '../store/options.js'
import { CAPITAL_CORRECT } from '../store/data.js'

export default class GuessCapital {
  data: string
  user: TUser
  bot: TelegramBot
  chatId: ChatId
  planetOptions: TelegramBot.SendMessageOptions
  startTestOptions: TelegramBot.SendMessageOptions
  constructor(data: string, user: TUser, bot: TelegramBot) {
    this.user = user
    this.data = data
    this.chatId = this.user.chatId
    this.bot = bot
    this.planetOptions = planetOptions
    this.startTestOptions = startTestOptions
  }

  async guessedCapital() {
    await this.bot.sendMessage(
      this.chatId,
      "Congratulations! 🎉 You've answered correctly. You may proceed to the next challenge."
    )
    await this.bot.sendMessage(
      this.chatId,
      "Which planet is known as the 'Red Planet'?",
      this.planetOptions
    )
  }

  async didNotGuessCapital() {
    await decreaseUserTryCounter(this.user)
    const isStillTry = this.user?.tryCount > 0
    await this.bot.sendMessage(
      this.chatId,
      `I'm sorry, that's not the correct answer. You have ${
        this.user?.tryCount || 0
      }`
    )
    if (isStillTry)
      await this.bot.sendMessage(
        this.chatId,
        'Try again!',
        this.startTestOptions
      )
  }

  async on(): Promise<void> {
    const capitalName = this.data
    if (!capitalName) return
    if (!this.user) return
    if (capitalName.includes(CAPITAL_CORRECT)) {
      await this.guessedCapital()
    } else {
      await this.didNotGuessCapital()
    }
  }
}
