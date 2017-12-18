#Click Flyp Technology

###To setup the application:
```bash
$ https://github.com/jaiobs/cft-web.git
$ cd cft-web
$ bower install
$ npm install
$ gulp serve
```

###To run the application:
```bash
$ git pull origin < branch_name >
$ bower install (If required)
$ npm install (If required)
$ gulp serve
```

## AWS Build and push cft web app
`gulp build`
`docker build -t 058124573567.dkr.ecr.us-west-1.amazonaws.com/cft-web .`
`$(aws ecr get-login --region us-west-1)`
`docker push 058124573567.dkr.ecr.us-west-1.amazonaws.com/cft-web:latest`
