import TelegramBot, { ChatId } from 'node-telegram-bot-api'
import { TTask, User as TUser } from './types/types.js'
import { decreaseUserTryCounter } from './utils/utils.js'

export default class Task {
  data: string
  user: TUser
  bot: TelegramBot
  chatId: ChatId
  currentOptions: TelegramBot.SendMessageOptions
  nextOptions: TelegramBot.SendMessageOptions
  rightAnswer: string
  msgs: { [key in 'right' | 'next']: string }
  constructor({
    data,
    user,
    bot,
    currentOptions,
    nextOptions,
    rightAnswer,
    msgs
  }: TTask) {
    this.user = user
    this.data = data
    this.chatId = this.user.chatId
    this.bot = bot
    this.currentOptions = currentOptions
    this.nextOptions = nextOptions
    this.rightAnswer = rightAnswer
    this.msgs = msgs
  }

  async guessedAnswer() {
    await this.bot.sendMessage(this.chatId, this.msgs.right)
    await this.bot.sendMessage(this.chatId, this.msgs.next, this.nextOptions)
  }

  async didNotGuessAnswer() {
    await decreaseUserTryCounter(this.user)
    const isStillTry = this.user?.tryCount > 0
    await this.bot.sendMessage(
      this.chatId,
      `I'm sorry, that's not the correct answer. You have ${
        this.user?.tryCount || 0
      }`
    )
    if (isStillTry)
      await this.bot.sendMessage(this.chatId, 'Try again!', this.currentOptions)
  }

  async on(): Promise<void> {
    const answer = this.data
    if (!answer) return
    if (!this.user) return
    if (answer.includes(this.rightAnswer)) {
      await this.guessedAnswer()
    } else {
      await this.didNotGuessAnswer()
    }
  }
}
