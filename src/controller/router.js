//Điều hướng
const guestController = require('./handle/guestController');
const ErrorController = require('./handle/errorController');
const userController = require('./handle/userController');



const router = {
    //! guest control
    "home" : guestController.home,
    'signin':guestController.signIn,
    'signup':guestController.signUp,
    'blogAdmin':guestController.blogAdmin,
    // 'blogAdmin':adminController.blogAdmin,
    'blogUser':userController.blogUser,
    "blog-details": guestController.blogDetails,
    "my-profile-connections" : guestController.profileConnection,
    "my-profile" : guestController.myProfile,
    "offline" : guestController.offline,
    "" : guestController.home
};

module.exports = router;