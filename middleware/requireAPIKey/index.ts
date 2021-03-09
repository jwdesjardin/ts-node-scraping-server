import express from 'express'

export const requireAPIKey: express.RequestHandler =  async (req, res, next) => {
	if (req.query.API_KEY && req.query.API_KEY === process.env.SERVER_API_KEY){
    next()
  } else {
    res.send('Missing API_KEY')
  }
}