/// <reference types="aws-sdk" />
export class ManageAdsService {
  constructor ($log, Restangular, $q, AWS_CONFIG) {
    'ngInject';

    this.Restangular = Restangular;
    this.$q = $q;
  
  }

    createAdvertisement(data, type) {
      return this.Restangular.all(type).post(data);
    }

    listAds() {
      return this.Restangular.one('instantAds?populate=category').customGET('');
    }
    
    listAdvertisementByPagination(page){
      return this.Restangular.one('masterAds?populate=instantAd,letterCollectionAd,puzzleAd,questAd,createdBy&sort=updatedAt DESC&limit=10&page='+page).customGET('');
    }

    getAdvertiserList() {
      return this.Restangular.all('users?sort=firstName ASC').customGET('');
    }

    getAdvertisement(id, type) {
      return this.Restangular.all(`${type}/${id}?populate=category,media,createdBy`).customGET('');
    }

    editAdvertisement(id, type, data) {
      return this.Restangular.one(type, id).customPUT(data);
    }

    deleteAllAdvertisement(id) {
      return this.Restangular.one('masterAds', id).remove();
    }

    deleteAdvertisement(id, type) {
      return this.Restangular.one(`${type}s`, id).remove();
    }

    getOSList(){
      return this.Restangular.one('OS?sort=name ASC').customGET('');
    }

    getCountryList(){
      return this.Restangular.one('Countries?sort=name ASC').customGET('');
    }

    getAdCategoryList(){
      return this.Restangular.one('categories/listPublished').customGET('');
    }

    searchAdvertisementList(field, toSearch) {
      return this.Restangular.all(`instantAds?limit=10&page=1&where={"${field}":{"contains":"${toSearch}"}}`).customGET('');
    }

    updateAd(id, type) {
      return this.Restangular.one(`${type}/${id}`).customPOST({published: true});
    }

    assignAdvertiser(data) {
      return this.Restangular.all('masterAds/assignAd').post(data);
    }

    getReports() {
      return this.Restangular.one('reports?sort=updatedAt DESC').get();
    }

    searchReportList(field, toSearch) {
      return this.Restangular.all(`reports?limit=10&page=1&where={"${field}":{"startsWith":"${toSearch}"}}`).customGET('');
    }

    reportFilter(field, type, page) {
      return this.Restangular.all(`reports?where={"${field}":{"startsWith":"${type}"}}`).customGET('');
    }

    adFilter(field, type) {
      return this.Restangular.all(`masterAds?limit=10&page=1&where={"${field}":{"startsWith":"${type}"}}`).customGET('');
    }

    // uploadFile(file) {
    //   AWS.config.region = this.AWS_CONFIG.REGION;
    //   AWS.config.update({ accessKeyId: 'AKIAJITQKLL7W4LCQEQQ', secretAccessKey: '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' });
    //   let bucket = new AWS.S3();
    //   let ext = file.name.split('.').pop();
    //   let random = Math.random().toString(36).substr(2, 9);
    //   let name = file.name.substr(0, file.name.lastIndexOf('.'));
    //   let newFileName = name + '_' + random + '.' + ext;

    //   let deferred = this.$q.defer();
    //   let params = { Bucket: this.AWS_CONFIG.BUCKET_NAME, Key: newFileName, ContentType: file.type, Body: file };
    //   let options = {
    //     // Part Size of 10mb
    //     partSize: 10 * 1024 * 1024,
    //     queueSize: 1,
    //     // Give the owner of the bucket full control
    //     ACL: 'bucket-owner-full-control'
    //   };
    //   uploader = bucket.upload(params, options);
    //   uploader.then(function (err, data) {
    //     if (err) {
    //       deferred.reject(err);
    //     }
    //     deferred.resolve(data);
    //   });
    //   console.log("uploader")
    //   console.log(uploader)
    //   uploader.on('httpUploadProgress', function (progress) {
    //     // console.log(Math.round(progress.loaded / progress.total * 100) + '% done');
    //     deferred.notify(progress);
    //   });
    //   return deferred.promise;
    // }

    deleteFile(file) {
      console.log(file)
      uploader.abort();
      // AWS.config.region = this.AWS_CONFIG.REGION;
      // AWS.config.update({ accessKeyId: 'AKIAJITQKLL7W4LCQEQQ', secretAccessKey: '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' });
      // let bucket = new AWS.S3();
      // let fileName = file.split('/').pop();
      // // let newFileName = name + '_' + random + '.' + ext;

      // let deferred = this.$q.defer();
      // let params = { Bucket: this.AWS_CONFIG.BUCKET_NAME, Key: fileName};
      // console.log("PARAMS")
      // console.log(params)
      // let options = {
      //   ACL: 'bucket-owner-full-control'
      // };
      // bucket.abort(params, options, function (err, data) {
      //   if (err) {
      //     alert("ERror")
      //     deferred.reject(err);
      //   }
      //   else{
      //     alert("NO error")
      //     deferred.resolve(data);
      //   }
      // });
      // return deferred.promise;
    }


    isImage(src) {
      var deferred = this.$q.defer();
      var image = new Image();
      image.onerror = function() {
        deferred.resolve(false);
      };
      image.onload = function() {
        deferred.resolve(true);
      };
      image.src = src[0].url;
      return deferred.promise;
  }


}
