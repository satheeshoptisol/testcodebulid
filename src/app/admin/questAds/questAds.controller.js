export class QuestAdsController {
  constructor ( toaster, $uibModal, ManageAdsService, $stateParams, $state, $scope, $auth, $log, $q, AWS_CONFIG) {
    'ngInject';

    this.$q = $q;
    this.AWS_CONFIG = AWS_CONFIG;
    this.uploader = "";
    this.myClass = { createAdvertisementForm: false };
    this.editAdClass = { editAdvertisementForm: false };
    this.viewAdClass = { viewAdvertisement: false };
    this.$state = $state;
    this.$scope = $scope;
    this.toaster = toaster;
    this.$auth = $auth;
    this.ManageAdsService = ManageAdsService;
    this.$uibModal = $uibModal;
    this.$log = $log;
    this.hideSearchClass = { hideSearch: false };
    this.isAllSelected = false;
    this.isDisabled = false;
    this.editDisabled = false;
    this.zipCodeArray = [];
    this.today = moment().add(0, 'days').format('LL');

    this.datePicker = {};
    this.dateOptions1 = {
        //dateDisabled: disabled,
        formatYear: 'yyyy',
        minDate: Date.now(),
        startingDay: 1
    };
    this.datePicker.minStartDate = new Date();

    // date
    this.popup1 = {
     opened: false
    };

    this.popup2  = {
     opened: false
    };

    this.localLang = {
      selectAll: "Select All",
      selectNone: "Select None",
      reset: "Reset",
      search: "Type here to search...",
      nothingSelected : "Category"         //default-label is deprecated and replaced with this.
    };


    this.advertiserLang = {
      selectAll: "Select All",
      selectNone: "Select None",
      reset: "Reset",
      search: "Type here to search...",
      nothingSelected : "Advertiser"         //default-label is deprecated and replaced with this.
    };

    //OS Type
    this.osTypeModel = [];
    this.categoryTypeModel = [];

    this.osTypes = [
      {   id: 1,   name: "windows", ticked: false  },
      {   id: 2,   name: "mac", ticked: false   },
      {   id: 3,  name: "linux", ticked: false  },
      {   id: 4, name: "android",  ticked: false  },
      {   id: 5,  name: "ios", ticked: false  }
    ];

      //gender Type
    this.genderTypeModel = [];
    this.genderTypes = [
      { id:1, label: "Male" , short: "m", ticked: false },
      { id:2, label: "Female", short: "f", ticked: false },
      { id:3, label: 'All', short: "o", ticked: false }
    ];

    //Geo Segment
    this.geoSegmentTypeModel = [];
    this.geoSegmentTypes = [
      { id:2, label: "Male" },
      { id:3, label: "Female"}
    ];
    this.geoSegmentTypeSettings = { searchField: 'label', enableSearch: true, showUncheckAll:false, buttonClasses:'btn btn-default dropdown-box' };
    this.geoSegmentTranslationTexts={buttonDefaultText:'Select Geo Segment'};

    //User Segment Targeting
    this.userSegmentTypeModel = [];
    this.userSegmentTypes = [
      { id:2, label: "USA" },
      { id:3, label: "India"}
    ];
    this.userSegmentTypeSettings = { searchField: 'label', enableSearch: true, showUncheckAll:false, buttonClasses:'btn btn-default dropdown-box' };
    this.userSegmentTranslationTexts={buttonDefaultText:'Select User Segment '};

  //flipcounts to win array
    this.choices = [0];
    this.startDateCalenderIsOpen = false;
    this.endDateCalenderIsOpen = false;

    if($stateParams.page == 'edit'){
      this.toggleEditAdClass($stateParams.id, 'questAds')
    }
    if($stateParams.page == 'create'){
      this.toggleCreateAdClass();
    }

    if($stateParams.page == 'view'){
      this.toggleViewAdClass($stateParams.id, 'questAds')
    }

    if(this.$auth.getPayload().user.role.name == 'admin')
    this.showAssignAdvertiser = true;
  }

   checkErr(startDate,endDate) {
    var curDate = new Date();
    this.errMessage = '';
    this.startErrMessage = '';

    if(endDate){
      if(new Date(startDate) > new Date(endDate)){
        this.errMessage = 'End date must be greater than start date';
        return false;
      }
      if(new Date(startDate) < curDate){
         this.startErrMessage = `Start date must be greater than today's date`;
         return false;
      }
    }
  }

    checkBoxToggled() {  //ng repeat checkbox - select all
      this.isAllSelected = this.filteredList.every((itm) => itm.selected);
      let selectedCount = this.filteredList.filter((obj) => obj.selected).length
      this.hideSearchClass.hideSearch = selectedCount > 1;
    }

    // Toggle All
    toggleAll() {
      this.hideSearchClass.hideSearch = !this.hideSearchClass.hideSearch;
      var toggleStatus = !this.isAllSelected;
      angular.forEach(this.filteredList, (itm) => {
        itm.selected = !toggleStatus;
      })
    }

  //Toggle Create Advertisement
    toggleCreateAdClass() {
      // category list

      if(this.$scope.manageAd.categoryTypes) {
        this.categoryTypes = _.map(this.$scope.manageAd.categoryTypes, element => {
          return _.extend({}, element, {ticked: false});
        });
      }
      else{
        this.ManageAdsService.getAdCategoryList().then(response => {
          this.categoryTypes = _.sortBy(_.map(response.result, element => {
            return _.extend({}, element, {ticked: false});
          }), 'name' );
        })
      }

      // advertiserlist
      if(this.$scope.manageAd.advertiserList) {
        this.advertiserList = _.map(this.$scope.manageAd.advertiserList, element => {
          return _.extend({}, element, {ticked: false});
        })
      }
      else{
        this.ManageAdsService.getAdvertiserList().then(response => {
          this.advertiserList = _.map(response.result, function(element) {
            return _.extend({}, element, {ticked: false});
          });
          this.$log.log("ADVER")
          this.$log.log(this.advertiserList)
        })
      }

      // Country
      if(this.$scope.manageAd.countryTypes){
        this.countryTypes = _.map(this.$scope.manageAd.countryTypes, element => {
          return _.extend({}, element, {ticked: false});
        });
      }
      else{
        this.ManageAdsService.getCountryList().then(response => {
          this.countryTypes = _.map(response.result, element => {
            return _.extend({}, element, {ticked: false});
          });
        })
      }

      // OS
      let osNewArr = _.map(this.osTypes, element => {
           return _.extend({}, element, {ticked: false});
      });

      // Gender
      let genderNewArr = _.map(this.genderTypes, element => {
        return _.extend({}, element, {ticked: false});
      });

      this.ads = {};
      this.ads.instantOSModel = false;
      this.ads.instantGenderModel  = false;
      this.osTypes = osNewArr;
      this.genderTypes = genderNewArr;
      this.showOSDropDown = false;
      this.showGenderDropDown = false;
      this.showCountryDropDown = false;
      this.myClass.createAdvertisementForm = true;
      this.$scope.manageAd.adTypesClass.adTypesForm = false;

      this.ads.startDate = new Date();
      this.ads.endDate = new Date();
    }

  //Toggle Edit Advertisement
    toggleEditAdClass(id, type) {
      this.choices = [];
      this.showName = true;
      this.viewAdClass.viewAdvertisement = false;
      this.ManageAdsService.getAdvertisement(id, type).then(response => {
        this.$log.log("RESPONSE")
        this.editAds = response;
        this.$log.log(this.editAds)
        if(this.editAds.published) {
          this.hidePublished = true;
        }

        this.editAds.startDate = moment(this.editAds.startDate).format('DD MMM YYYY HH:mm')
        this.editAds.endDate = moment(this.editAds.endDate).format('DD MMM YYYY HH:mm')
        if(this.$scope.manageAd.categoryTypes) {
          this.editAds.categoryTypes = _.map(this.$scope.manageAd.categoryTypes, element => {
            return _.extend({}, element, {ticked: false});
          });
        }
        else{
          this.ManageAdsService.getAdCategoryList().then(response => {
            this.editAds.categoryTypes = _.sortBy(_.map(response.result, element => {
              return _.extend({}, element, {ticked: false});
            }), 'name' );
          })
        }
        // this.editAds.categoryTypes.ticked  = true;

        _.map(this.editAds.categoryTypes, category => {
          if(this.editAds.category){
            if(_.includes(category.name, this.editAds.category.name)){
              category.ticked = true;
            }
            else{
              category.ticked = false;
            }
          }
        })

      if(this.editAds.os.length >= 1 ){
        this.showOSDropDown = true;
        this.os = true;
        this.editAds.osTypes = this.osTypes;
        angular.forEach(this.editAds.osTypes, (type, key) => {
          _.map(this.editAds.os, os => {
            if(_.includes(os, type.name)){
              this.editAds.osTypes[key] = {
                id: this.editAds.osTypes[key].id,
                name: this.editAds.osTypes[key].name,
                ticked: true
              }
            }
          })
        })
      }

    // Gender
      if(this.editAds.gender.length >= 1 ){
        this.showGenderDropDown = true;
        this.instantGenderModel = true;
        this.editAds.genderTypes = this.genderTypes;
        angular.forEach(this.editAds.genderTypes, (label, key) => {
          _.map(this.editAds.gender, gender => {
             if(_.includes(label.short, gender)){
              this.editAds.genderTypes[key] = {
                id: this.editAds.genderTypes[key].id,
                label: this.editAds.genderTypes[key].label,
                short: this.editAds.genderTypes[key].short,
                ticked: true
              }
             }
          })
        })
      }


    // Country
      if(this.editAds.countries.length >= 1 ){
        this.showCountryDropDown = true;
        this.instantCountryModel = true;
        this.editAds.countryTypes = this.$scope.manageAd.countryTypes;
        angular.forEach(this.editAds.countryTypes, (type, key) => {
          _.map(this.editAds.countries, country => {
             if(_.includes(type.iso, country)){
              this.editAds.countryTypes[key] = {
                id: this.editAds.countryTypes[key].id,
                iso: this.editAds.countryTypes[key].iso,
                name: this.editAds.countryTypes[key].name,
                nicename: this.editAds.countryTypes[key].nicename,
                numcode:  this.editAds.countryTypes[key].numcode,
                phonecode:  this.editAds.countryTypes[key].phonecode,
                ticked: true
              }
            }
            else{
              this.editAds.countryTypes[key] = {
                id: this.editAds.countryTypes[key].id,
                iso: this.editAds.countryTypes[key].iso,
                name: this.editAds.countryTypes[key].name,
                nicename: this.editAds.countryTypes[key].nicename,
                numcode:  this.editAds.countryTypes[key].numcode,
                phonecode:  this.editAds.countryTypes[key].phonecode,
                ticked: false
              }
            }
          })
        })
      }

      if(this.editAds.zipcodes.length >=1 ) {
        this.showZipCodeArray = true;
        this.zipCodeModel = true;
        this.zipCodeArray = this.editAds.zipcodes;
      }
      this.ManageAdsService.isImage(this.editAds.media).then(result => {
        if(result){
          this.showImage = true;
          this.showName = true;
          this.showMedia = true;
          this.$log.log(this.editAds.media[0].name)
          this.mediaName = this.editAds.media[0].name;
        }
        else
          this.showImage  =false;
          this.showName = true;
          this.showMedia = true;
          this.mediaName = this.editAds.media[0].name;
      });
      this.editAdClass.editAdvertisementForm = true;
    })
  }

 //View Advertisement
    toggleViewAdClass(id, type) {
      this.myClass.createAdvertisementForm = false;
      this.editAdClass.editAdvertisementForm = false;

      this.ManageAdsService.getAdvertisement(id, type).then(response => {
        this.viewAdvertisement = response;
        this.ManageAdsService.isImage(this.viewAdvertisement.media).then((result) => {
          if(result){
            this.showImage = true;
            this.showName = true;
          }
          else{
            this.showImage  =false;
            this.showName = true;
          }
        }, err => {
          this.$log.log(err)
        });
      this.viewAdClass.viewAdvertisement = true;
      }, err => {
          this.$log.log(err)
          this.viewAdClass.viewAdvertisement = false;
          this.toaster.pop({type: 'error', body: err.data});
          this.$state.go('manage-ads');
          this.isDisabled = false;
        })
    }

  //Close Slide
    closeSlideContent() {
      this.myClass.createAdvertisementForm = false;
      this.editAdClass.editAdvertisementForm = false;
      this.viewAdClass.viewAdvertisement = false;
      this.$scope.manageAd.adTypesClass.adTypesForm  =false;
      this.$state.go('manage-ads');
    }

    osSelection() {
      this.osError = false;
    }

     genderSelection() {
      this.genderError = false;
    }

    countrySelection() {
      this.countryError = false;
    }


   // instant OS toggle
    instantOS(value) {
      if(value){
        this.showOSDropDown = true;
        if(this.editAds) {
          this.editAds.osTypes = this.osTypes;
        }
      }
      else{
        this.osError = false;
        this.showOSDropDown=false;
      }
    }
    // instant Gender toggle
    instantGender(value) {
      if(value){
        this.showGenderDropDown = true;
        if(this.editAds) {
          this.editAds.genderTypes = this.genderTypes;
        }
      }
      else{
        this.genderError = false;
        this.showGenderDropDown=false;
      }
    }
    // instant Country toggle
    instantCountry(value) {
      if(value){
        this.showCountryDropDown = true;
        if(this.editAds) {
          this.editAds.countryTypes =  this.$scope.manageAd.countryTypes;
        }
      }
      else{
        this.countryError = false;
        this.showCountryDropDown=false;
      }
    }

    // Zipcode
    zipCodeChange(value) {
      if(value){
        this.showZipCode = true;
        this.showZipCodeArray = true;
      }
      else{
        this.showZipCode = false;
        this.zipCodeError = false;
        this.showZipCodeArray = false;
        this.zipCodeArray = [];
      }
    }

    changeErrorValue(){
      this.categoryMessage = false;
    }

    postAdvertisement(form, type){
      let osTypeList = [];
      let country = [];
      let gender = [];
      let zipCode = [];
      if(this.getAdCategoryModel.length == 0){
        this.categoryMessage = true;
      }
      if(!this.maxSizeError) {
        if(!this.media || this.media.length <=0){
          this.mediaErrorMessage = true;
        }
      }

      // else{
      if(this.ads.instantOSModel){
          if(this.osTypeModel && this.osTypeModel.length > 0){
            osTypeList = this.osTypeModel.map(function(a) {return a.name;});
          }
          else{
            this.osError = true;
            this.osErrorMessage = "OS toggle is ON, but didn't choose any OS\n";
          }
        }
        if(this.ads.instantGenderModel) {
          if(this.genderTypeModel && this.genderTypeModel.length > 0) {
            gender = this.genderTypeModel.map(function(a) {return a.short;});
          }
          else{
            this.genderError = true;
            this.genderErrorMessage  = "Gender toggle is ON, but didn't choose any Gender\n"
          }
        }
        if(this.ads.instantCountryModel) {
          if(this.countryModel && this.countryModel.length > 0){
            country = this.countryModel.map(function(a) {return a.iso});
          }
          else{
            this.countryError = true;
            this.countryErrorMessage = "Country toggle is ON, but didn't choose any country\n"
          }
        }
        if(this.ads.zipCodeModel) {
          if(this.zipCodeArray.length > 0){
            zipCode = this.zipCodeArray;
          }
          else{
            this.zipCodeError = true;
            this.zipCodeErrorMessage = "Zipcode toggle is ON, but didn't enter any zipcode"
          }
        }
         let startDate = moment(this.ads.startDate).format();
        let endDate = moment(this.ads.endDate).format();
        this.checkErr(startDate, endDate);
        if(this.errMessage != undefined || this.errMessage != ''){
          this.calMessage = true;
        }
        if(this.startErrMessage != undefined || this.startErrMessage != ''){
          this.startCalMessage = true;
        }

      if((form.$valid && this.errMessage == '' && this.startErrMessage == '' && this.mediaErrorMessage == '') && (!this.osError  && !this.genderError && !this.countryError && !this.zipCodeError) && !this.maxSizeError){
        let data = {
          name: this.ads.postName,
          startDate: startDate,
          endDate: endDate,
          os: osTypeList,
          description: this.ads.description,
          noOfAvailablePoints: this.ads.noOfAvailablePoints,
          gender: gender,
          countries: country,
          category: this.getAdCategoryModel[0].id,
          zipcodes: zipCode,
          media: this.media
        }
        this.isDisabled = true;
        this.ManageAdsService.createAdvertisement(data, type).then(response => {
          if(response && this.$auth.getPayload().user.role.name === 'admin' && this.getAdvertiserListModel && this.getAdvertiserListModel.length >0){
            let adData = {
              adType: 'QuestAd',
              adId: response.id,
              assignTo: this.getAdvertiserListModel[0].id
            }
            this.assignAd(adData);
          }
          this.adsForm = {};
          this.createAdsForm.$setPristine();
          this.createAdsForm.$setUntouched();
          this.isDisabled = false;
          this.myClass.createAdvertisementForm = !this.myClass.createAdvertisementForm;
          this.$scope.manageAd.adTypesClass.adTypesForm = false;
          this.$state.go('manage-ads');
          this.$scope.manageAd.filteredList.push(response);
          this.$scope.manageAd.setPagingData(this.currentPage);
          this.toaster.pop({type: 'info', body: 'Advertisement created successfully'});
        }, err => {
          _.map(err.data.errors, (key, value) => {
            this.$log.log(key);
            this.toaster.pop({type: 'error', body: key.message});
          })
          this.isDisabled = false;
          this.$log.log(err);
        })
      }
    // }
    }

    publishAdvertisement(form, type){
      let osTypeList = [];
      let country = [];
      let gender = [];
      let zipCode = [];
      if(this.getAdCategoryModel.length == 0){
        this.categoryMessage = true;
      }
      if(!this.maxSizeError) {
        if(!this.media || this.media.length <=0){
          this.mediaErrorMessage = true;
        }
      }
      // else{
      if(this.ads.instantOSModel){
          if(this.osTypeModel && this.osTypeModel.length > 0){
            osTypeList = this.osTypeModel.map(function(a) {return a.name;});
          }
          else{
            this.osError = true;
            this.osErrorMessage = "OS toggle is ON, but didn't choose any OS\n";
          }
        }
        if(this.ads.instantGenderModel) {
          if(this.genderTypeModel && this.genderTypeModel.length > 0) {
            gender = this.genderTypeModel.map(function(a) {return a.short;});
          }
          else{
            this.genderError = true;
            this.genderErrorMessage  = "Gender toggle is ON, but didn't choose any Gender\n"
          }
        }
        if(this.ads.instantCountryModel) {
          if(this.countryModel && this.countryModel.length > 0){
            country = this.countryModel.map(function(a) {return a.iso});
          }
          else{
            this.countryError = true;
            this.countryErrorMessage = "Country toggle is ON, but didn't choose any country\n"
          }
        }
        if(this.ads.zipCodeModel) {
          if(this.zipCodeArray.length > 0){
            zipCode = this.zipCodeArray;
          }
          else{
            this.zipCodeError = true;
            this.zipCodeErrorMessage = "Zipcode toggle is ON, but didn't enter any zipcode"
          }
        }

        let startDate = moment(this.ads.startDate).format();
        let endDate = moment(this.ads.endDate).format();
        this.checkErr(startDate, endDate);
        if(this.errMessage != undefined || this.errMessage != ''){
          this.calMessage = true;
        }
        if(this.startErrMessage != undefined || this.startErrMessage != ''){
          this.startCalMessage = true;
        }

      if((form.$valid && this.errMessage == '' && this.startErrMessage == '' && this.mediaErrorMessage == '') && (!this.osError  && !this.genderError && !this.countryError && !this.zipCodeError) && !this.maxSizeError){
        let data = {
          name: this.ads.postName,
          startDate: startDate,
          endDate: endDate,
          os: osTypeList,
          description: this.ads.description,
          noOfAvailablePoints: this.ads.noOfAvailablePoints,
          gender: gender,
          countries: country,
          category: this.getAdCategoryModel[0].id,
          zipcodes: zipCode,
          media: this.media
        }
        this.isDisabled = true;

        if(this.$auth.getPayload().user.role.name === 'admin'){
          this.ManageAdsService.createAdvertisement(data, type).then(response => {
            this.ManageAdsService.updateAd(response.id, type).then(updatedResponse => {
              if(updatedResponse && this.getAdvertiserListModel && this.getAdvertiserListModel.length >0){
                let adData = {
                  adType: 'QuestAd',
                  adId: response.id,
                  assignTo: this.getAdvertiserListModel[0].id
                }
                this.assignAd(adData);
              }
              this.adsForm = {};
              this.createAdsForm.$setPristine();
              this.createAdsForm.$setUntouched();
              this.isDisabled = false;
              this.myClass.createAdvertisementForm = !this.myClass.createAdvertisementForm;
              this.$scope.manageAd.adTypesClass.adTypesForm = false;
              this.$state.go('manage-ads');
              this.$scope.manageAd.filteredList.push(response);
              this.$scope.manageAd.setPagingData(this.currentPage);
              this.toaster.pop({type: 'info', body: 'Advertisement Published successfully'});
            }, err => {
               _.map(err.data.errors, (key, value) => {
                this.$log.log(key);
                this.toaster.pop({type: 'error', body: key.message});
              })
              this.isDisabled = false;
              this.$log.log(err);
            })
          }, err => {
              _.map(err.data.errors, (key, value) => {
                this.$log.log(key);
                this.toaster.pop({type: 'error', body: key.message});
              })
              this.isDisabled = false;
              this.$log.log(err);
            })
          }
        else{
          this.ManageAdsService.createAdvertisement(data, type).then(response => {
            this.adsForm = {};
            this.createAdsForm.$setPristine();
            this.createAdsForm.$setUntouched();
            this.isDisabled = false;
            this.$scope.manageAd.adTypesClass.adTypesForm = false;
            this.$scope.manageAd.filteredList.push(response);
            this.$scope.manageAd.setPagingData(this.currentPage);

            if(!response.paid){
              this.$state.go('payment', {adId: response.id, adType: 'questAd'});
            }
            else{
              // this.ManageAdsService.updateAd(response.id).then(() => {
                this.$state.go('manage-ads');
              // })
            }
          }, err => {
            _.map(err.data.errors, (key, value) => {
              this.$log.log(key);
              this.toaster.pop({type: 'error', body: key.message});
            })
            this.isDisabled = false;
            this.$log.log(err);
          })
        }
      }
    // }
  }

  assignAd(adData) {
    this.ManageAdsService.assignAdvertiser(adData).then(assignedDetails => {
      this.$log.log(assignedDetails)
    })
  }

  publishEditedAdvertisement(form){
    this.$log.log("EDIT ADS")
    this.$log.log(this.editAds)
    this.$log.log(this.zipCodeArray)
    let osTypeList = [];
    let gender = [];
    let country = [];
    let zipCodes = [];
    if(!this.maxSizeError) {
      if(this.editAds.media.length == 0){
        this.editMediaErrorMsg = true;
      }
    }
    if(this.editAds.categoryTypeModel.length === 0){
      this.categoryMessage = true;
    }
    // else{
      let startDate = moment(this.editAds.startDate).format();
      let endDate = moment(this.editAds.endDate).format();
     if(this.os){
        if(this.editAds.osTypeModel && this.editAds.osTypeModel.length > 0){
          osTypeList = _.compact(this.editAds.osTypeModel).map(function(a) {return a.name;});
        }
        else{
          this.osError = true;
          this.osErrorMessage = "OS toggle is ON, but didn't choose any OS\n"
        }
      }

      if(this.instantGenderModel) {
        if(this.editAds.genderTypeModel && this.editAds.genderTypeModel.length > 0)
        gender = _.compact(this.editAds.genderTypeModel).map(function(a) {return a.short;});
      else{
        this.genderError  = true;
        this.genderErrorMessage = "Gender toggle is ON, but didn't choose any OS\n"
      }
      }
      if(this.instantCountryModel) {
        if(this.editAds.countryModel && this.editAds.countryModel.length > 0)
          country = _.compact(this.editAds.countryModel).map(function(a) {return a.iso});
        else{
          this.countryError = true;
          this.countryErrorMessage = "Country toggle is ON, but didn't choose any country"
        }
      }
      if(this.zipCodeModel) {
        if(this.zipCodeArray && this.zipCodeArray.length > 0)
         zipCodes = _.compact(this.zipCodeArray);
        else{
          this.zipCodeError = true;
          this.zipCodeErrorMessage = "ZipCode toggle is ON, but didn't choose any zipCode"
        }
      }
      this.checkErr(startDate, endDate);
      if(this.errMessage != undefined || this.errMessage != ''){
        this.calMessage = true;
      }
      if(this.startErrMessage != undefined || this.startErrMessage != ''){
        this.startCalMessage = true;
      }

      if(form.$valid && (this.errMessage == '' || this.errMessage == undefined) && (this.startErrMessage == '' || this.startErrMessage == undefined) && (!this.osError  && !this.genderError && !this.countryError && !this.zipCodeError) && this.editAds.media.length > 0 && !this.maxSizeError ){
         let data = {
          name: this.editAds.name,
          startDate: startDate,
          endDate: endDate,
          os: osTypeList,
          noOfAvailablePoints: this.editAds.noOfAvailablePoints,
          gender: gender,
          countries: country,
          category: this.editAds.categoryTypeModel[0].id,
          zipcodes: zipCodes,
          media: this.editAds.media,
          published: true
        }
        this.editDisabled = true;
        if(this.$auth.getPayload().user.role.name === 'admin'){
          this.ManageAdsService.editAdvertisement(this.editAds.id, 'questAds', data).then(response => {
            let index = _.findIndex(this.$scope.manageAd.filteredList, (obj) => obj.id == response.id)
            this.$scope.manageAd.filteredList[index] = response;
            this.$scope.manageAd.setPagingData(this.$scope.manageAd.currentPage);
            this.editAdClass.editAdvertisementForm = false;
            this.$state.go('manage-ads');
            this.toaster.pop({type: 'info', body: 'Advertisement updated successfully'});
          }, err => {
            _.map(err.data.errors, (key, value) => {
              this.$log.log(key);
              this.toaster.pop({type: 'error', body: key.message});
            })
            this.editDisabled = false;
            this.$log.log(err);
          });
        }
        else{
          let editData = {
            name: this.editAds.name,
            startDate: startDate,
            endDate: endDate,
            os: osTypeList,
            description: this.editAds.description,
            noOfAvailablePoints: this.editAds.noOfAvailablePoints,
            gender: gender,
            countries: country,
            category: this.editAds.categoryTypeModel[0].id,
            zipcodes: zipCodes,
            media: this.editAds.media
          }
          this.ManageAdsService.editAdvertisement(this.editAds.id, 'questAds', editData).then(response => {
            let index = _.findIndex(this.$scope.manageAd.filteredList, (obj) => obj.id == response.id)
            this.$scope.manageAd.filteredList[index] = response;
            this.$scope.manageAd.setPagingData(this.$scope.manageAd.currentPage);
            this.editAdClass.editAdvertisementForm = false;
            if(!response.paid){
              this.$state.go('payment', {adId: response.id, adType: 'questAd'});
            }
            else{
              // this.ManageAdsService.updateAd(response.id).then(() => {
                this.$state.go('manage-ads');
              // })
            }
          }, err => {
            _.map(err.data.errors, (key, value) => {
              this.$log.log(key);
              this.toaster.pop({type: 'error', body: key.message});
            })
            this.isDisabled = false;
            this.$log.log(err);
          });
        }
      }
    // }
  }

  editAdvertisement(form){
    this.$log.log("EDIT ADS")
    this.$log.log(this.editAds)
    this.$log.log(this.zipCodeArray)
    let osTypeList = [];
    let gender = [];
    let country = [];
    let zipCodes = [];
    if(!this.maxSizeError) {
      if(this.editAds.media.length == 0){
        this.editMediaErrorMsg = true;
      }
    }
    if(this.editAds.categoryTypeModel.length === 0){
      this.categoryMessage = true;
    }
    // else{
      let startDate = moment(this.editAds.startDate).format();
      let endDate = moment(this.editAds.endDate).format();
      if(this.os){
        if(this.editAds.osTypeModel && this.editAds.osTypeModel.length > 0){
          osTypeList = _.compact(this.editAds.osTypeModel).map(function(a) {return a.name;});
        }
        else{
          this.osError = true;
          this.osErrorMessage = "OS toggle is ON, but didn't choose any OS\n"
        }
      }

      if(this.instantGenderModel) {
        if(this.editAds.genderTypeModel && this.editAds.genderTypeModel.length > 0)
        gender = _.compact(this.editAds.genderTypeModel).map(function(a) {return a.short;});
      else{
        this.genderError  = true;
        this.genderErrorMessage = "Gender toggle is ON, but didn't choose any OS\n"
      }
      }
      if(this.instantCountryModel) {
        if(this.editAds.countryModel && this.editAds.countryModel.length > 0)
          country = _.compact(this.editAds.countryModel).map(function(a) {return a.iso});
        else{
          this.countryError = true;
          this.countryErrorMessage = "Country toggle is ON, but didn't choose any country"
        }
      }
      if(this.zipCodeModel) {
        if(this.zipCodeArray && this.zipCodeArray.length > 0)
        zipCodes = _.compact(this.zipCodeArray);
      else
        this.zipCodeError = true;
        this.zipCodeErrorMessage = "ZipCode toggle is ON, but didn't choose any zipCode"
      }
      this.checkErr(startDate, endDate);
      if(this.errMessage != undefined || this.errMessage != ''){
        this.calMessage = true;
      }
      if(this.startErrMessage != undefined || this.startErrMessage != ''){
        this.startCalMessage = true;
      }
      if(form.$valid && (this.errMessage == '' || this.errMessage == undefined) && (this.startErrMessage == '' || this.startErrMessage == undefined)&& (!this.osError  && !this.genderError && !this.countryError && !this.zipCodeError) && this.editAds.media.length > 0 && !this.maxSizeError ){
         let data = {
          name: this.editAds.name,
          startDate: startDate,
          endDate: endDate,
          os: osTypeList,
          description: this.editAds.description,
          noOfAvailablePoints: this.editAds.noOfAvailablePoints,
          gender: gender,
          countries: country,
          category: this.editAds.categoryTypeModel[0].id,
          zipcodes: zipCodes,
          media: this.editAds.media
        }
        this.editDisabled = true;
        this.ManageAdsService.editAdvertisement(this.editAds.id, 'questAds', data).then(response => {
          let index = _.findIndex(this.$scope.manageAd.filteredList, (obj) => obj.id == response.id)
          this.$scope.manageAd.filteredList[index] = response;
          this.$scope.manageAd.setPagingData(this.$scope.manageAd.currentPage);
          this.editAdClass.editAdvertisementForm = false;
          this.$state.go('manage-ads');
          this.toaster.pop({type: 'info', body: 'Advertisement updated successfully'});
        }, err => {
          _.map(err.data.errors, (key, value) => {
            this.$log.log(key);
            this.toaster.pop({type: 'error', body: key.message});
          })
          this.editDisabled = false;
          this.$log.log(err);
        });
      }
    }

   //Date
    open1(){
     this.popup1.opened = true;
    }

    open2(){
      this.popup2.opened = true;
    }

    addZipCode(zipCode){
      if(zipCode){
        if(this.zipCodeError){
          this.zipCodeError = false;
        }
        this.zipCodeArray.push(zipCode);
        if(this.editAds)
          this.editAds.zipCode = '';
        else
          this.ads.zipCode = '';
      }
    }

    deleteZipCode(index){
      this.zipCodeArray.splice(index, 1);
    }

    openStartCalendar(e) {
      e.preventDefault();
      e.stopPropagation();
      this.endDateCalenderIsOpen = false;
      this.startDateCalenderIsOpen = true;
    }

    openEndCalendar(e) {
      e.preventDefault();
      e.stopPropagation();
      this.startDateCalenderIsOpen = false;
      this.endDateCalenderIsOpen = true
    }

  // file upload
  uploadFiles(file){
    this.$log.log("UPLOADED FILE")
    this.$log.log(file)
    if(file.length == 0) {
      this.maxSizeError = true;
      this.mediaErrorMessage = false;
      this.editMediaErrorMsg = false;
      this.showName = false;
      this.showMedia = false;
    }
    else{
      this.progress = 0;
      this.progressMessage = true;
      this.mediaErrorMessage = false;
      this.maxSizeError = false;
      this.editMediaErrorMsg = false;
      this.uploadFile(file[0]).then(uploadedFile =>  {
        // Mark as success
        this.$log.log("After upload")
        this.$log.log(uploadedFile)
        this.media = [];
        this.mediaName = file[0].name;
        if(this.editAds){
          this.showImage = true;
          this.editAds.media = [];
          this.editAds.media = [{
            url: uploadedFile.Location,
            name: file[0].name,
            type: 'image'
          }]
        }
        if(this.media){
          this.showImage = true;
          this.media = [{
            url: uploadedFile.Location,
            name: file[0].name,
            type: 'image'
          }]
        }
    }, error => {
          // Mark the error
          this.Error = error;
        }, progress => {
            // Write the progress as a percentage
            this.progressObj = progress;
            this.Progress = (progress.loaded / progress.total) * 100
            if(this.Progress === 100){
              this.showName = true;
              this.mediaErrorMessage = false;
              this.editMediaErrorMsg = false;
              this.maxSizeError = false;
              this.showMedia = true;
              this.progressMessage = false;
            }
        });
      }
    }

    uploadFile(file) {
      AWS.config.region = this.AWS_CONFIG.REGION;
      AWS.config.update({ accessKeyId: 'AKIAJITQKLL7W4LCQEQQ', secretAccessKey: '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' });
      let bucket = new AWS.S3();
      let ext = file.name.split('.').pop();
      let random = Math.random().toString(36).substr(2, 9);
      let name = file.name.substr(0, file.name.lastIndexOf('.'));
      let newFileName = name + '_' + random + '.' + ext;

      let deferred = this.$q.defer();
      let params = { Bucket: this.AWS_CONFIG.BUCKET_NAME, Key: newFileName, ContentType: file.type, Body: file };
      let options = {
        // Part Size of 10mb
        partSize: 10 * 1024 * 1024,
        queueSize: 1,
        // Give the owner of the bucket full control
        ACL: 'bucket-owner-full-control'
      };
      this.uploader = bucket.upload(params, options, function (err, data) {
        // if (err) {
        //   deferred.reject(err);
        // }
        deferred.resolve(data);
      });
      this.uploader.on('httpUploadProgress', function (progress) {
        // console.log(Math.round(progress.loaded / progress.total * 100) + '% done');
        deferred.notify(progress);
      });
      return deferred.promise;
    }


    deleteFile() {
      this.$log.log("Delete file")
      this.uploader.abort();
      this.showName = false;
      this.showMedia = false;
      this.maxSizeError = false;
      this.progressMessage = false;
      if(this.media)
        this.media = [];
      if(this.editAds)
        this.editAds.media = [];
    }
}

