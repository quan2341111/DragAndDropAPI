import express from 'express'
import { StatusCodes } from 'http-status-codes'
import { boardRoute } from '~/routes/v1/boardRoute'
import { columnRoute } from '~/routes/v1/columnRoute'
import { cardRoute } from '~/routes/v1/cardRoute'

const Router = express.Router()
//Check API v1/status
Router.get('/status', (req, res) => {
  res.status(StatusCodes.OK).json({ message: 'APIs V1 are ready use.' })
})
// Board APIS
Router.use('/boards', boardRoute)

// Column APIS
Router.use('/Columns', columnRoute)

// Card APIS
Router.use('/Cards', cardRoute)

export const APIs_V1 = Router