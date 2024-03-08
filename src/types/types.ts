import { ChatId } from 'node-telegram-bot-api'

export type User = {
  chatId: ChatId
  firstName?: string
  lastName?: string
  userName?: string
  tryCount: number
}
