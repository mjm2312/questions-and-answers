### questions & answers service

This project contains a RESTful api for the questions and answers portion of an ecommerce site. The Express api comprises 4 routes (documentation at bottom of file) which interface with a postgres database. Below, you'll find two sets of instructions: one to run the service locally with docker-compose, the other to deploy on AWS with Kubernetes. 


### local set up

1. Install Docker Engine and Docker Compose
2. Obtain .csv data for questions, answers, and photos associated with any answers.
3. Fork and clone the repo. 
4. Update ports in .env if necessary. The project publishes 3001 and 5432 in the server and db containers to the same ports on the host machine
5. Run the data ETL process:
   - Update the `readpath` and `writepath` constants in `etl/streams.js`. `writepath` should point to the project's `csv` directory
   - From the project's root directory, execute `node etl/streams.js`
6. Build and push the server and database images from the root directory:
   - To build the server image, run `docker build -t <Docker ID>/api .` 
   - ​To build the db image, run `docker build -t <Docker ID>/db ./db` 
   - ​Push both to Docker Hub: `docker push <image name>`
7. Update docker-compose .yaml to associate `db` and `server` images with your Docker ID.
8. (optional) Update the mountpoint in the `volumes` field in docker-compose.yaml. As it is, the application persists data in a `pgdata` directory at the project's root level
9. Run the containers with `docker-compose --env-file .env up`. 
10. Seed the database:
   - `cd` into `csv`. Make sure the four variables under the comment `#AWS k8s` are suppressed. Run `./copy.sh`. The network transfer takes ~15 minutes on my machine with ~2.5GB of csvs. The script logs to the console upon starting and completing each copy. 
11. Use the API endpoints or test with `npm test`. The test suite is WIP but contains at least 2 tests which hit all four endpoints.

### k8s cloud deployment 

steps 1-9 taken from Shiraz Hazrat's tutorial https://www.youtube.com/watch?v=vpEDUmt_WKA

1. Provision 2 or more AWS EC2 instances (I used free tier t2.micro running Ubuntu 18.04). Designate one as the "Master" node , the other(s) "Worker". Make sure you add a security rule for SSH. 
2.  Open a terminal window for each instance. Connect to each instance with the ssh command. Specify the path and file name of the private key (.pem), the user name for your instance, and the public DNS name or IPv6 address. For more information, https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/AccessingInstancesLinux.html
3. On each ec2, install Docker: https://docs.docker.com/engine/install/ubuntu/
4. On each ec2, install Kubernetes: https://kubernetes.io/docs/setup/production-environment/tools/kubeadm/install-kubeadm/
5. On each ec2, enable the use of iptables: `echo "net.bridge.bridge-nf-call-iptables=1" | sudo tee -a /etc/sysctl.conf sudo sysctl -p`
6. On the Master server only, initialize the cluster: `sudo kubeadm init --pod-network-cidr=10.244.0.0/16`. This command relates to the cluter's internal network. For more information on networking in Kubernetes, visit https://kubernetes.io/docs/concepts/cluster-administration/networking/.
   - After this command finishes, copy the `kubeadm join` command provided. You'll need to run this on each Worker node to join the cluster in step 9.
7. On the Master server only, set up the Kubernetes configuration file for general usage
   - `mkdir -p $HOME/.kube` 
   - `sudo cp -i /etc/kubernetes/admin.conf $HOME/.kube/config` 
   - `sudo chown $(id -u):$(id -g) $HOME/.kube/config`
8. On the Master server only, apply a CNI plugin. I used flannel:
   - `kubectl apply -f https://raw.githubusercontent.com/coreos/flannel/master/Documentation/kube-flannel.yml`
9. On the Worker servers only, run the `kubeadm join` command copied in step 6.
10. On the Master server only, clone this repo. 
11. Create the db and server services: `kubectl apply -f server-service.yaml,db-service.yaml`
12. Determine which ports Kubernetes used to publish the services:
    - run `kubectl get svc`
    - take note of the mapped ports for db and server (should be in range 30000-32767, the second port after ':' in the `PORTS` column)
13. In .env, update PG_HOST to the Master node's public IPv4 address, and update PG_PORT and API_PORT to the ports noted in step 12.  
14. Create a ConfigMap from the .env file: 
    - From the root of the `questions and answers` directory, run `kubectl create configmap <configmap name, e.g. configuration> --from-env-file=.env` 
15. Create the workloads from manifest files:
    - to create server pods, run `kubectl apply -f server-deployment.yaml`
    - to create the db pod, run `kubectl apply -f db-deployment.yaml`
16. Test endpoints using the Master node's IPv4 and the port where Kubernetes exposed the server service (step 12)


### questions & answers api documentation

**List Questions:** `GET /qa/questions`
- Parameters: product_id (integer)

**List Answers:** `GET /qa/questions/:question_id/answers`
- Parameters: question_id (integer)
- Query Parameters: page (integer), count (integer)

**Post Answer**: `POST /qa/questions/:question_id/answers`
- Parameters: question_id (integer)
- Body Parameters: body (text), name (text), email (text), photos (text array)

**Post Question:** `POST /qa/questions`
- Body Parameters: body (text), name (text), email (text), product_id (integer)


*Future enhancements will expand the interface to allow reporting question and answers and marking them as helpful*