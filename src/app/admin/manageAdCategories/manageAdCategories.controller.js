export class ManageAdCategoriesController {
  constructor ($timeout, toaster, $log, $uibModal, ManageAdCategoriesService) {
    'ngInject';

    this.toaster = toaster;
    this.$uibModal = $uibModal;
    this.ManageAdCategoriesService = ManageAdCategoriesService;
    this.hideSearchClass = { hideSearch: false };
    this.isAllSelected = false;

    //pagination
    this.currentPage = 1;
    this.itemsPerPage = 10;
    this.maxSize = 5; //pagination max size
    this.entryLimit = 10;
    this.setPagingData(this.currentPage);
    this.sortColumn = "name";
    this.reverseSort = false;
    this.$log = $log;
  }


  openCreateCategoryModal(){
    this.testValue = 10;
    var modalInstance = this.$uibModal.open({
      animation: this.animationsEnabled,
      ariaLabelledBy: 'modal-title',
      ariaDescribedBy: 'modal-body',
      templateUrl: 'createCategory.html',
      controller: 'CategoryModalInstanceController',
      controllerAs: 'modal',
      backdrop: 'static'
    });

    modalInstance.result.then(category => {
      if(category === undefined){
        this.showError  = true;
      }
      else{
        let categoryName = {
          name: category
        }
        this.ManageAdCategoriesService.createCategory(categoryName).then(response => {
          this.filteredList.push(response)
          this.setPagingData(this.currentPage);
          this.toaster.pop({type: 'info', body: 'Category created successfully'});

          }, err => {
            this.$log.log(err);
          });
      }
    })
  }

  openEditCategoryModal(category){
    var modalInstance = this.$uibModal.open({
      animation: this.animationsEnabled,
      ariaLabelledBy: 'modal-title',
      ariaDescribedBy: 'modal-body',
      templateUrl: 'editCategory.html',
      controller: 'EditCategoryController',
      controllerAs: 'modal',
      backdrop: 'static',
      resolve: {
        selected: function () {
          let copyCat = angular.copy(category);
          return ({editCategory: copyCat});
        }
      }
    });

    modalInstance.result.then(category => {
      this.ManageAdCategoriesService.editCategory(category.id, {name: category.name, published: category.published}).then(response => {
        let index = _.findIndex(this.filteredList, (obj) => obj.id == response.id)
        this.filteredList[index] = response;
        this.setPagingData(this.currentPage);
        this.toaster.pop({type: 'info', body: 'Category updated successfully'});
        }, err => {
          this.$log.log(err);
        });
    })
  }

  deleteModal (category) {
    var modalInstance = this.$uibModal.open({
      animation: this.animationsEnabled,
      ariaLabelledBy: 'modal-title',
      ariaDescribedBy: 'modal-body',
      templateUrl: 'myModalContent.html',
      controller: 'ModalInstanceController',
      controllerAs: 'modal',
      backdrop: 'static',
      resolve: {
        selected: function () {
          return ({objectId: category.id});
        }
      }
    });

    modalInstance.result.then(objectId => {
      this.$log.log(objectId)
      this.ManageAdCategoriesService.deleteCategory(objectId.objectId).then(response => {
        this.filteredList = this.filteredList.filter(obj => obj.id != response.id)
        this.setPagingData(this.currentPage);
        this.toaster.pop({type: 'info', body: 'Category deleted successfully'});
      }, err => {
        this.$log.log(err);
      });
    })
  }

  deleteAllCategory() {
     angular.forEach(this.filteredList, (category) => {
      if(category.selected){
        this.ManageAdCategoriesService.deleteCategory(category.id).then(response => {
          this.filteredList = this.filteredList.filter(obj => obj.id != response.id)
          this.setPagingData(this.currentPage);
          this.isAllSelected = false;
          this.hideSearchClass.hideSearch = false;

        }, err => {
          this.$log.log(err);
        });
      }
    });
  }

  toggleAll() {
    this.hideSearchClass.hideSearch = !this.hideSearchClass.hideSearch;
    var toggleStatus = !this.isAllSelected;
    angular.forEach(this.filteredList, (itm) => {
      itm.selected = !toggleStatus;
    });
  }

  checkBoxToggled() {  //ng repeat checkbox - select all
    this.isAllSelected = this.filteredList.every((itm) => itm.selected);
    let selectedCount = this.filteredList.filter((obj) => obj.selected).length
    this.hideSearchClass.hideSearch = selectedCount > 1;
  }

  sortData(column) {
    this.reverseSort = (this.sortColumn == column) ? !this.reverseSort : false;
    this.SortData = column;
  }

  getSortClass(column) {
    if (this.sortColumn == column) {
      return this.reverseSort ? 'arrow-down' : 'arrow-up'
    }
    return '';
  }

  getStatus(status){
    if(status)
      return 'Published'
    else
      return 'Unpublished'
  }

  // pagination code starts
  setPage(pageNo) {
   this.currentPage = pageNo;
  }

  pageChanged() {
    this.setPagingData(this.currentPage);
   }

  setPagingData(page) {
    this.currentPage = page;
      this.ManageAdCategoriesService.listCategoriesByPagination(page).then(response => {
        this.filteredList = response.result;
        this.categoryCount = response.totalCount;
        return response;
      }, err => {
        return err;
      });
  }
   // ends

   search(toSearch){
    this.ManageAdCategoriesService.searchCategoryList('name', toSearch).then(response => {
      this.filteredList = response.result;
      this.categoryCount = response.totalCount;
    }, err => {
      this.$log.log(err);
    });
  }

  checkEmpty(){
    if(this.searchValue.length == 0){
      this.setPagingData(1);
    }
  }

}
