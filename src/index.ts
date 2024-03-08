import TelegramBot, { ChatId } from 'node-telegram-bot-api'
import { User as TUser } from './types/types.js'
import { TRY_COUNT, commands } from './store/data.js'
import { connectToDb } from './utils/connectToDB.js'
import { Message, User } from './models/Models.js'
import {
  nextOptions,
  startFlatOptions,
  startTestOptions
} from './store/options.js'
import { greetingsArr, nextSequence } from './store/steps.js'
import GuessFlat from './handlers/guessFlat.js'
import GuessFloor from './handlers/guessFloor.js'
import GuessStreet from './handlers/guessStreet.js'
import 'dotenv/config'

//TODO CHECK COMMANDS

class Bot {
  bot: TelegramBot
  user: TUser | null
  chats: Record<string, number>
  startTestOptions: TelegramBot.SendMessageOptions
  startFlatOptions: TelegramBot.SendMessageOptions
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
    this.startFlatOptions = startFlatOptions
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
      'Ваши попытки исчерпаны. Доступ к тесту больше недоступен. 😔'
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
      'Спасибо за обратную связь. Я обязательно прочитаю это сообщение в скором времени 💬'
    )
  }

  async handleInformation(chatId: ChatId): Promise<void> {
    if (!this.user) return
    const { firstName, lastName, tryCount } = this.user
    let name = ''
    if (firstName) name = firstName || ''
    if (lastName) name = name + ' ' + lastName
    if (!firstName && !lastName) name = 'Аноним'
    const countMessagesFromUser = await Message.countDocuments({
      chatId
    })
    await this.bot.sendMessage(
      chatId,
      `Ваше имя: ${name}\nВаши попытки: ${tryCount}\nЗабанен: ${
        tryCount === 0 ? 'да' : 'нет'
      }\nОтправлено личных сообщений разработику: ${countMessagesFromUser || 0}`
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
          'Давайте начнем.\nПожалуйста, выберите номер своей квартиры, где был оставлен маленький подарок.',
          this.startFlatOptions
        )
      if (data.includes('flat'))
        return new GuessFlat(data, this.user, this.bot).on()
      if (data.includes('floor'))
        return new GuessFloor(data, this.user, this.bot).on()
      if (data.includes('street'))
        return new GuessStreet(data, this.user, this.bot).on()

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
      'Если у вас возникли вопросы или проблемы, пожалуйста, опишите свою проблему сообщением ниже. 👇'
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
            'Неопознанная команда. Чего-чего? 🤔'
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
