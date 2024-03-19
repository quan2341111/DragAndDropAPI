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
  //môi trường Production (cụ thể hiện tại là đang support Render.com)
  if (env.BUILD_MODE === 'production') {
    app.listen(process.env.PORT, () => {
      console.log(`3. Production: Hello ${env.AUTHOR}, Back-end Server is running successfully at Port:${process.env.PORT}/`)
    })
  } else {
    //môi trường dev
    app.listen(env.LOCAL_DEV_APP_PORT, env.LOCAL_DEV_APP_HOST, () => {
      console.log(`3. Local DEV: Hello ${env.AUTHOR}, Back-end Server is running successfully ${env.LOCAL_DEV_APP_HOST}:${env.LOCAL_DEV_APP_PORT}/`)
    })
  }

  //thực hiện scleanup trước khi dừng server
  exitHook(() => {
    console.log('4.Disconnecting from MongoDB Atlas')
    CLOSE_DB()
    console.log('5. Disconnected from MongoDB Atlas')
  })
}

(async () => {
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