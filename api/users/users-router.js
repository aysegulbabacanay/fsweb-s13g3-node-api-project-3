const express = require('express');
const {logger,validatePost,validateUserId,validateUser} = require("../middleware/middleware");
// `users-model.js` ve `posts-model.js` sayfalarına ihtiyacınız var
// ara yazılım fonksiyonları da gereklidir

const router = express.Router();
const userModel = require("./users-model");
const postModel = require("../posts/posts-model");

router.get('/',(req, res, next) => {
  // TÜM KULLANICILARI İÇEREN DİZİYİ DÖNDÜRÜN
  userModel.get()
  .then( users => {
    res.json(users)
  })
  .catch(next)
  //burada next dedik, sayfanın sonundaki error middleware ine gitsin diye
});

router.get('/:id', validateUserId,(req, res, next) => {
  //validateUserId ilk çalıscak
  // USER NESNESİNİ DÖNDÜRÜN
  // user id yi getirmek için bir ara yazılım gereklidir
  res.json(req.user);
  //req.user değeri validateUserId den geliyor

});

router.post('/',validateUser, (req, res, next) => {
  // YENİ OLUŞTURULAN USER NESNESİNİ DÖNDÜRÜN
  // istek gövdesini doğrulamak için ara yazılım gereklidir.
  userModel.insert({name: req.name})
  .then( newUser =>{
    res.status(200).json(newUser);
  })
  .catch(next)
});

router.put('/:id',validateUserId, validateUser, async (req, res, next) => {
  //validateUserId yaptıktan sonra next ile validatePost kısmına geçicek

  // YENİ GÜNCELLENEN USER NESNESİNİ DÖNDÜRÜN
  // user id yi doğrulayan ara yazılım gereklidir
  // ve istek gövdesini doğrulayan bir ara yazılım gereklidir.

  try{
    //2 kontrolde yapıldı
    await userModel.update(req.params.id, {name: req.name});
    const updatedUser = await userModel.getById(req.params.id);
    res.status(201).json(updatedUser);
  }
  catch(err){
    next(err);//try-catch yapısı olduğu için böyle yazdık.
  }

  
});

router.delete('/:id',validateUserId, async(req, res, next) => {
  // SON SİLİNEN USER NESNESİ DÖNDÜRÜN
  // user id yi doğrulayan bir ara yazılım gereklidir.
  try{
   await userModel.remove(req.params.id);
  res.json(req.user); 
    // const deletedUser = await userModel.getById(req.params.id);
    // await userModel.remove(req.params.id);
    // res.json(deletedUser);
  }
  catch(err){
    next(err)
  }

});

router.get('/:id/posts',validateUserId, async(req, res,next) => {
  // USER POSTLARINI İÇEREN BİR DİZİ DÖNDÜRÜN
  // user id yi doğrulayan bir ara yazılım gereklidir.
  try{
    const result = await userModel.getUserPosts(req.params.id);
    res.json(result);
  }
  catch(err){
    next(err);
  }

});

router.post('/:id/posts',validateUserId,validatePost, async(req, res, next) => {
  // YENİ OLUŞTURULAN KULLANICI NESNESİNİ DÖNDÜRÜN
  // user id yi doğrulayan bir ara yazılım gereklidir.
  // ve istek gövdesini doğrulayan bir ara yazılım gereklidir.

  try{
    const result = await postModel.insert({
      user_id:req.params.id, //req.user demedik bütün kullanıcıyı alır diye
      text:req.text
    });
    res.json(result);

  }
  catch(err){
    next(err);
  }

});



router.use((err,req,res,next) => {
  res.status(err.status || 500).json({
    customMessage: "Birseyler yanlıs gitti",
    message: err.message
  });
});
// routerı dışa aktarmayı unutmayın

module.exports = router;