export class PaymentService {
  constructor ($log, Restangular) {
    'ngInject';

    this.$log = $log;
    this.Restangular = Restangular;
  }

  makePayment(data) {
    return this.Restangular.all('payments/makePayment').post(data);
  }

  getAdInfo(id, adType){
    return this.Restangular.all(`${adType}s/${id}?populate=category,media`).customGET('');
  }


}
