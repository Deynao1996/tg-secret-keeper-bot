import TelegramBot from 'node-telegram-bot-api'

export const startTestOptions: TelegramBot.SendMessageOptions = {
  reply_markup: {
    inline_keyboard: [
      [
        {
          text: 'Пройти проверку',
          callback_data: '/start_test'
        }
      ]
    ]
  }
} as const

export const startFlatOptions: TelegramBot.SendMessageOptions = {
  reply_markup: {
    inline_keyboard: [
      [
        {
          text: '20',
          callback_data: '/flat_20'
        },
        {
          text: '45',
          callback_data: '/flat_45'
        },
        {
          text: '63',
          callback_data: '/flat_63'
        }
      ],
      [
        {
          text: '88',
          callback_data: '/flat_88'
        },
        {
          text: '76',
          callback_data: '/flat_76'
        },
        {
          text: '11',
          callback_data: '/flat_11'
        }
      ],
      [
        {
          text: '7',
          callback_data: '/flat_7'
        },
        {
          text: '102',
          callback_data: '/flat_102'
        },
        {
          text: '53',
          callback_data: '/flat_53'
        }
      ],
      [
        {
          text: '80',
          callback_data: '/flat_80'
        }
      ]
    ]
  }
} as const

export const floorOptions: TelegramBot.SendMessageOptions = {
  reply_markup: {
    inline_keyboard: [
      [
        {
          text: '1',
          callback_data: '/floor_1'
        },
        {
          text: '2',
          callback_data: '/floor_2'
        },
        {
          text: '3',
          callback_data: '/floor_3'
        }
      ],
      [
        {
          text: '4',
          callback_data: '/floor_4'
        },
        {
          text: '5',
          callback_data: '/floor_5'
        },
        {
          text: '6',
          callback_data: '/floor_6'
        }
      ],
      [
        {
          text: '7',
          callback_data: '/floor_7'
        },
        {
          text: '8',
          callback_data: '/floor_8'
        },
        {
          text: '9',
          callback_data: '/floor_9'
        }
      ],
      [
        {
          text: '10',
          callback_data: '/floor_10'
        }
      ]
    ]
  }
} as const

export const streetOptions: TelegramBot.SendMessageOptions = {
  reply_markup: {
    inline_keyboard: [
      [
        {
          text: 'Георгиевская',
          callback_data: '/street_Georgievskaya'
        }
      ],
      [
        {
          text: 'Храмовая',
          callback_data: '/street_Hramovaya'
        }
      ],
      [
        {
          text: 'Чугуевская',
          callback_data: '/street_Chuguevskaya'
        }
      ],
      [
        {
          text: 'Днипровская',
          callback_data: '/street_Dniprovskaya'
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
          text: 'Я готова продолжать',
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
          text: 'Вперед',
          callback_data: '/next'
        }
      ]
    ]
  }
} as const
