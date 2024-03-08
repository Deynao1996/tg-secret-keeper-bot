import TelegramBot from 'node-telegram-bot-api'

export const startTestOptions: TelegramBot.SendMessageOptions = {
  reply_markup: {
    inline_keyboard: [
      [
        {
          text: 'Begin Task',
          callback_data: '/start_test'
        }
      ]
    ]
  }
} as const

export const capitalOptions: TelegramBot.SendMessageOptions = {
  reply_markup: {
    inline_keyboard: [
      [
        {
          text: 'London',
          callback_data: '/capital_London'
        }
      ],
      [
        {
          text: 'Berlin',
          callback_data: '/capital_Berlin'
        }
      ],
      [
        {
          text: 'Paris',
          callback_data: '/capital_Paris'
        }
      ],
      [
        {
          text: 'Rome',
          callback_data: '/capital_Rome'
        }
      ]
    ]
  }
} as const

export const planetOptions: TelegramBot.SendMessageOptions = {
  reply_markup: {
    inline_keyboard: [
      [
        {
          text: 'Venus',
          callback_data: '/planet_Venus'
        }
      ],
      [
        {
          text: 'Jupiter',
          callback_data: '/planet_Jupiter'
        }
      ],
      [
        {
          text: 'Mars',
          callback_data: '/planet_Mars'
        }
      ],
      [
        {
          text: 'Saturn',
          callback_data: '/planet_Saturn'
        }
      ]
    ]
  }
} as const

export const authorOptions: TelegramBot.SendMessageOptions = {
  reply_markup: {
    inline_keyboard: [
      [
        {
          text: 'F. Scott Fitzgerald',
          callback_data: '/author_Fitzgerald'
        }
      ],
      [
        {
          text: 'Ernest Hemingway',
          callback_data: '/author_Hemingway'
        }
      ],
      [
        {
          text: 'J.D. Salinger',
          callback_data: '/author_Salinger'
        }
      ],
      [
        {
          text: 'Mark Twain',
          callback_data: '/author_Twain'
        }
      ]
    ]
  }
} as const

export const againOptions: TelegramBot.SendMessageOptions = {
  reply_markup: {
    inline_keyboard: [
      [
        {
          text: 'Try again',
          callback_data: '/again'
        }
      ]
    ]
  }
} as const

export const startConversationOptions: TelegramBot.SendMessageOptions = {
  reply_markup: {
    inline_keyboard: [
      [
        {
          text: 'Unveil Secrets!',
          callback_data: '/next'
        }
      ]
    ]
  }
} as const

export const nextOptions: TelegramBot.SendMessageOptions = {
  reply_markup: {
    inline_keyboard: [
      [
        {
          text: 'Next Secret',
          callback_data: '/next'
        }
      ]
    ]
  }
} as const
