import TelegramBot, { ChatId } from 'node-telegram-bot-api'

export type User = {
  chatId: ChatId
  firstName?: string
  lastName?: string
  userName?: string
  tryCount: number
}

export type TTask = {
  data: string
  user: User
  bot: TelegramBot
  currentOptions: TelegramBot.SendMessageOptions
  nextOptions: TelegramBot.SendMessageOptions
  rightAnswer: string
  msgs: {
    [key in 'right' | 'next']: string
  }
}

type ExcludeKeys = 'data' | 'user' | 'bot'

export type TaskConfig = Omit<TTask, ExcludeKeys>
