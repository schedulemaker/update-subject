'use strict'

if(typeof(AWS) === 'undefined') {
    var AWS = require('aws-sdk');
}

if(typeof(bannerLambda) === 'undefined') {
    var bannerLambda = new AWS.Lambda();
}

if(typeof(campusLambda) === 'undefined') {
    var campusLambda = new AWS.Lambda();
}

module.exports = {
    AWS: AWS,
    bannerLambda: bannerLambda,
    campusLambda: campusLambda,
};
