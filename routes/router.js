const router = require('express').Router();
const controller = require('../controller/controller');
const formValidator = require('../middleware/form-validator')
const passport = require('../middleware/passport')
const authController = require('../controller/authController')
const ensureAuthenticated = require('../middleware/ensureAuthenticated')

router.get("/", controller.home);
router.get("/sign-up", controller.getSignUp);
router.post("/sign-up", formValidator.validateSignUp, controller.postSignUp);
router.get("/login", controller.getLogin);
router.post("/login", formValidator.validateLogin, authController);
router.get("/log-out", (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        res.redirect("/");
    });
});
router.get('/addMessage' ,ensureAuthenticated,controller.showMessageForm)
router.post('/addMessage' ,ensureAuthenticated,formValidator.messageValidators ,controller.messageHandler)

router.get('/member',controller.addMember)
router.post('/member', ensureAuthenticated,formValidator.validateMemberForm,controller.postAddMember)

router.get('/admin',ensureAuthenticated,controller.getAdmin)
router.post('/admin',ensureAuthenticated,formValidator.validateAdmin,controller.postAdmin)


router.post('/deleteMessage/:id',ensureAuthenticated, (req ,res ,next)=>{
    if (req.user.admin) {
        return next();
    }else{
        req.addMessage('error','You are not an admin');
        res.redirect('/');
    }
} , controller.deleteMessage)
module.exports = router;