export function routerConfig ($stateProvider, $urlRouterProvider) {
  'ngInject';
  $stateProvider
    .state('home', {
      url: '/',
      templateUrl: 'app/components/header/header.html',
      controller: 'HeaderController',
      controllerAs: 'vm',
      data: {
        requiredLogin: false
      }
    })
    .state('home.profile', {
      url: '/profile',
      templateUrl: 'app/profile/profile.html',
      controller: 'ProfileController',
      controllerAs: 'vm',
      data: {
        requiredLogin: true
      }
    })
    .state('login', {
      url: '/login',
      templateUrl: 'app/auth/login/login.html',
      controller: 'LoginController',
      controllerAs: 'vm',
      data: {
        redirect: false,
        hideHeader: true
      }
    })
    .state('admin-dashboard', {
      url: '/dashboard',
      templateUrl: 'app/admin/dashboard/dashboard.html',
      controller: 'DashboardController',
      controllerAs: 'vm',
      data: {
        requiredLogin: true
      }
    })
    .state('manage-advertisers', {
      url: '/admin/manage-advertisers',
      templateUrl: 'app/admin/manageAdvertisers/manageAdvertisers.html',
      controller: 'ManageAdvertisersController',
      controllerAs: 'vm',
      data: {
        requiredLogin: true
      }
    })
    .state('manage-ads', {
      url: '/manage-ads',
      templateUrl: 'app/admin/manageAds/manageAds.html',
      controller: 'ManageAdsController',
      controllerAs: 'manageAd',
      data: {
        requiredLogin: true
      }
    })
    .state('manage-ads.instantad', {
      url: '/instant-ad/:page/{id}',
      templateUrl: 'app/admin/instantAds/instantAds.html',
      controller: 'InstantAdsController',
      controllerAs: 'vm',
      data: {
        requiredLogin: true
      },
      params: {
        id: null
      }
    })
    .state('manage-ads.puzzlead', {
      url: '/puzzle-ad/:page/{id}',
      templateUrl: 'app/admin/puzzleAds/puzzleAds.html',
      controller: 'PuzzleAdsController',
      controllerAs: 'vm',
      data: {
        requiredLogin: true
      },
      params: {
        id: null
      }
    })
     .state('manage-ads.questad', {
      url: '/quest-ad/:page/{id}',
      templateUrl: 'app/admin/questAds/questAds.html',
      controller: 'QuestAdsController',
      controllerAs: 'vm',
      data: {
        requiredLogin: true
      },
      params: {
        id: null
      }
    })
    .state('manage-ads.lettercollectionad', {
      url: '/letter-collection-ad/:page/{id}',
      templateUrl: 'app/admin/letterCollectionAds/letterCollectionAds.html',
      controller: 'LetterCollectionAdsController',
      controllerAs: 'vm',
      data: {
        requiredLogin: true
      },
      params: {
        id: null
      }
    })
    .state('manage-ad-categories', {
      url: '/admin/manage-ad-categories',
      templateUrl: 'app/admin/manageAdCategories/manageAdCategories.html',
      controller: 'ManageAdCategoriesController',
      controllerAs: 'vm',
      data: {
        requiredLogin: true
      }
    })
    .state('advertiser-dashboard', {
      url: '/dashboard',
      templateUrl: 'app/advertiser/dashboard/dashboard.html',
      controller: 'AdvertiserDashboardController',
      controllerAs: 'vm'
    })
    .state('set-password', {
      url: '/reset-password/:token',
      templateUrl: 'app/auth/setPassword/setPassword.html',
      controller: 'SetPasswordController',
      controllerAs: 'vm',
      data: {
        hideHeader: true
      },
      resolve: {
        verifyToken: verifyToken
      }
    })
    .state('forgot-password', {
      url: '/forgot-password',
      templateUrl: 'app/auth/forgotPassword/forgotPassword.html',
      controller: 'ForgotPasswordController',
      controllerAs: 'vm',
      data: {
        hideHeader: true
      }
    })
    .state('notification', {
      url: '/notification',
      templateUrl: 'app/notification/notification.html',
      controller: 'NotificationController',
      controllerAs: 'vm'
    })
    .state('profile', {
      url: '/profile',
      templateUrl: 'app/profile/profile.html',
      controller: 'ProfileController',
      controllerAs: 'vm'
    })
    .state('payment', {
      url: '/payment/:adId/:adType',
      templateUrl: 'app/payment/payment.html',
      controller: 'PaymentController',
      controllerAs: 'vm',
      data: {
        requiredLogin: true
      }      
    })
    .state('reports', {
      url: '/reports',
      templateUrl: 'app/reports/reports.html',
      controller: 'ReportsController',
      controllerAs: 'vm',
      data: {
        requiredLogin: true
      },
      resolve: {
        getReports: getReports
      }  
    });

  $urlRouterProvider.otherwise('/login');

  function verifyToken(SetPasswordService, $stateParams){
    let data = { resetToken: $stateParams.token };
    return SetPasswordService.resetPassword(data).then(result => {
      return result;
    }, err => {
      return err;
    });
  }

  function getReports(ManageAdsService){
    return  ManageAdsService.getReports().then(response => {
      return response;
    }, err => {
      return err;
    });
  }
}

