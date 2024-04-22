# Camunda 8 Redis Connector Job Worker Runtime for Node.js

This is a job worker runtime for Node.js Redis Connector for Camunda 8. 

The connector is built on top of the Camunda 8 Connector SDK for Node.js.

To run your connectors using this runtime you have below option: 

* Mounting your connector(s) into a Docker image

## Component Design

The docker image consists of two parts, as shown in the design diagram.

This current code base refers to part #a. That is, runtime wrapper that handles interaction with Zeebe, registration and associated handshake.

The second part (#b core logic of the Redis Connector) is present here. https://github.com/rchari-ml/redis-connector-nodejs

![alt text](image.png)

## References

Camunda 8 Connector SDK for Node.js

https://github.com/camunda-community-hub/connector-sdk-nodejs


## Mount your connectors into a Docker image

You can use a Docker image of the Connector Runtime to run your connectors. 

- A directory for the connectors is created, and initialised `package.json`. Run the command `npm install` to install Redis Connector Node.js:

```bash
cd $base
cd __connectors__
npm install
```

- Now, the Connectors shall be mounted under folder `/opt/connectors`. 
- The Connector Runtime wrapper classes are defined in the `src/lib` folder. Run the command to prepare the wrapper as Docker container:


```bash
cd $base

docker build --tag makelabs/c8-connector-worker-runtime-nodejs:latest .
```

- The file `docker-compose.yml` in the project defines the runtime composition of the service. Note that we added `REDIS_SECRET` as environment variable.

```yml
version: '2'

services:
  runtime:
    volumes:
    - ./__connectors__:/opt/connectors
    image: makelabs/c8-connector-worker-runtime-nodejs:latest
    environment:
      - LOG_LEVEL=INFO
      - ZEEBE_ADDRESS
      - ZEEBE_CLIENT_ID
      - ZEEBE_CLIENT_SECRET
      - ZEEBE_AUTHORIZATION_SERVER_URL
      - REDIS_SECRET
```

- Put your Camunda 8 API credentials (REDIS_SECRET) in a file `.env` in the project.

- Run the Docker container with the following command:

```bash
docker compose --env-file .env up
```

# Contact for Support
If you need any assistance, we are just an email away - contact@makelabs.in
