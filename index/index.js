'use strict'

if (typeof(cache) === 'undefined') {
    var cache = require('./cache');
 }

// Calls the banner proxy and returns the total number of classes
async function invokeLambda(event) {
    let bannerArgs = {
        "school": "temple",
        "term": 202036,
        "method": "classSearch",
         "params": {
           "term": 202036,
            "subject": String(event.subject),
            "offset": 0,
            "pageSize": 1
       }
   };
   
   let bannerInput = {
       FunctionName: 'arn:aws:lambda:us-east-2:741865850980:function:banner-proxy:live',
       InvocationType: 'RequestResponse',
       Payload: JSON.stringify(bannerArgs)
   };

    try {
        let data = await cache.bannerLambda.invoke(bannerInput).promise();
        data.Payload = data.Payload.replace(/\+/g, '');
        return JSON.parse(data.Payload).totalCount;
    }
    catch (err) {
        console.log(err);
        return err;
    }
}

// Calls the update classes lambda and gets class info 25 at a time
async function updateSubj(size, event) {
    for(var index = 0; index < size; index++) {
        let temp = {
            "school": "temple",
            "term": 202036,
            "method": "classSearch",
            "params": {
                "term": 202036,
                "subject": String(event.subject),
                "offset": parseInt(index * 25),
                "pageSize": parseInt((index + 1) * 25)
              }
        };
        
        let subjectInput = {
            FunctionName: 'arn:aws:lambda:us-east-2:741865850980:function:updateClasses',
            InvocationType: 'Event',
            Payload: JSON.stringify(temp)
        };
        
        try {
            await cache.classLambda.invoke(subjectInput).promise();
        }
        catch (err) {
            console.log(err);
        }
    }
}

exports.handler = async (event) => {
    
    // Makes a call to banner API to learn how many total classes in a subject there is
    var result = await invokeLambda(event);
     
    // Prints the subject and amount of classes
    console.log(result);
    console.log(event.subject);

    // Gets all the classes for a subject
    await updateSubj(Math.ceil(result/25), event);   
};
