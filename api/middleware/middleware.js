const userModel = require("../users/users-model");

function logger(req, res, next) {
  // SİHRİNİZİ GÖRELİM
  const method = req.method; //Get Post Put ...
  const url = req.originalUrl; // /api/users , /api/user/7 vb
  const timeStamp = new Date().toLocaleString();
  console.log(`[${timeStamp}] , ${method} -- ${url}`);
  //cevap yollaması için next dedik
  next();
}

async function validateUserId(req, res, next) {
  // SİHRİNİZİ GÖRELİM
  try{
    const user = await userModel.getById(req.params.id);
    if(!user){
      res.status(404).json({
        message :"not found"
      })
      //cevap yollarsak next yazma
    }
    else{
      req.user = user;
      //get/:id de sadece req.user yaparak cevap yollarız
    }
    next();
    //cevap için next (response olduğunda next yazmak zorunda değiliz.)
  }
  catch(err){
    res.status(500).json({
      message: "İslem yapılamadı"
    })
  }

}

function validateUser(req, res, next) {
  // SİHRİNİZİ GÖRELİM
  // gelen body kontrolunu burada yaptık
  const { name } = req.body;
  if(!name){
    res.status(400).json({
      message:"gerekli name alanı eksik"
    })
  }
  else{
    req.name = name;  //önce body içinden name i aldık sonra bunu kullandık. req.name i bizim bodyden aldığımız name e atadık.
    next();
  }
}

function validatePost(req, res, next) {
  // SİHRİNİZİ GÖRELİM
  const {text} = req.body;
  if(!text){
    res.status(400).json({
      message:"text eksik"
    })
  }
  else{
    req.text=text;
    next();
  }
}

// bu işlevleri diğer modüllere değdirmeyi unutmayın

module.exports = {logger, 
  validateUserId, 
  validateUser, 
  validatePost}