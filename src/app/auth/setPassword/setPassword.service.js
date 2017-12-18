export class SetPasswordService {
  constructor ($log, $http, Restangular) {
    'ngInject';

    this.$log = $log;
    this.Restangular = Restangular;
    this.$http = $http;
 
  }

  resetPassword(data) {
    return this.Restangular.all('users/resetPassword').post(data);
  }
}
