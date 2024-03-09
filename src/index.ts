import TelegramBot, { ChatId } from 'node-telegram-bot-api'
import { User as TUser } from './types/types.js'
import { TRY_COUNT, commands } from './store/data.js'
import { connectToDb } from './utils/connectToDB.js'
import { Message, User } from './models/Models.js'
import {
  nextOptions,
  capitalOptions,
  startTestOptions
} from './store/options.js'
import { greetingsArr, nextSequence } from './store/steps.js'
import Task from './task.js'
import {
  capitalConfig,
  planetConfig,
  authorConfig
} from './store/taskConfigs.js'
import 'dotenv/config'

class Bot {
  bot: TelegramBot
  user: TUser | null
  chats: Record<string, number>
  startTestOptions: TelegramBot.SendMessageOptions
  capitalOptions: TelegramBot.SendMessageOptions
  nextOptions: TelegramBot.SendMessageOptions
  commands: TelegramBot.BotCommand[]
  stepsCounter: number
  isLastStep: boolean
  isGettingMessagesFromContact: boolean

  constructor() {
    this.bot = new TelegramBot(process.env.TOKEN, { polling: true })
    this.chats = {}
    this.user = null
    this.commands = commands
    this.startTestOptions = startTestOptions
    this.capitalOptions = capitalOptions
    this.nextOptions = nextOptions
    this.stepsCounter = 0
    this.isLastStep = false
    this.isGettingMessagesFromContact = false
  }

  async startBot(chatId: ChatId): Promise<void> {
    this.stepsCounter = 0
    this.isLastStep = false
    await this.bot.sendSticker(
      chatId,
      'https://tlgrm.ru/_/stickers/eb5/41e/eb541eba-3be4-3bea-bd7f-5e487503be39/2.webp'
    )
    for (const [i, step] of greetingsArr.entries()) {
      const isLastMessage = i === greetingsArr.length - 1
      await this.bot.sendMessage(
        chatId,
        step,
        isLastMessage ? this.startTestOptions : undefined
      )
    }
    return
  }

  async handleUser(user: TUser): Promise<TUser> {
    const currentUser = await User.findOne({ chatId: user.chatId.toString() })
    if (!currentUser) {
      const newUser = await new User(user).save()
      return newUser
    }
    return currentUser
  }

  async denyUserAccess(chatId: ChatId): Promise<void> {
    await this.bot.sendMessage(
      chatId,
      "I'm sorry, but you've exhausted all your attempts for this task. Don't worry, you can try again later or explore other features of EnigmaGuardianBot. Remember, perseverance is key to unlocking the secrets of knowledge! 😔"
    )
  }

  async sendMessageToAdmin(
    chatId: ChatId,
    reason: 'contact' | 'callback',
    msg?: string
  ): Promise<void> {
    if (!msg) return
    const newMessage = new Message({
      message: msg,
      reason,
      chatId
    })
    await Message.create(newMessage)
    await this.bot.sendMessage(
      chatId,
      'Thank you for reaching out to the admin! Your message has been received, and they will be in touch with you shortly. If you have any urgent inquiries, feel free to explore other features of EnigmaGuardianBot in the meantime. Your patience is appreciated! 💬'
    )
  }

  async handleInformation(chatId: ChatId): Promise<void> {
    if (!this.user) return
    const { firstName, lastName, tryCount } = this.user
    let name = ''
    if (firstName) name = firstName || ''
    if (lastName) name = name + ' ' + lastName
    if (!firstName && !lastName) name = 'Anonymous'
    const countMessagesFromUser = await Message.countDocuments({
      chatId
    })
    await this.bot.sendMessage(
      chatId,
      `Name: ${name}\nAttempt Count: ${tryCount}\nBanned Status: ${
        tryCount === 0 ? 'Yes' : 'No'
      }\nMessages Sent to Admin: ${countMessagesFromUser || 0}`
    )
  }

  handleCallbacks(): void {
    this.bot.on('callback_query', async (msg) => {
      const data = msg.data

      if (!this.user || !data) return
      const chatId = this.user.chatId
      const isUserBanned = this.user?.tryCount === 0
      if (isUserBanned) return this.denyUserAccess(chatId)

      if (data === '/start_test')
        return this.bot.sendMessage(
          chatId,
          'Let us begin.\nWhat is the capital of France?',
          this.capitalOptions
        )
      if (data.includes('capital'))
        return new Task({
          data,
          user: this.user,
          bot: this.bot,
          ...capitalConfig
        }).on()
      if (data.includes('planet'))
        return new Task({
          data,
          user: this.user,
          bot: this.bot,
          ...planetConfig
        }).on()
      if (data.includes('author'))
        return new Task({
          data,
          user: this.user,
          bot: this.bot,
          ...authorConfig
        }).on()

      if (data === '/next') {
        const msg = nextSequence[this.stepsCounter]
        this.isLastStep = this.stepsCounter === nextSequence.length - 1
        await this.bot.sendMessage(
          chatId,
          msg,
          this.isLastStep ? undefined : this.nextOptions
        )
        if (this.isLastStep) return
        this.stepsCounter += 1
      }
    })
  }

  async handleContact(chatId: ChatId): Promise<void> {
    await this.bot.sendMessage(
      chatId,
      "Welcome to the Contact feature! If you have any questions, feedback, or encounter any issues, feel free to send a message to the admin. Your inquiries are valuable to us, and we're here to assist you with any problems or concerns you may have. Simply type your message, and the admin will get back to you as soon as possible. Thank you for reaching out 👇"
    )
    this.isGettingMessagesFromContact = true
  }

  handleMessages(): void {
    this.bot.on('message', async (msg) => {
      const textMessage = msg.text
      const { id: chatId, first_name, last_name, username } = msg.chat
      const defaultUser = {
        chatId,
        firstName: first_name || '',
        lastName: last_name || '',
        userName: username || '',
        tryCount: TRY_COUNT
      }

      console.log(textMessage)

      try {
        await connectToDb()
        this.user = await this.handleUser(defaultUser)

        if (textMessage === '/start') return this.startBot(chatId)

        if (textMessage === '/contact') return this.handleContact(chatId)

        if (textMessage === '/info') return this.handleInformation(chatId)

        if (this.isLastStep)
          return this.sendMessageToAdmin(chatId, 'callback', textMessage)
        if (!this.isLastStep && !this.isGettingMessagesFromContact)
          return this.bot.sendMessage(
            chatId,
            "I'm sorry, but I didn't quite catch that. If you need assistance or have any questions, feel free to explore the available features or type 'help' for more information. Thank you for your understanding! 🤔"
          )

        if (this.isGettingMessagesFromContact) {
          await this.sendMessageToAdmin(chatId, 'contact', textMessage)
          this.isGettingMessagesFromContact = false
        }
      } catch (error: any) {
        console.log(error.message)
        return this.bot.sendMessage(
          chatId,
          'Something went wrong, please try again'
        )
      }
    })
  }

  init(): void {
    try {
      this.bot.setMyCommands(this.commands)
      console.log('Telegram bot server is running...')
      this.handleMessages()
      this.handleCallbacks()
    } catch (error: any) {
      console.log(error.message)
    }
  }
}

const bot = new Bot()
bot.init()
