import { cardModel } from '~/models/cardModel'
import { columnModel } from '~/models/columnModel'

const createNew = async (reqbody) => {
  try {
    const newCard = {
      ...reqbody
    }
    const createCard = await cardModel.createNew(newCard)
    const getNewCard = await cardModel.findOneById(createCard.insertedId)

    //...
    if (getNewCard) {
      //xử lý cấu trúc data ở đây trước khi trả dữ liệu về
      getNewCard.cards = []
      //cập nhập mảng ColumnOderIds trong collection boards
      await columnModel.pushCardOrderIds(getNewCard)
    }
    return getNewCard
  } catch (error) {throw error}
}

export const cardService = {
  createNew
}