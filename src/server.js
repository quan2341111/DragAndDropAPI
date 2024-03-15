/* eslint-disable no-console */

import express from 'express'
import cors from 'cors'
import { CorsOptions } from 'cors'
import exitHook from 'async-exit-hook'
import { CONNECT_DB, CLOSE_DB } from '~/config/mongodb'
import { env } from '~/config/environment'
import { APIs_V1 } from '~/routes/v1'
import { errorHandlingMiddleware } from './middlewares/errorHandlingMiddleware'

const START_SERVER = () => {
  const app = express()
  //Enable req.body json data
  app.use(express.json())
  //xử lý cors
  app.use(cors(CorsOptions))
  app.use('/v1', APIs_V1)


  //Middlware xử lý lỗi tập trung
  app.use(errorHandlingMiddleware)

  app.listen(env.APP_PORT, env.APP_HOST, () => {
    console.log(`3. Hello ${env.AUTHOR}, Back-end Server is running successfully ${env.APP_HOST}:${env.APP_PORT}/`)
  })
  //thực hiện scleanup trước khi dừng server
  exitHook(() => {
    console.log('4.Disconnecting from MongoDB Atlas')
    CLOSE_DB()
    console.log('5. Disconnected from MongoDB Atlas')
  })
}

( async () => {
  try {
    console.log('1. Connecting to MongoDB Cloud Atlas!')
    await CONNECT_DB(console.log('2. Connected to MongoDB Cloud Atlas!'))
    //khởi động be sau khi connect db thành công
    START_SERVER()
  } catch (Error) {
    console.error(Error)
    process.exit(0)
  }
})()
//console.log('1. Connecting to MongoDB Cloud Atlas!')
// //chỉ khi kết nối với server thành công thì chúng ta mới start server backend lên.
// CONNECT_DB()
//   .then(() => console.log('Connected to MongoDB Cloud Atlas!'))
//   .then(() => START_SERVER())
//   .catch(Error => {
//     console.error(Error)
//     process.exit(0)
//   })