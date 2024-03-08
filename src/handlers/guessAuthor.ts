import TelegramBot, { ChatId } from 'node-telegram-bot-api'
import { decreaseUserTryCounter } from '../utils/ulils.js'
import { User as TUser } from '../types/types.js'
import { startConversationOptions, authorOptions } from '../store/options.js'
import { AUTHOR_CORRECT } from '../store/data.js'

export default class GuessStreet {
  data: string
  user: TUser
  bot: TelegramBot
  chatId: ChatId
  authorOptions: TelegramBot.SendMessageOptions
  startConversationOptions: TelegramBot.SendMessageOptions
  constructor(data: string, user: TUser, bot: TelegramBot) {
    this.user = user
    this.data = data
    this.chatId = this.user.chatId
    this.bot = bot
    this.authorOptions = authorOptions
    this.startConversationOptions = startConversationOptions
  }

  async guessedStreet() {
    await this.bot.sendMessage(
      this.chatId,
      "Congratulations! You've successfully completed all the tests."
    )
    await this.bot.sendMessage(
      this.chatId,
      'Prepare yourself to unveil the secret information. 🎉',
      this.startConversationOptions
    )
  }

  async didNotGuessStreet() {
    await decreaseUserTryCounter(this.user)
    const isStillTry = this.user?.tryCount > 0
    await this.bot.sendMessage(
      this.chatId,
      `I'm sorry, that's not the correct answer. You have ${
        this.user?.tryCount || 0
      } tries remaining. Keep trying!`
    )
    if (isStillTry)
      await this.bot.sendMessage(this.chatId, 'Try again!', this.authorOptions)
  }

  async on(): Promise<void> {
    const streetName = this.data
    if (!streetName) return
    if (!this.user) return
    if (streetName.includes(AUTHOR_CORRECT)) {
      await this.guessedStreet()
    } else {
      await this.didNotGuessStreet()
    }
  }
}
