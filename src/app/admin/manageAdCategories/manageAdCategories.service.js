export class ManageAdCategoriesService {
  constructor (Restangular) {
    'ngInject';

    this.Restangular = Restangular;
  }

  createCategory(data) {
    return this.Restangular.all('categories').post(data);
  }

  listCategories() {
    return this.Restangular.all('categories').getList();
  }

  listCategoriesByPagination(page){
    return this.Restangular.all('categories?sort=updatedAt DESC&limit=10&page='+page).customGET('');
  }

  editCategory(id, data) {
    return this.Restangular.one('categories', id).customPUT(data);
  }

  deleteCategory(id) {
    return this.Restangular.one('categories', id).remove();
  }

  searchCategoryList(field, toSearch) {
    return this.Restangular.all(`categories?limit=10&page=1&where={"${field}":{"startsWith":"${toSearch}"}}`).customGET('');
  }
}
