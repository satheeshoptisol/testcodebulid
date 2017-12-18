export class PaymentController {
  constructor ($timeout, PaymentService, $state, $auth, $rootScope, $stateParams, toaster, ManageAdsService) {
    'ngInject';

    this.awesomeThings = [];
    this.classAnimation = '';
    this.creationDate = 1488448684833;
    this.PaymentService = PaymentService;
    this.toaster = toaster;
    this.$state = $state;
    this.$auth = $auth;
    this.$rootScope = $rootScope;
    this.$stateParams = $stateParams;
    this.ManageAdsService = ManageAdsService;
    if(this.$stateParams){
      this.getAdInfo(this.$stateParams.adId, this.$stateParams.adType);
    }

    if(this.$stateParams.adType == 'instantAd')
      this.showInstantAd = true;
    else if(this.$stateParams.adType == 'letterCollectionAd')
      this.showLetterCollection = true;
    else if(this.$stateParams.adType == 'puzzleAd')
      this.showPuzzleAd = true;
    else
      this.showQuestAd = true;

    this.expMonths = [ '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12' ];

    this.cur_year = new Date().getFullYear();

    this.expYears = [];

    for (var i = 0; i < 20; i++) {
      this.expYears.push(this.cur_year+i);
    }

    this.expMonthSettings = {
      nothingSelected : "Exp Month"         //default-label is deprecated and replaced with this.
    };

    this.expYearSettings = {
      nothingSelected : "Exp Year"         //default-label is deprecated and replaced with this.
    };


    }

    getAdInfo(id, adType){
      this.PaymentService.getAdInfo(id, adType).then(result => {
        if(result){
          if(this.$stateParams.adType == 'instantAd') {
            this.adType = 'Instant Advertisement';
            this.adName = result.name;
            if(result.media[0].type === 'video'){
              this.showVideo = true;
            }
            else{
              this.showVideo = false;
            }
            this.media = result.media[0].url;
            this.startDate = moment(result.startDate).format('LL');
            this.endDate = moment(result.endDate).format('LL');
            this.flipCounts = result.flipCountsToWin;
            this.category = result.category.name;
          }
          if(this.$stateParams.adType == 'letterCollectionAd') {
            this.adType = 'Letter Collection Advertisement';
            this.adName = result.name;
            this.showVideo = false;
            this.media = result.media[0].url;
            this.startDate = moment(result.startDate).format('LL');
            this.endDate = moment(result.endDate).format('LL');
            this.lettersCount = result.noOfLetters;
            this.category = result.category.name;
          }
          if(this.$stateParams.adType == 'questAd') {
            this.adType = 'Quest Advertisement';
            this.showVideo = false;
            this.adName = result.name;
            this.media = result.media[0].url;
            this.startDate = moment(result.startDate).format('LL');
            this.endDate = moment(result.endDate).format('LL');
            this.availablePoints = result.noOfAvailablePoints;
            this.category = result.category.name;
          }
          if(this.$stateParams.adType == 'puzzleAd') {
            this.adType = 'Puzzle Advertisement';
            this.showVideo = false;
            this.adName = result.name;
            this.media = result.media[0].url;
            this.startDate = moment(result.startDate).format('LL');
            this.endDate = moment(result.endDate).format('LL');
            this.imagePieceCount = result.noOfImagePieces;
            this.category = result.category.name;
          }
        }
      }, err => {
         return err;
      })
    }

  changeMonthErrMsg() {
    this.showMonthError = false;
  }

  addPaymentDetails(form){
    if(this.expYear === this.cur_year){
      if(this.expMonth < ('0'+(new Date().getMonth()+1)).slice(-2)) {
        this.showMonthError = true;
      }
    }
    if(form.$valid && !this.showMonthError){
      this.toaster.clear();
      var expYear = this.expYear.toString().substr(-2);
      this.isDisabled = true;
      this.expiryDate = this.expMonth+expYear;

      let data = {
          cardNumber: this.cardNumber,
          expiryDate: this.expiryDate,
          cardCode: this.cardCode,
          adType: this.$stateParams.adType,
          adId: this.$stateParams.adId
      }
      this.PaymentService.makePayment(data).then(response => {
        this.isDisabled = false;
        if(response){
         // this.ManageAdsService.updateAd(this.$stateParams.adId, this.$stateParams.adType).then(() => {
          this.toaster.pop({type: 'info', body: 'Payment successful'});
          this.$state.go('admin-dashboard');
        // })
        }
    }, err => {
      if(err.data.errors){
          if(err.data.errors.length >=1){
            this.toaster.pop({type: 'info', body: err.data.errors[0].message});
            this.isDisabled = false;
          }
        }
      else{
          this.toaster.pop({type: 'info', body: err.data.message});
          this.isDisabled = false;
        }
      })
    }
  }
}
