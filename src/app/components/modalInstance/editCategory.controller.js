export class EditCategoryController {
  constructor ($uibModalInstance, ManageAdvertisersService, selected, toaster, $log) {
    'ngInject';
    this.selected = selected;
    this.toaster = toaster;
    this.$log = $log;
    this.$log.log("selected Category")
    this.$log.log(this.selected)
    this.$uibModalInstance = $uibModalInstance;
    this.defaultName = this.selected.editCategory.name;
    this.editCategory = this.selected.editCategory;
  }

  ok () {
    if(this.editCategory.name == undefined) {
      //this.toaster.error("Category Name is required");
       this.errorMessage = "Category name is required";
    }
    else{
      this.errorMessage = "";
      this.$uibModalInstance.close(this.editCategory);
    }
   }

  cancel () {
    this.editCategory.name = this.defaultName;
    this.$uibModalInstance.dismiss("cancel");
  }

}
