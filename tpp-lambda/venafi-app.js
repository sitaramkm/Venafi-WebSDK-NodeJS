const axios = require('./node_modules/axios')
const baseURL = 'https://<<REPLACE_WITH_tppURL>>/vedsdk'
//const username = 'REPLACE_WITH_<<tppadminusername>>';
//const password = 'REPLACE_WITH_<<tppadminpassword>>';
let response;
process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0 // this is a workaround. Resolve this.

/**
 *
 * Event doc: https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html#api-gateway-simple-proxy-for-lambda-input-format
 * @param {Object} event - API Gateway Lambda Proxy Input Format
 *
 * Context doc: https://docs.aws.amazon.com/lambda/latest/dg/nodejs-prog-model-context.html 
 * @param {Object} context
 *
 * Return doc: https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html
 * @returns {Object} object - API Gateway Lambda Proxy Output Format
 * 
 */
exports.lambdaHandler =  async (event, context, callback) => {
    try {
      
        console.log('Executing Function: [', context.functionName + ']');
        console.log('Received event: ',JSON.stringify(event, null, 2));
        
        let venafikey = '20e3f899-a42f-9286-3e1f-949beab90a96';
        const config = checkValid(venafikey);
        let res =   await axios(config);
        response  = res.data;
        console.log(response);
    } catch (err) {
        handleError(err);
        return err;
    }
    return response;
};

/**
 * CheckValid lambda function returning whether the Venafi API Key's validity
 * @param {*} apikey 
 */ 
function checkValid(apikey) {
    return {
        method: 'get',
        url: baseURL + '/authorize/checkvalid',
        headers: { 'X-Venafi-Api-Key': apikey }
    };
}

/**
 * Standard error handler to handle log errors 
 * @param {*} error 
 */
function handleError(error) {
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.log(error.response.data);
      console.log(error.response.status);
      console.log(error.response.headers);
    } else if (error.request) {
      // The request was made but no response was received
      // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
      // http.ClientRequest in node.js
      console.log(error.request);
    } else {
      // Something happened in setting up the request that triggered an Error
      console.log('Error', error.message);
    }
    console.log(error.config);
  }
