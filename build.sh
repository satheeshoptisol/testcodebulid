#!/bin/bash
echo "******************************"
echo "CFT Web deployment starting ... "
echo "******************************"
echo " "
echo "Build a docker image..."
echo " "
docker build -t 058124573567.dkr.ecr.us-west-1.amazonaws.com/cft-web .
echo " "
echo "Login to AWS ECR"
echo " "
$(aws ecr get-login --region us-west-1 --no-include-email)
echo " "
echo "Push docker image to AWS ECR"
echo " "
docker push 058124573567.dkr.ecr.us-west-1.amazonaws.com/cft-web:latest
echo " "
echo "Update the cft-web service with the new docker image pushed"
echo " "
./ecs-deploy -k AKIAJITQKLL7W4LCQEQQ -s 2tO1Cr2j2gPRx/6fsFilrKBujCPzLLXAKygNBzZX -r us-west-1 -c cft-cluster-new -n cft-frontend-elb -i 058124573567.dkr.ecr.us-west-1.amazonaws.com/cft-web
echo "******************************"
echo "Deployment completed..!!!"
echo "******************************"
