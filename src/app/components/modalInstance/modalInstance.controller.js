export class ModalInstanceController {
  constructor ($uibModalInstance, selected) {
    'ngInject';
    this.selected = selected;
    this.$uibModalInstance = $uibModalInstance;
  }

  ok () {
    this.$uibModalInstance.close(this.selected);
   }

  cancel () {
    this.$uibModalInstance.dismiss("cancel");
  }

}
