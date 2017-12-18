export class ForgotPasswordController {
  constructor ($uibModalInstance) {
    'ngInject';
    this.$uibModalInstance = $uibModalInstance;
  }

  ok (form) {
    if(form.$valid){
      this.errorMessage = "";
      this.$uibModalInstance.close(this.email);
    }
    else{
      this.errorMessage = "Enter valid Email";
    }
  }

  cancel () {
    this.$uibModalInstance.dismiss("cancel");
  }

}
