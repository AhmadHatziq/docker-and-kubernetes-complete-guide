
# Build client image 
docker build -t bobuvula/multi_client:latest -t bobuvula/multi_client:$SHA -f ./client/Dockerfile ./client 

# Build server image 
docker build -t bobuvula/multi_server:latest -t bobuvula/multi_server:$SHA -f ./server/Dockerfile ./server 

# Build worker image 
docker build -t bobuvula/multi_worker:latest -t bobuvula/multi_worker:$SHA -f ./worker/Dockerfile ./worker 

# Push the images to Dockerhub for :latest 
docker push bobuvula/multi_client:latest  
docker push bobuvula/multi_server:latest  
docker push bobuvula/multi_worker:latest  

# Push the images to Dockerhub for :$SHA
docker push bobuvula/multi_client:$SHA  
docker push bobuvula/multi_server:$SHA  
docker push bobuvula/multi_worker:$SHA  

# Apply k8s configuration files 
kubectl apply -f k8s 

# Set the server image to use the latest version using the $SHA
# Omitting this step for the client & server as I am using the lecturer's other versions. 
# There is some error going on. 
# kubectl set image deployments/worker-deployment worker=bobuvula/worker_client:$SHA
kubectl set image deployments/worker-deployment worker=stephengrider/multi-worker:latest

# Fix the server and client images
kubectl set image deployments/server-deployment server=cygnetops/multi-server-pgfix-5-11:latest
kubectl set image deployments/client-deployment client=stephengrider/multi-client:latest 

echo "finished deploy.sh"