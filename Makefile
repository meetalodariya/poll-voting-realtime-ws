## up: starts all main services containers in the background without forcing build
up:
	@echo "Starting Docker images..."
	docker-compose up api client mongo -d
	open http://localhost:8080
	@echo "Docker images started!"

## up_build: stops docker-compose (if running), builds all projects and starts docker compose
up_build:
	@echo "Stopping docker images (if running...)"
	docker-compose down
	@echo "Building (when required) and starting docker images..."
	docker-compose up api client mongo --build -d
	open http://localhost:8080
	@echo "Docker images built and started!"

## up_mongo_admin: starts up mongo admin dashboard
up_mongo_admin: 
	@echo "Building (when required) and starting docker images..."
	docker-compose up mongo-express -d
	open http://localhost:8081

## down: stop docker compose
down:
	@echo "Stopping docker compose..."
	docker-compose down
	@echo "Done!"

## run_e2e: runs end-to-end test cases (cypress)
run_e2e: 
	@echo "Running end-to-end tests..."
	docker-compose up client --no-deps -d
	cd ./client && ./e2e.sh 

## open_e2e_suite: opens up cypress gui to run end-to-end test cases (cypress)
open_e2e_suite: 
	@echo "Open end-to-end tests suite..."
	docker-compose up client --no-deps -d
	cd ./client && ./e2e.sh -o
