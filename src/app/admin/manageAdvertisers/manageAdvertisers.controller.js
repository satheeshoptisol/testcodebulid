export class ManageAdvertisersController {
  constructor ($timeout, toaster, $uibModal, $log, $document, ManageAdvertisersService) { 
    'ngInject';

    this.awesomeThings = [];
    this.classAnimation = '';
    this.creationDate = 1488448684833;
    this.toaster = toaster;
    this.$uibModal = $uibModal;
    this.myClass = { createAdvertiserForm: false };
    this.editClass = { editAdvertiserForm: false };
    this.viewAdvertiserClass = { viewAdvertiserDetail: false };
    this.hideSearchClass = { hideSearch: false };
    this.ManageAdvertisersService = ManageAdvertisersService;
    this.isAllSelected = false;
    this.isDisabled = false;
    this.editDisabled = false;
    this.$log = $log;
    //pagination
    this.currentPage = 1;
    this.itemsPerPage = 10;
    this.maxSize = 5; //pagination max size
    this.entryLimit = 10;
    this.setPagingData(this.currentPage);
  }

  toggleClass() {
    this.advertiserForm.$setPristine();
    this.advertiserForm.$setUntouched();
		this.myClass.createAdvertiserForm = !this.myClass.createAdvertiserForm;
	}

  toggleEditAdvertiserClass(id){
    this.viewAdvertiserClass.viewAdvertiserDetail = false;
    this.editDisabled = false;
    this.editAdvertiser = angular.copy(this.filteredList.filter((user) => user.id == id)[0]);
    this.editClass.editAdvertiserForm = !this.editClass.editAdvertiserForm;
    if(this.editAdvertiser.isActive)
      this.editAdvertiser.status = 'Active';
    else
      this.editAdvertiser.status = 'Inactive';
  }

  toggleViewAdvertiserClass(id){
    this.myClass.createAdvertiserForm = false;
    this.editClass.editAdvertiserForm = false;
    this.viewAdvertiser = this.filteredList.filter((user) => user.id == id)[0]
    this.viewAdvertiserClass.viewAdvertiserDetail = !this.viewAdvertiserClass.viewAdvertiserDetail; 
  }

  isActiveToggle(){
    if(this.editAdvertiser.isActive)
      this.editAdvertiser.status = 'Active';
    else
      this.editAdvertiser.status = 'Inactive';
  }

  createAdvertiser(form){
    if(form.$valid){
      let filteredList = this.filteredList;
      this.isDisabled = true;

      this.ManageAdvertisersService.createAdvertiser(this.advertiser).then(response => {
        this.advertiser = {};
        this.advertiserForm.$setPristine();
        this.advertiserForm.$setUntouched();
        this.isDisabled = false;
        this.myClass.createAdvertiserForm = !this.myClass.createAdvertiserForm;
        filteredList.push(response);
        this.setPagingData(this.currentPage);
        this.toaster.pop({type: 'info', body: 'Advertiser created successfully'});
      }, err => {
        this.toaster.pop({type: 'error', body: 'Email already exists'});
        this.isDisabled = false;
        this.$log.log(err);
      })
    }
  }

  editAdvertiserFields(form){
    if(form.$valid){
      this.editDisabled = true;
      this.ManageAdvertisersService.editAdvertiser(this.editAdvertiser.id, this.editAdvertiser).then(response => {
        this.editClass.editAdvertiserForm = false;
        let index = _.findIndex(this.filteredList, (obj) => obj.id == response.id)
        this.filteredList[index] = response; 
        this.setPagingData(this.currentPage);
        this.toaster.pop({type: 'info', body: 'Advertiser updated successfully'});
      }, err => {
        _.filter(err.data.error, function(key, value){
          this.toaster.pop({type: 'error', body: key[0].message});
        })
        this.editDisabled = false;
        this.$log.log(err);
      });
    }
  }

  closeSlideContent() {
    this.myClass.createAdvertiserForm = false;
    this.editClass.editAdvertiserForm = false;
    this.viewAdvertiserClass.viewAdvertiserDetail = false;
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

  deleteAllAdvertiser() {
     angular.forEach(this.filteredList, (advertiser) => { 
      if(advertiser.selected){
        this.ManageAdvertisersService.deleteAdvertiser(advertiser.id).then(response => {
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

  deleteModal (advertiser) {
    var modalInstance = this.$uibModal.open({
      animation: this.animationsEnabled,
      ariaLabelledBy: 'modal-title',
      ariaDescribedBy: 'modal-body',
      templateUrl: 'myModalContent.html',
      controller: 'ModalInstanceController',
      controllerAs: 'modal',
      resolve: {
        selected: function () {
          return ({objectId: advertiser.id});
        }
      }
    });

    modalInstance.result.then(advertiserId => {
       this.ManageAdvertisersService.deleteAdvertiser(advertiserId.objectId).then(response => {
          this.filteredList = this.filteredList.filter(obj => obj.id != response.id)
          this.setPagingData(this.currentPage);
          this.toaster.pop({type: 'info', body: 'Advertiser deleted successfully'});

        }, err => {
          this.$log.log(err);
        });
    })
  }

  getStatus(status){
    if(status)
      return 'Active'
    else
      return 'Inactive'
  }

  // pagination code starts
  setPage(pageNo) {
   this.currentPage = pageNo;
  }

  pageChanged() {
    this.setPagingData(this.currentPage);
   }

  setPagingData(page) {
    this.ManageAdvertisersService.listAdvertiserByPagination(page).then(response => {
      this.filteredList = response.result;
      this.advertiserCount = response.totalCount;
    }, err => {
      this.$log.log(err);
    });
  }
   // ends

  search(toSearch){
     var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
     if(toSearch != undefined){
      if(re.test(toSearch)){
        this.ManageAdvertisersService.searchAdvertiserList('email', toSearch).then(response => {
          this.filteredList = response.result;
          this.advertiserCount = response.totalCount;
        }, err => {
          this.$log.log(err);
        });
      }
      else{
        this.ManageAdvertisersService.searchAdvertiserListByName(toSearch).then(response => {
          this.filteredList = response.result;
          this.advertiserCount = response.totalCount;
          this.$log.log(response);
        }, err => {
          this.$log.log(err);
        });
      }
    }
  }

  checkEmpty(){
    if(this.searchValue.length == 0){
      this.setPagingData(1);
    }
  }

  searchAdvertiserByName(toSearch){
    this.ManageAdvertisersService.searchAdvertiserListByName(toSearch).then(response => {
      this.filteredList = response.result;
      this.advertiserCount = response.totalCount;
    }, err => {
      this.$log.log(err);
    });
  }

}
