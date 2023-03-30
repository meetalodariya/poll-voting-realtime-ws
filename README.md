<p align="center">
  <img src="./poll-voting.png" width="100" alt="poll voting">
</p>

#  Poll Voting App

## Description

Real-time poll voting app where user can create, view and vote on the polls. It also provides live updates on polls as they're updated (added/voted) using web sockets. 

---

## Getting started 

1. First step is to make sure that system has docker installed and running. 

    ```
    docker info
    ```
2. Run below command to build and start the app containers from root dir. 
   
   ```
    make up
    ```
3. Once all the container are up and running, open [http://localhost:8080](http://localhost:8080) in browser.

- To remove/shutdown the containers:

    ```
    make down
    ```

- For MongoDB admin UI, starts at port [8081](http://localhost:8081):

    ```
    make up_mongo_admin
    ```

- To run end-to-end test cases:

    ```
    make run_e2e
    ```    

- To open cypress suite:

    ```
    make open_e2e_suite
    ```   

---

## Highlights ✨

- Entirely written in TypeScript.
- Live data updates using web sockets.
- End-to-end testing using cypress.
- Container orchestration with docker-compose.
- Optimized client build for production.
