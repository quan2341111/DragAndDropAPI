import { StatusCodes } from 'http-status-codes'
// import ApiError from '~/utils/ApiError'
import { boardService } from '~/services/boardService'

const createNew = async (req, res, next) => {
  try {
    // console.log('req.body:', req.body)
    // console.log('req.query:', req.query)
    // console.log('req.params:', req.params)
    // console.log('req.files:', req.files)
    // console.log('req.cookies:', req.cookies)
    // console.log('req.jwtDecoded:', req.jwtDecoded)
    //Điều hướng dữ liệu sang tầng Service
    const createBoard = await boardService.createNew(req.body)
    //throw new ApiError(StatusCodes.BAD_GATEWAY, 'anhquandev test error')
    //có kết quả rồi trả về phía Client
    res.status(StatusCodes.CREATED).json(createBoard)
  } catch (error) {
    next(error)
    // res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
    //   errors: error.message
    // })
  }
}

const getDetails = async (req, res, next) => {
  try {
    const boardId = req.params.id
    //xử lý sẽ có thêm useId nữa chỉ để lấy board thuộc về user đó thôi
    const board = await boardService.getDetails(boardId)
    res.status(StatusCodes.OK).json(board)
  } catch (error) { next(error) }
}
const update = async (req, res, next) => {
  try {
    const boardId = req.params.id
    const updateBoard = await boardService.update(boardId, req.body)
    res.status(StatusCodes.OK).json(updateBoard)
  } catch (error) { next(error) }
}
const moveCardToDifferentColumn = async (req, res, next) => {
  try {
    const result = await boardService.moveCardToDifferentColumn(req.body)
    res.status(StatusCodes.OK).json(result)
  } catch (error) { next(error) }
}
export const boardController = {
  createNew,
  getDetails,
  update,
  moveCardToDifferentColumn
}