export class SetPasswordController {
  constructor ($timeout, toaster, $stateParams, verifyToken, SetPasswordService, $state) {
    'ngInject';

    this.verifyToken = verifyToken;
    this.$stateParams = $stateParams;
    this.SetPasswordService = SetPasswordService;
    this.$state = $state;
    this.toaster = toaster;

    if(this.verifyToken.valid){
      this.showPage = true;
    }
    else{
      this.showPage = false;
    }
  }

  setPassword(form) {
    let oneMoreThis = this;
    if(form.$valid){
      if(this.password === this.confirmPassword){
        this.isDisabled = true;
        let resetPwdData = {
          resetToken: this.$stateParams.token,
          newPassword: this.password
        }
        this.SetPasswordService.resetPassword(resetPwdData).then(result => {
          oneMoreThis.isDisabled = false;
          oneMoreThis.toaster.pop({type: 'info', body: result.message});
          oneMoreThis.$state.go('login');
         }, err => {
          oneMoreThis.isDisabled = false;
          oneMoreThis.toaster.pop({type: 'error', body: 'Error'});
          
          return err;
        });
      }
      else{
        oneMoreThis.toaster.pop({type: 'error', body: 'Password doesnot match'});
      }
    }
  }
}
