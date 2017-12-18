
import { config } from './index.config';
import { routerConfig } from './index.route';
import { runBlock } from './index.run';
import { AdminDashboardController } from './admin/dashboard/dashboard.controller';
import { AdvertiserDashboardController } from './advertiser/dashboard/dashboard.controller';
import { SetPasswordController } from './auth/setPassword/setPassword.controller';
import { SetPasswordService } from './auth/setPassword/setPassword.service';
import { LoginController } from './auth/login/login.controller';
import { HeaderController } from '../app/components/header/header.controller';
import { ManageAdvertisersController } from './admin/manageAdvertisers/manageAdvertisers.controller';
import { AppController } from '../app/components/appController/app.controller';
import { ModalInstanceController } from '../app/components/modalInstance/modalInstance.controller';
import { CategoryModalInstanceController } from '../app/components/modalInstance/categoryModalInstance.controller';
import { ForgotPasswordController } from '../app/components/modalInstance/forgotPassword.controller';
import { EditCategoryController } from '../app/components/modalInstance/editCategory.controller';
import { LoginService } from './auth/login/login.service';
import { ManageAdvertisersService } from './admin/manageAdvertisers/manageAdvertisers.service';
import { ManageAdsController } from './admin/manageAds/manageAds.controller';
import { InstantAdsController } from './admin/instantAds/instantAds.controller';
import { ManageAdCategoriesController } from './admin/manageAdCategories/manageAdCategories.controller';
import { PaymentController } from './payment/payment.controller';
import { PaymentService } from './payment/payment.service';
import { ManageAdsService } from './admin/manageAds/manageAds.service';
import { ManageAdCategoriesService } from './admin/manageAdCategories/manageAdCategories.service';
import { PuzzleAdsController } from './admin/puzzleAds/puzzleAds.controller';
import { QuestAdsController } from './admin/questAds/questAds.controller';
import { LetterCollectionAdsController } from './admin/letterCollectionAds/letterCollectionAds.controller';
import { NotificationController } from './notification/notification.controller';
import { ProfileController } from './profile/profile.controller';
import { ReportsController } from './reports/reports.controller';

angular.module('cftWeb', ['ngAnimate', 'ngCookies', 'ngTouch', 'ngSanitize', 'ngAria', 
    'restangular', 'ui.router', 'ui.bootstrap', 'satellizer', 'ngMessages', 'toaster', 'angular-loading-bar', 
    'angularjs-dropdown-multiselect', 'ui.bootstrap.datetimepicker', 'isteven-multi-select', 'ngFileUpload', 'awsupload.environmentConfig', 'ngStorage', 'angular-click-outside', 'credit-cards'])
  .config(config)
  .config(routerConfig)
  .run(runBlock)
  .controller('DashboardController', AdminDashboardController)
  .controller('SetPasswordController', SetPasswordController)
  .controller('HeaderController', HeaderController)
  .service('SetPasswordService', SetPasswordService)
  .controller('ForgotPasswordController', ForgotPasswordController)
  .controller('AdvertiserDashboardController', AdvertiserDashboardController)
  .controller('LoginController', LoginController)
  .service('LoginService', LoginService)
  .service('ManageAdvertisersService', ManageAdvertisersService)
  .controller('ModalInstanceController', ModalInstanceController)
  .controller('ManageAdvertisersController', ManageAdvertisersController)
  .controller('ManageAdsController', ManageAdsController)
  .controller('InstantAdsController', InstantAdsController)
  .controller('ManageAdCategoriesController', ManageAdCategoriesController)
  .controller('AppController', AppController)
  .controller('CategoryModalInstanceController', CategoryModalInstanceController)
  .controller('EditCategoryController', EditCategoryController)
  .controller('PaymentController', PaymentController)
  .service('PaymentService', PaymentService)
  .service('ManageAdsService', ManageAdsService)
  .service('ManageAdCategoriesService', ManageAdCategoriesService)
  .controller('PuzzleAdsController', PuzzleAdsController)
  .controller('QuestAdsController', QuestAdsController)
  .controller('LetterCollectionAdsController', LetterCollectionAdsController)
  .controller('NotificationController', NotificationController)
  .controller('ProfileController', ProfileController)
  .controller('ReportsController', ReportsController)
