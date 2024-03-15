import { MongoClient, ServerApiVersion } from 'mongodb'
import { env } from '~/config/environment'
//Khởi tạo đối tượng đầu tiên là null vì chúng chưa connect(biến global)
let trelloDatabasseInstance = null
//kết connect tới MongoDB
const mongoClientInstance = new MongoClient(env.MONGODB_URI, {
  //Chúng ta sẽ chỉ định một cái stable API Version của MongoDB - https://www.youtube.com/redirect?event=video_description&redir_token=QUFFLUhqa05neXY2ZDVJcmEzQktSWFpOMUw4dHNwSmdQQXxBQ3Jtc0trOVdkdVk5RVJCMnZUSjJ0dzAyZG5CVV93dS1maXlQU1lJb2JBUmMzcWpRWHhhZGtlMlYxRVJ2aG5IUFRad0JjNHQ2YVI4QU9jZTB1WklfeFRNOEowSUJGeDhNaGJ1MWtFeWhiekM3cWNmUmswaGJpTQ&q=https%3A%2F%2Fwww.mongodb.com%2Fdocs%2Fdrivers%2Fnode%2Fcurrent%2Ffundamentals%2Fstable-api%2F&v=BYpHB5LnRCQ
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true
  }
})
//kết nối db
export const CONNECT_DB = async () => {
  //kết nối tới MongoDB Atlas với URI đã khai báo trong thân mongoClientInstance
  await mongoClientInstance.connect()
  //kết nối thành công thì ta lấy ra db theo tên và gán ngược lại vào biến mongoClientInstance ở trên chúng ta
  trelloDatabasseInstance = mongoClientInstance.db(env.DATABASE_NAME)
}
export const CLOSE_DB = async () => {
  console.log('code chạy vào cho Close')
  await mongoClientInstance.close()
}

//function GET_DB (không async) có nhiệm vụ export ra nhiều trelloDatabasseInstance sau khi đã connect thành công tới MongoDB để chúng ra sử dụng nó ở nhiều nơi trong code
//lưu ý phải luôn gọi GET_DB này sau khi đã kết nối thành công tới Mongodb
export const GET_DB = () => {
  if (!trelloDatabasseInstance) throw new Error ('Must connect to Database first!')
  return trelloDatabasseInstance
}

