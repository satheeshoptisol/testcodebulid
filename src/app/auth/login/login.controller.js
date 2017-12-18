export class LoginController {
  constructor ($timeout, LoginService, $auth, $uibModal, toaster) {
    'ngInject';

    this.LoginService = LoginService;
    this.$auth = $auth;
    this.$uibModal = $uibModal;
    this.toaster = toaster;

  }

  openForgotPasswordModal(){
    this.showError = false;
    let that = this;
    let modalInstance = this.$uibModal.open({
      animation: this.animationsEnabled,
      ariaLabelledBy: 'modal-title',
      ariaDescribedBy: 'modal-body',
      templateUrl: 'forgotPassword.html',
      controller: 'ForgotPasswordController',
      controllerAs: 'modal'
    });

    modalInstance.result.then(function(email) {
      if(angular.isUndefined(email)){
        that.showError = true;
      }
      else{
        let data = {
          email: email
        }
        that.LoginService.forgotPassword(data).then(response => {
          that.toaster.pop({type: 'info', body: response.message});
          }, err => {
            if(err.data.errors){
              if(err.data.errors.length > 0)
                that.toaster.pop({type: 'error', body: err.data.errors[0].message});
            }
            else
              that.toaster.pop({type: 'error', body: err.data.message});
          });
        }
    })
  }
}
