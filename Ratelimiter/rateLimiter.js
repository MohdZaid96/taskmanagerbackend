const { rateLimit } =require('express-rate-limit')

const limiter = rateLimit({
	windowMs: 3 * 60 * 1000, 
	limit: 10,
    message:"Too many requests"
})

module.exports={limiter}