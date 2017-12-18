export class ManageAdsController {
  constructor(toaster, $uibModal, ManageAdsService, $state, $auth, $log) {
    'ngInject';
    this.adTypesClass = { adTypesForm: false };
    this.toaster = toaster;
    this.ManageAdsService = ManageAdsService;
    this.$uibModal = $uibModal;
    this.hideSearchClass = { hideSearch: false };
    this.isAllSelected = false;
    this.isDisabled = false;
    this.editDisabled = false;
    this.$log = $log;
    this.$state = $state;
    this.$auth = $auth;


    this.filterOptions = {
     filter:  [ 
       { id:0, name: 'All', value:"All"},
       { id:1, name: 'Instant Ad', value:"instantAd"},
       { id:2, name: 'Letter collection Ad', value:"letterCollectionAd"},
       { id:3, name: 'Puzzle Ad', value:"puzzleAd"},
       { id:4, name: 'Quest Ad', value: 'questAd'}
     ]
    };

    //pagination
    this.currentPage = 1;
    this.itemsPerPage = 10;
    this.maxSize = 5; //pagination max size
    this.entryLimit = 10;
    this.setPagingData(this.currentPage);

    this.getOSList = this.getOSList();
    this.getCountry = this.getCountry();
    this.getAdCategory = this.getAdCategory();
    this.getAdvertiserList = this.getAdvertiserList();
  }

  // OS
  getOSList() {
    this.ManageAdsService.getOSList().then(response => {
      this.osTypes = response.result;
    }, err => {
      this.isDisabled = false;
    });
  }

  // get country list

  getCountry() {
    this.ManageAdsService.getCountryList().then(response => {
      this.countryTypes = _.map(response.result, function (element) {
        return _.extend({}, element, { ticked: false });
      });
    }, err => {
      this.isDisabled = false;
    });
  }

  getAdCategory() {
    this.ManageAdsService.getAdCategoryList().then(response => {
      this.categoryTypes = _.sortBy(_.map(response.result, function (element) {
        return _.extend({}, element, { ticked: false });
      }), 'name');
    }, err => {
      // this.toaster.pop({type: 'error', body: 'Email already exists'});
      this.isDisabled = false;
    });
  }

  getAdvertiserList() {
    if (this.$auth.getPayload().user.role.name === 'admin') {
      this.ManageAdsService.getAdvertiserList().then(response => {
        this.advertiserList = _.map(response.result, function (element) {
          return _.extend({}, element, { ticked: false });
        });
        this.$log.log("ADVER")
        this.$log.log(this.advertiserList)
      }, err => {
        // this.toaster.pop({type: 'error', body: 'Email already exists'});
        this.isDisabled = false;
      });
    }
  }

  adCheckBoxToggled() {  //ng repeat checkbox - select all
    this.isAllSelected = this.filteredList.every((itm) => itm.selected);
    let selectedCount = this.filteredList.filter((obj) => obj.selected).length
    this.hideSearchClass.hideSearch = selectedCount > 1;
  }

  // Toggle All
  toggleAllCheckbox() {
    this.hideSearchClass.hideSearch = !this.hideSearchClass.hideSearch;
    var toggleStatus = !this.isAllSelected;
    angular.forEach(this.filteredList, (itm) => {
      itm.selected = !toggleStatus;
    });
  }

  //Toggle Ad Types
  toggleSelectAdTypeClass() {
    this.adTypesClass.adTypesForm = !this.adTypesClass.adTypesForm;
  }

  //Close Slide
  closeSlideContent() {
    this.adTypesClass.adTypesForm = false;
  }

  deleteModal(id, type) {
    var modalInstance = this.$uibModal.open({
      animation: this.animationsEnabled,
      ariaLabelledBy: 'modal-title',
      ariaDescribedBy: 'modal-body',
      templateUrl: 'myModalContent.html',
      controller: 'ModalInstanceController',
      controllerAs: 'modal',
      resolve: {
        selected: function () {
          return ({ objectId: id, objectType: type });
        }
      }
    });

    modalInstance.result.then(advertisement => {
      this.ManageAdsService.deleteAdvertisement(advertisement.objectId, advertisement.objectType).then(response => {
        this.filteredList = this.filteredList.filter(obj => obj.id != response.id);
        this.setPagingData(this.currentPage);
        this.toaster.pop({ type: 'info', body: 'Advertiser deleted successfully' });

      }, err => {
        this.$log.log(err);
      });
    });
  }

  deleteAllAds() {
    angular.forEach(this.filteredList, advertisement => {
      if (advertisement.selected) {
        this.$log.log(`${advertisement.adType}`);
        this.$log.log(advertisement[advertisement.adType].id);
        this.ManageAdsService.deleteAdvertisement(advertisement[advertisement.adType].id, advertisement.adType).then(response => {
          this.filteredList = this.filteredList.filter(obj => obj.id != response.id);
          this.setPagingData(this.currentPage);
          this.isAllSelected = false;
          this.hideSearchClass.hideSearch = false;
        }, err => {
        });
      }
    });
    this.toaster.pop({ type: 'info', body: 'Advertisements deleted successfully' });
  }

  getStatus(status, startDate, endDate) {
    if(!status){
      return 'Unpublished'
    }
    else{
      if (new Date(startDate) > new Date() )
        return 'Upcoming';
      else if(new Date(startDate) < new Date() && new Date(endDate) >= new Date())
        return 'Published';
      else
        return 'Ended';
    }
  }

  // pagination code starts
  setPage(pageNo) {
    this.currentPage = pageNo;
  }

  pageChanged() {
    this.setPagingData(this.currentPage);
  }

  setPagingData(page) {
    this.isAllSelected = false;
    this.hideSearchClass.hideSearch = false;
    this.ManageAdsService.listAdvertisementByPagination(page).then(response => {
      this.filteredList = response.result;
      this.advertisementCount = response.totalCount;
    }, err => {
    });
  }
  // ends

  search(toSearch) {
    if (toSearch != undefined) {
      this.ManageAdsService.searchAdvertisementList('name', toSearch).then(response => {
        this.filteredList = response.result;
        this.advertisementCount = response.totalCount;
      }, err => {
      });
    }
  }

  checkEmpty() {
    if (this.searchValue.length == 0) {
      this.setPagingData(1);
    }
  }

  goToAd(page, type, id) {
    this.$log.log(type)
    this.$state.go(`manage-ads.${type.toLowerCase()}`, { page: page, id: id })
  }

  adFilter(data) {
    console.log("data")
    if(data == 'All') {
      this.setPagingData(1);
    }
    else{
      this.ManageAdsService.adFilter('ad_type', data).then(response => {
        console.log(response.result)
        this.reportDetails = response.result;
        this.reportCount = response.totalCount;
      }, err => {
        console.log(err)
      });
    }
  }

}

