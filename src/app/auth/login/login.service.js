export class LoginService {
  constructor ($log, Restangular) {
    'ngInject';

    this.$log = $log;
    this.Restangular = Restangular;
  }

  forgotPassword(data) {
     return this.Restangular.all('users/forgotPassword').post(data);
  }

  fetchAllNotification() {
    return this.Restangular.all('notifications/fetchAll').customGET('');
  }

  updateNotificationReadStatus(id, data){
    return this.Restangular.one('notifications', id).customPUT(data);
  }

  getNotificationCount(data){
    return this.Restangular.all('notifications/fetchAll').customGET('', data);
  }

  markAllAsRead() {
    return this.Restangular.one('notifications/markAllAsRead').get();
  }
}
