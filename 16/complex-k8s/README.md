# complex-k8s

Complex application which will be run on k8s via Google's Kubernetes Engine. 

Done as part of the Udemy course [Docker & Kubernetes: The Complete Guide](https://www.udemy.com/course/docker-and-kubernetes-the-complete-guide/). 

For the remaining of the course files, please see the repository [here](https://github.com/AhmadHatziq/docker-k8s-complete-guide). 

Command to install the nginx (community version) locally: 
kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/controller-v1.7.0/deploy/static/provider/cloud/deploy.yaml

Command used to install nginx (community version) on GKE: 
- Install Helm 
- Use Helm to install nginx 