//Điều hướng
const guestController = require('./handle/guestController');
const ErrorController = require('./handle/errorController');
const userController = require('./handle/userController');
<<<<<<< HEAD
const adminController = require('./handle/adminController')
=======
const adminController = require('./handle/adminController');
>>>>>>> f229521d13587858a728228fd9f4b49ef1f51954



const router = {
    //! guest control
    "home" : guestController.home,
    'signin':guestController.signIn,
    'signup':guestController.signUp,
    'blogAdmin':adminController.blogAdmin,
    'blogUser':userController.blogUser,
    "blog-details": guestController.blogDetails,
    "my-profile-connections" : guestController.profileConnection,
    "my-profile" : guestController.myProfile,
    "offline" : guestController.offline,
    "" : guestController.home,
    'editPost':userController.editPost
};

module.exports = router;