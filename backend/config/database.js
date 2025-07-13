const mongoose = require("mongoose")

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || "mongodb+srv://jiyagudhaka:zkjKBRLUlt0aX5Jx@assessment.4jltd54.mongodb.net/?retryWrites=true&w=majority&appName=Assessment", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    console.log(`MongoDB Connected: ${conn.connection.host}`)
  } catch (error) {
    console.error("Database connection error:", error)
    process.exit(1)
  }
}

module.exports = connectDB
