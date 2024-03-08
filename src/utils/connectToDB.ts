import mongoose from 'mongoose'
let isConnected = false

export async function connectToDb() {
  try {
    if (isConnected) {
      console.log('Using existing connection')
      return
    }
    const db = await mongoose.connect(process.env.MONGO_SECURE_KEY as string)
    if (db.connections[0].readyState === 1) {
      console.log('Connection established')
      isConnected = true
    } else {
      console.log('Connection not established')
      isConnected = false
    }
  } catch (error: any) {
    console.log(error.message)
    throw new Error(error)
  }
}
