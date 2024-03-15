/* eslint-disable no-useless-catch */

import { slugify } from '~/utils/formatters'
import { boardModel } from '~/models/boardModel'
import ApiError from '~/utils/ApiError'
import { StatusCodes } from 'http-status-codes'
import { cloneDeep } from 'lodash'

const createNew = async (reqbody) => {
  try {
    //xử lý logic dữ liệu
    const newBoard = {
      ...reqbody,
      slug: slugify(reqbody.title)
    }
    //gọi tới tầng Model để xử lý lưu bản ghi newBoard trong Database
    const createBoard = await boardModel.createNew(newBoard)
    // console.log(createBoard)

    //lấy bản ghi board sau khi gọi(tùy mục tiêu mà sd)
    const getNewBoard = await boardModel.findOneById(createBoard.insertedId)
    // console.log(getNewBoard)

    //làm thêm các xử lý Logic khác với Collection khác tùy đặc thù dự án
    //bắn email, notification về cho admin khi có 1 cái board mới được tạo

    //luôn phải trả về return trong Service
    return getNewBoard
  } catch (error) {throw error}
}

const getDetails = async (boardId) => {
  try {
    const board = await boardModel.getDetails(boardId)
    if (!board) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Board not found')
    }
    //deep clone board ra một cái board mới để xử lý, không ảnh hưởng tới board ban đầu
    const resBoard = cloneDeep(board)
    resBoard.columns.forEach(column => {
      //đưa card về đúng column của nó
      //cách dùng .equals này là bởi vì ObjectId trong MongoDb có support method .equals
      column.cards = resBoard.cards.filter(card => card.columnId.equals(column._id))
      //cách khác convert ObjectId về string bằng hàm toString của Js
      //column.cards = resBoard.cards.filter(card => card.columnId.toString() === column._id.toString())
    })
    //xóa mảng cards khỏi board ban đầu
    delete resBoard.cards

    return resBoard
  } catch (error) {throw error}
}
export const boardService = {
  createNew,
  getDetails
}