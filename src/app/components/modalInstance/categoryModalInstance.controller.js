export class CategoryModalInstanceController {
  constructor ($uibModalInstance, ManageAdvertisersService, toaster) {
    'ngInject';
    this.$uibModalInstance = $uibModalInstance;
    this.toaster = toaster;
  }

  ok (categoryForm) {
    if(categoryForm.$valid){
      this.errorMessage = "";
      this.$uibModalInstance.close(this.category);
    }
    else{
      this.errorMessage = "Category name is required";
    }
  }

  cancel () {
    this.$uibModalInstance.dismiss("cancel");
  }

  isActiveToggle() {
    if(this.category.published)
      this.editAdvertiser.status = 'Published';
    else
      this.editAdvertiser.status = 'Unpublished';
  }
}

