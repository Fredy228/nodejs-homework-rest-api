const ImageService = require('../services/imgService');

exports.uploadUserPhoto = ImageService.upload('avatar');
