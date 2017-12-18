export class ManageAdvertisersService {
  constructor ($log, Restangular) {
    'ngInject';

    this.$log = $log;
    this.Restangular = Restangular;
  }

  createAdvertiser(data) {
    return this.Restangular.all('users').post(data);
  }

  listAdvertiser() {
    return this.Restangular.all('users').getList();
  }

  listAdvertiserByPagination(page) {
    return this.Restangular.all('users?sort=updatedAt DESC&limit=10&page='+page).customGET('');
  }

  getAdvertiser(id) {
    return this.Restangular.one('users', id).get();
  }

  editAdvertiser(id, data) {
    return this.Restangular.one('users', id).customPUT(data);
  }

  deleteAdvertiser(id) {
    return this.Restangular.one('users', id).remove();
  }

  searchAdvertiserList(field, toSearch) {
    return this.Restangular.all(`users?limit=10&page=1&where={"${field}":{"startsWith":"${toSearch}"}}`).customGET('');
  }

  searchAdvertiserListByName(toSearch){
   return this.Restangular.all(`users?limit=10&page=1&where={"or":[{"firstName":{"contains":"${toSearch}"}},{"lastName":{"contains":"${toSearch}"}}]}`).customGET('');
  }

  updateProfile(id, data) {
    return this.Restangular.one('users', id).customPOST(data);
  }
}
