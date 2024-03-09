import { TaskConfig } from '../types/types.js'
import { AUTHOR_CORRECT, CAPITAL_CORRECT, PLANET_CORRECT } from './data.js'
import {
  authorOptions,
  planetOptions,
  startConversationOptions,
  startTestOptions
} from './options.js'

export const capitalConfig: TaskConfig = {
  rightAnswer: CAPITAL_CORRECT,
  currentOptions: startTestOptions,
  nextOptions: planetOptions,
  msgs: {
    right:
      "Congratulations! 🎉 You've answered correctly. You may proceed to the next challenge.",
    next: "Which planet is known as the 'Red Planet'?"
  }
}

export const planetConfig: TaskConfig = {
  rightAnswer: PLANET_CORRECT,
  currentOptions: planetOptions,
  nextOptions: authorOptions,
  msgs: {
    right:
      "Excellent! You've answered correctly. You're one step closer to unlocking the secrets.",
    next: "Who is the author of 'The Great Gatsby'?"
  }
}

export const authorConfig: TaskConfig = {
  rightAnswer: AUTHOR_CORRECT,
  currentOptions: authorOptions,
  nextOptions: startConversationOptions,
  msgs: {
    right: "Congratulations! You've successfully completed all the tests.",
    next: 'Prepare yourself to unveil the secret information. 🎉'
  }
}
