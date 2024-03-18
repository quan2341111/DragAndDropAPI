import { boardModel } from '~/models/boardModel'
import { columnModel } from '~/models/columnModel'
import { cardModel } from '~/models/cardModel'
import ApiError from '~/utils/ApiError'
import { StatusCodes } from 'http-status-codes'
const createNew = async (reqbody) => {
  try {
    const newColumn = {
      ...reqbody
    }
    const createColumn = await columnModel.createNew(newColumn)
    const getNewColumn = await columnModel.findOneById(createColumn.insertedId)

    //...
    if (getNewColumn) {
      //xử lý cấu trúc data ở đây trước khi trả dữ liệu về
      getNewColumn.cards = []
      //cập nhập mảng ColumnOderIds trong collection boards
      await boardModel.pushColumnOrderIds(getNewColumn)
    }
    return getNewColumn
  } catch (error) {throw error}
}
const update = async (columnId, reqbody) => {
  try {
    const updateData = {
      ...reqbody,
      updatedAt: Date.now()
    }
    const updateColumn = await columnModel.update(columnId, updateData)

    return updateColumn
  } catch (error) {throw error}
}
const deleteItem = async (columnId) => {
  try {
    const targetColumn = await columnModel.findOneById(columnId)
    //console.log('🚀 ~ deleteItem ~ targetColumn:', targetColumn)

    if (!targetColumn) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Column not found1')
    }

    //xóa Column
    await columnModel.deleteOneById(columnId)
    //Xóa toàn bộ card thuộc Column trên
    await cardModel.deleteManyByColumnId(columnId)
    //xóa ColumnId trong mảng ColumnIds của cái Board chứa nó
    await boardModel.pullColumnOrderIds(targetColumn)
    return { deleteMessage: 'Column and it Cards deleted successfuly!' }
  } catch (error) {throw error}
}
export const columnService = {
  createNew,
  update,
  deleteItem
}