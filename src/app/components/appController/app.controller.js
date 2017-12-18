export class AppController {
  constructor ($timeout, $state, toaster, $auth, $location, AWS_CONFIG, $q, LoginService, $localStorage, $rootScope, $window, $log, ManageAdsService, ManageAdvertisersService) {
    'ngInject';

    this.awesomeThings = [];
    this.classAnimation = '';
    this.creationDate = 1488448684833;
    this.toaster = toaster;
    this.myClass = { contentLeft: true, sidebarWidth: true, headerWidth:true  };
    this.$state = $state;
    this.$auth = $auth;
    this.AWS_CONFIG = AWS_CONFIG;
    this.$q = $q;
    this.isDisabled = false;
    this.$location = $location;
    this.LoginService = LoginService;
    this.$localStorage = $localStorage;
    this.ManageAdsService = ManageAdsService;
    this.ManageAdvertisersService = ManageAdvertisersService;
    this.$rootScope = $rootScope;
    this.$window = $window;
    this.$log = $log;
    this.myClass = { allNotification: false };
    this.showEditProfile = false;


    this.adTypesClass = { adTypesForm: false };
    this.viewProfileClass = { viewProfile: false };

    // this.$log.log(this.$auth.getPayload())
    if(this.$auth.isAuthenticated())
      this.fetchAllNotification();


    this.adminSideBarMenuItems = [
      {
        "name" : "Dashboard",
        "imgInactive"  : "../assets/images/dashboard.png",
        "imgActive": "../assets/images/dashboard_active.png",
        "sref" : "admin-dashboard",
        "state": "/dashboard"
      },
      {
        "name": "Manage Advertisers",
        "imgInactive": "../assets/images/manage_Advertisers.png",
        "imgActive": "../assets/images/manage_Advertisers-active.png",
        "sref": "manage-advertisers",
        "state": "/admin/manage-advertisers"
      },
      {
        "name": "Manage Ads Categories",
        "imgInactive": "../assets/images/manage_ad_category.png",
        "imgActive": "../assets/images/manage_ad_category.png",
        "sref": "manage-ad-categories",
        "state": "/admin/manage-ad-categories"
      },
      {
        "name": "Manage Ads",
        "imgInactive": "../assets/images/manage_ads.png",
        "imgActive": "../assets/images/manage_ads_active.png",
        "sref": "manage-ads",
        "state": "/manage-ads"
      },
      {
        "name": "Reports",
        "imgInactive": "../assets/images/reports.png",
        "imgActive": "../assets/images/reports_active.png",
         "sref": "reports",
         "state": "/reports"
      }
    ];

    this.advertiserSideBarMenuItems = [
      {
        "name" : "Dashboard",
        "imgInactive"  : "../assets/images/dashboard.png",
        "imgActive": "../assets/images/dashboard_active.png",
        "sref" : "admin-dashboard",
        "state": "/dashboard"
      },
      {
        "name":"Mange Ads",
        "imgInactive":"../assets/images/manage_ads.png",
        "imgActive":"../assets/images/manage_ads_active.png",
        "sref":"manage-ads",
        "state": "/admin/manage-ads"
      },
      {
        "name": "Reports",
        "imgInactive": "../assets/images/reports.png",
        "imgActive": "../assets/images/reports_active.png",
         "sref": "javascript:void(0)",
         "state": "/reports"
      }
    ];
  }


    //Close Slide
    closeSlideContent() {
      this.adTypesClass.adTypesForm = false;
      this.showEditProfile = false;
      this.user = {};
      this.avatar = [];
      this.user.firstName = this.$auth.getPayload().user.firstName;
      this.user.lastName = this.$auth.getPayload().user.lastName;
      this.user.email = this.$auth.getPayload().user.email;
      this.avatar[0].url = this.$auth.getPayload().avatarUrl;

    }

    toggleClass() {
      this.myClass.contentLeft = !this.myClass.contentLeft;
      this.myClass.sidebarWidth= !this.myClass.sidebarWidth;
      this.myClass.headerWidth= !this.myClass.headerWidth;
    }

    toggleNotificationClass() {
      this.$log.log(this.$localStorage.notificationListLength)
      if(this.$localStorage.notificationListLength === 0 ){
        this.myClass.allNotification = false;
      }
      else if(this.$auth.getPayload() && (this.$localStorage.notificationList === undefined ) ) {
      // fetch all notification fn.
        this.LoginService.fetchAllNotification().then(response => {
          this.notificationList = response.result;
          this.$localStorage.notificationList = response.result;
          this.$localStorage.notificationListLength = response.result.length;
          // this.$rootScope.$emit('notifications', this.$localStorage.notificationList);
          this.$localStorage.count = this.$localStorage.notificationList.filter((notification) => !notification.isRead).length;
          this.showNotificationCount = this.$localStorage.count > 0
          this.myClass.allNotification = !this.myClass.allNotification;
        }, err => {
          this.$log.log(err)
          this.toaster.pop({type: 'error', body: err.data.err});
          this.isDisabled = false;
          return err;
        })
      }
      else{
        this.myClass.allNotification = !this.myClass.allNotification;
      }
    }

    closeNotification() {
      if(this.myClass.allNotification)
        this.myClass.allNotification = false;
    }

    showEditProfileForm() {
      this.showEditProfile = true;
      this.user = {};
      this.avatar = [];
      this.user.firstName = this.$auth.getPayload().user.firstName;
      this.user.lastName = this.$auth.getPayload().user.lastName;
      this.user.email = this.$auth.getPayload().user.email;
      this.avatar = [{
        url: this.$auth.getPayload().user.avatarUrl
      }]
    }

    uploadFiles(file){
      this.$log.log("UPLOADED FILE")
      this.$log.log(file)
      this.progressMessage = true;
      this.uploadFile(file[0]).then(uploadedFile =>  {
        // Mark as success
        this.$log.log("After upload")
        this.$log.log(uploadedFile)

        this.avatar = [{
          url: uploadedFile.Location
        }]
        this.mediaName = file[0].name;

        this.ManageAdsService.isImage(this.avatar).then(result => {
          if(result){
            this.showImage = true;
            this.avatar = [{
              url: uploadedFile.Location
            }]
          }
          else{
            this.showImage =false;
          }
        });
        }, error => {
          // Mark the error
          this.Error = error;
        }, progress => {
            // Write the progress as a percentage
            this.Progress = (progress.loaded / progress.total) * 100
            if(this.Progress === 100){
              this.showName = true;
              this.mediaErrorMessage = false;
              this.progressMessage = false;
            }
        });
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

    updateProfile(form) {
      if(this.avatar == undefined){
        this.mediaErrorMessage = true;
      }
      else{
        if(form.$valid){
          this.isDisabled = true;
          let data = {
            firstName: this.user.firstName,
            lastName: this.user.lastName,
            email: this.user.email,
            avatarUrl: this.avatar[0].url
          }
          this.ManageAdvertisersService.updateProfile(this.$auth.getPayload().user.id, data).then(response => {
            this.$localStorage.avatarUrl = response.avatarUrl;
            this.$localStorage.fullName = response.fullName;
            this.$auth.getPayload().user = response;
            this.getUserName();
            // this.getAvatarUrl();
            this.toaster.pop({type: 'success', body: 'Profile updated successfully'});
            this.adTypesClass.adTypesForm = false;
            this.isDisabled = false;
          }, err => {
            _.map(err.data.error, (key, value) => {
              this.$log.log(key);
              this.toaster.pop({type: 'error', body: key[0].message});
              this.isDisabled = false;
            })
            this.isDisabled = false;
            this.$log.log(err);
          })
        }
      }
    }

    submitForm(form){
      if(form.$valid){
        this.isDisabled = true;
        let data = {
          email: this.email,
          password: this.password
        }

        this.$auth.login(data).then(response => {
          if(response){
            this.userLoggedIn = true;
            this.isDisabled = false;
            this.user = {};
            this.avatar = [];
            this.user.firstName = this.$auth.getPayload().user.firstName;
            this.user.lastName = this.$auth.getPayload().user.lastName;
            this.user.email = this.$auth.getPayload().user.email;
            this.avatar = [{
              url: this.$auth.getPayload().user.avatarUrl
            }]
            this.$localStorage.fullName = this.$auth.getPayload().user.fullName;
            this.$localStorage.avatarUrl = this.$auth.getPayload().user.avatarUrl;

            this.toaster.pop({type: 'success', body: 'Logged in successfully'});
            this.$state.go('admin-dashboard');
            this.fetchAllNotification();
        }
      }, err => {
          this.$log.log(err)
          this.toaster.pop({type: 'error', body: err.data.err});
          this.isDisabled = false;
        })
      }
    }

    logout() {
      this.$auth.logout().then(response => {
        delete this.$localStorage.fullName;
        delete this.$localStorage.avatarUrl;
        delete this.$localStorage.notificationList;
        delete this.$localStorage.notificationListLength;
        this.$state.go('login');
      })
    }

    redirectToProfile() {
      this.adTypesClass.adTypesForm = !this.adTypesClass.adTypesForm;
    }

    getClass(path) {
      return (this.$location.path().substr(0, path.length) === path) ? true : false;
    }

    getStatus(notificationStatus) {
      return (notificationStatus) ? true : false;
    }

    getUserName() {
      if(this.$auth.getPayload()){
        this.$localStorage.fullName = this.$auth.getPayload().user.fullName;
        return this.$localStorage.fullName;
      }
    }

    getAvatarUrl() {
      if(this.localStorage)
        return this.$localStorage.avatarUrl;
      else {
        if(this.$auth.getPayload()){
          if(!this.$auth.getPayload().user.avatarUrl) 
            return '../assets/images/default-pic.png';
          else{
            this.$localStorage.avatarUrl = this.$auth.getPayload().user.avatarUrl;
            return this.$localStorage.avatarUrl;
          }
        }
      }
    }

    getUserRole() {
      return this.$auth.getPayload() && this.$auth.getPayload().user.role.name
    }

    sideMenus() {
      if(this.$auth.getPayload()){
        if(this.$auth.getPayload().user.role.name === 'admin')
          return this.adminSideBarMenuItems;
        else
          return this.advertiserSideBarMenuItems;
      }
    }

    getNotificationTime(time) {
      return moment(time).fromNow()
    }

    markAllAsRead() {
      this.LoginService.markAllAsRead().then(response => {
        this.$log.log("MARK ALL AS READ")
        this.$log.log(response)
        this.myClass.allNotification = false;
        this.fetchAllNotification();
      }, err => {
        this.$log.log(err)
      })
    }

    fetchAllNotification() {
      this.$log.log("GET ALL NOTIFICATION")
      this.LoginService.fetchAllNotification().then(response => {
          this.notificationList = response.result;
          this.$localStorage.notificationList = response.result;
          this.$localStorage.notificationListLength = response.result.length;
          // this.$rootScope.$emit('notifications', this.$localStorage.notificationList);
          this.$localStorage.count = this.$localStorage.notificationList.filter((notification) => !notification.isRead).length;
          this.$log.log(this.$localStorage.count)
          this.showNotificationCount = this.$localStorage.count > 0
          this.$log.log(this.notificationList)
        }, err => {
          this.$log.log(err)
          this.toaster.pop({type: 'error', body: err.data.err});
          this.isDisabled = false;
          return err;
        })
      }

    updateNotification(notification) {
      this.$log.log("NOTIFY")
      this.$log.log(notification)
      this.$state.go(`manage-ads.${notification.obj.toLowerCase()}`, {page: 'view', id: notification.objId});
      this.fetchAllNotification();
      this.myClass.allNotification = false;

      let data ={
        isRead: true
      }
      this.LoginService.updateNotificationReadStatus(notification.id, data).then( response => {
        this.$log.log("TINNNN")
        this.$log.log(response)
        if(this.$localStorage.count > 0){
          this.$localStorage.$reset({count: this.$localStorage.count - 1});
          this.showNotificationCount = this.$localStorage.count > 0
        }
        else{
          this.myClass.allNotification = false;
        }
      })
      .catch(response => {
        this.$log.log(response)
      })
    }

}
