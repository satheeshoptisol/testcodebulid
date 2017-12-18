export class ReportsController {
  constructor (ManageAdsService, getReports) {
    'ngInject';
    this.ManageAdsService = ManageAdsService;
    //pagination
    this.currentPage = 1;
    // this.itemsPerPage = 10;
    // this.maxSize = 5; //pagination max size
    // this.entryLimit = 10;
    console.log("HELLO")
    console.log(getReports)
    this.reportDetails = getReports.result;
    this.allReports = getReports.result;
    this.reportCount = getReports.totalCount;
    // this.setPagingData(this.currentPage);

    this.filterOptions = {
     filter:  [ 
       { id:0, name: 'All', value:"All"},
       { id:1, name: 'Instant Ad', value:"instantAd"},
       { id:2, name: 'Letter collection Ad', value:"letterCollectionAd"},
       { id:3, name: 'Puzzle Ad', value:"puzzleAd"},
       { id:4, name: 'Quest Ad', value: 'questAd'}
     ]
    };

    this.cols = [{
      name: 'ad.name',
      orderDesc: false
    }, {
      name: 'lastName',
      orderDesc: false
    }];
  }


  pageChanged() {
    // this.setPagingData(this.currentPage);
    var startPos = (this.currentPage - 1) * 10;
    // this.reportData = this.reportDetails.slice(startPos, startPos + 3);
  }

  searchTextValue(searchText) {
    console.log(searchText)
  }

  checkEmpty(){
    // if(this.searchValue.length == 0){
    //   this.setPagingData(1);
    // }
  }

  reportFilter(data) {
    console.log("data")
    if(data == 'All') {
      this.reportDetails = this.allReports;
    }
    else{
      this.ManageAdsService.reportFilter('ad_type', data).then(response => {
        console.log(response.result)
        this.reportDetails = response.result;
        this.reportCount = response.totalCount;
      }, err => {
        console.log(err)
      });
    }
  }
}
