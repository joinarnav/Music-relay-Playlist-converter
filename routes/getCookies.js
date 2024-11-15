const {Router} = require('express')

const router = Router()

router.route("/getCookies").get((async(req,res) => {
    const cookie= req.cookies;    

    if(cookie){
        return res.status(200).json({cookie})
    }else{
        return res.status(400).json({
            "message" : "don't have any cookies"
        })
    }
}))

module.exports= router;