export function config ($logProvider, RestangularProvider, $authProvider) {
  'ngInject';
  // Enable log

  $logProvider.debugEnabled(true);

  let baseUrl = 'http://cftservice.starsbrandingnetwork.com';
  // let baseUrl = 'http://localhost:1337';

  // Restangular
   RestangularProvider.setBaseUrl(baseUrl);
   RestangularProvider.setDefaultHeaders({'Content-Type': 'application/json; charset=UTF-8'});


    $authProvider.httpInterceptor = function() { return true; },
    $authProvider.withCredentials = true;
    $authProvider.tokenRoot = null;
    $authProvider.baseUrl = baseUrl;
    $authProvider.loginUrl = '/auth/login';
    $authProvider.signupUrl = '/auth/signup';
    //$authProvider.unlinkUrl = '/auth/unlink/';
    $authProvider.tokenName = 'token';
    $authProvider.tokenPrefix = 'satellizer';
    $authProvider.tokenHeader = 'Authorization';
    $authProvider.tokenType = 'JWT';
    $authProvider.storageType = 'localStorage';



}


  angular
  .module('awsupload.environmentConfig', [])
  .constant('AWS_CONFIG', {
    'API_VERSIONS' : {
      cognitoidentity : '2014-06-30',
      s3 : '2006-03-01'
    },
    'API_PATH' : 'http://cft-user-profile-pic.s3-website-us-west-1.amazonaws.com',
    'CLOUDFRONT_URL': 'https://d3vy2yzfaizn1q.cloudfront.net',
    'CLOUDFRONT_ORG_URL': 'https://d37u6ga0y3uewq.cloudfront.net',
    'AWS_PATH' : 'https://s3.amazonaws.com/',
    'IMAGE_FORMAT' : ['jpg','png','jpeg','gif'],
    'VIDEO_FORMAT' : ['mp4','flv','webm','mxf','fmp4','3gp','avi','mpeg-2','mov'],
    'REGION' : 'us-west-2',
    'BUCKET_NAME' : 'cft-public-bucket'
  });
