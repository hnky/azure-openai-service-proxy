# Azure OpenAI Proxy

The Azure OpenAI Proxy is a simple API that allows you to use the OpenAI API without having to expose your API key to the client. It is designed to be deployed to Azure Container Apps, which provides a managed environment for running containerized apps without having to manage the underlying infrastructure. The target use case is for hackathons and other time-bound events where you want to provide access to the OpenAI API without having to worry about exposing your API key.

The solution consists of two parts, a REST API, and a web client with a similar look and feel to the official Azure OpenAI Playground. The REST API is a simple Python FastAPI app that proxies requests to the OpenAI API. The web client is a simple React app that allows you to test the API.

## Setup

This repo is set up for deployment on Azure Container Apps using the configuration files in the `infra` folder.

### Prerequisites

1. An Azure subscription
2. Deployed Azure OpenAI Models

### OpenAI Deployments

Before you can deploy the REST API you need to have deployed the OpenAI models you want to use. Once deployed, you need to create a deployment configuration string. You can declare multiple OpenAI deployments and they are used to load balance OpenAI Chat requests using a simple [round robin](https://en.wikipedia.org/wiki/Round-robin_scheduling) schedule. It's important to ensure there are no spaces in the configuration string as it will cause the deployment to fail. The deployment configuration string format is a JSON array of objects formated as follows:


```text
[{"endpoint_location":"<Your Azure OpenAI resource location/region>","endpoint_key":"<Your Azure OpenAI resource location/region>","deployment_name","<Your OpenAI model deploymentname>"}]
```

#### Tips

1. When deploying with a different capacity, you can use the same deployment name multiple times, and the REST API will automatically load balance across the different capacity deployments. For example, you have one OpenAI deployment with a capacity of 600K requests per minute, and another deployment of 300. Add the 600K deployment to the configuration string twice so it will be called twice as often as the smaller deployment.
2. Keep the deployment connection string in a safe place as it contains your OpenAI deployment keys.
3. You can also update the pool of OpenAI deployments by updating the `OPENAI_DEPLOYMENT_CONFIG` environment variable in the Azure Container App using the `az containerapp update` command. For example:

```shell
az containerapp update -n YOUR_CONTAINER_APP_NAME -g YOUR_RESOURCE_GROUP  --subscription YOUR_SUBSCRIPTION_ID --set-env-vars AZURE_OPENAI_DEPLOYMENTS='YOUR_OPENAI_DEPLOYMENT_CONFIGURATION_JSON_STRING'
```

### Deploying

Steps for deployment:

The recommeded way to deploy this app is with Dev Containers. Install the [VS Code Remote Containers extension](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers) and Docker, open this repository in a container and you'll be ready to go.


1. Clone the repo:

    ```shell
    git clone https://github.com/gloveboxes/azure-openai-service-proxy.git
    ```

1. Using VS Code, open the `azure-openai-service-proxy/src/endpoint/simple-fastapi-container` folder:

1. You will be prompted to `Reopen in Container`, click the button to do so.

1. Login to Azure:

    ```shell
    azd auth login
    ```

1. Provision and deploy all the resources:

    ```shell
    azd up
    ```
    It will prompt you to provide an `azd` environment name (like "fastapi-app"), select a subscription from your Azure account, and select a location (like "eastus"). Then it will provision the resources in your account and deploy the latest code. If you get an error with deployment, changing the location can help, as there may be availability constraints for some of the resources.

1. When `azd` has finished deploying, you'll see the REST endpoint docs URI in the command output. Visit that URI, and you should see the REST API docs! 🎉
1. If make any changes to the app code, just run:

    ```shell
    azd deploy
    ```

## Time bound event authorisation

Access to the REST endpoint is controller by an event code. The REST endpont is accessible when the current UTC time is between the StartUTC and the EndUTC times and the event is active. The event code is passed in the `openai-event-code` header. If the event code is not passed, or the event is not active, or the current UTC time is not between the StartUTC and the EndUTC times, the REST endpoint will return a `401` unauthorized error.

Event details are stored in an Azure Storage account table named `playgroundauthorization`. This table is created when the app is deployed and starts. The table has the following schema:

| Property     | Type     | Description                                 |
| ------------ | -------- | ------------------------------------------- |
| PartitionKey | string   | Must be 'playground'                        |
| RowKey       | string   | The event code between 6 and 20 characters long. For example: myevent2022. </br></br>Note, you can't use the following characters in the event name: 'The forward slash (/), backslash (\\), number sign (#), and question mark (?) characters' as they aren't allowed for an Azure Storage Table RowKey property. |
| Active       | boolean  | Is the event active, true or false          |
| MaxTokenCap  | int      | The maximum number of tokens per request. This overides the user set Max Token value for load balancing    |
| StartUTC     | datetime | The start date and time of the event in UTC |
| EndUTC       | datetime | The end date and time of the event in UTC   |
| EventName    | string   | The name of the event                       |
| ContactName  | string   | The name of the event contact               |
| ContactEmail | string   | The email address of the event contact      |

### Adding an event

For now, you add an event via the Azure Storage Account `Storage browser`. The `Storage browser` is available in the Azure Portal, under the `Storage account` resource.

1. Select the Azure Storage Account resource, then select `Storage explorer (preview)` from the left-hand menu, then select `Tables` from the left-hand menu, and finally select the `playgroundauthorization` table. Add an entry using the above schema, noting that the `PartitionKey` must be `playground` and the column names are case sensitive, and you must enter dates in [ISO 8601](https://en.wikipedia.org/wiki/ISO_8601) format in UTC. The [worldtimebuddy](https://www.worldtimebuddy.com) is a great time resource to convert your local time to UTC.

Here is an example

```text
PartitionKey: playground
RowKey: myevent2022
Active: true
MaxTokenCap: 1024
StartUTC: 2023-10-01T00:00:00Z
EndUTC: 2023-10-02T00:00:00Z
EventName: My Event 2023
ContactName: John Smith
ContactEmail: jsmith@example.com
```

### Event Code Cache

Event data, namely the `EventCode`, `StartUTC`, `EndUTC`, and `MaxTokenCap` are cached in the REST API. The cache is refreshed every 10 minutes. This is to reduce the number of calls to the Azure Storage Account table. The implication of this is that if you update the event details in the Azure Storage Account table, it may take up to 10 minutes for the changes to be reflected in the REST API.

The solution auto scales using Azure Container Apps replicas. This means that containers will come online to support the load, and then scale down when the load decreases over time. The cache is not shared between the containers, so if you have multiple containers, the cache will be refreshed for each container. This means that if you update the event details in the Azure Storage Account table, it may take up to 10 minutes for the changes to be reflected in each container and in the interim, some containers may be serving requests for the old event details.

## Scaling the REST API

The REST API is stateless, so it can be scaled horizontally. The REST API is designed to auto scale up and down using Azure Container Apps replicas. The REST API is configured to scale up to 20 replicas. The number of replicas can be changed from the Azure Portal or from the az cli. For example, to scale to 30 replicas using the az cli, change the:

```shell
az containerapp update -n $APP_NAME -g $RESOURCE_GROUP --subscription $SUBSCRIPTION_ID --replica 30
```

## Understanding OpenAI Rate Limits and the MaxTokenCap

Azure OpenAI model deployments have two limits, the first being tokens per minute, the second being requests per minute. You are most likely to hit the Tokens per minute limit espically as you scale up the number of users using the system.

Tokens per minute is the total number of tokens you can generate per minute. The number of tokens per call to OpenAI Chat API is the sum of the Max Token parameter, plus the tokens that make up your msg (system, assistant, and user), plus best_of parameter setting.

For example, you have a model deployment rated at 500K tokens per minute.

![](docs/media/rate_limits.png)

If users set the Max Token parameter to 2048, with a message of 200 tokens, and you had 100 concurrent users sending on average 6 mesages per minute then the total number of tokens per minute would be (2048 + 200) * 6 * 100) = 1348800 tokens per minute. This is well over the 500K tokens per minute limit of the Azure OpenAI model deployment and the system would be rate limited and the user experience would be poor.

This is where the MaxTokenCap is useful for an event. The MaxTokenCap is the maximum number of tokens per request. This overides the user Max Token request for load balancing. For example, if you set the MaxTokenCap to 512, then the total number of tokens per minute would be (512 + 200) * 6 * 100) = 427200 tokens per minute. This is well under the 500K tokens per minute limit of the Azure OpenAI model deployment and will result in a better experience for everyone as it minimises the chance of hitting the rate limit across the system.

MaxTokenCap is set at the event level, and is configured in the Azure Storage Account table named `playgroundauthorization`. See the section above on [adding an event](#adding-an-event) for more details.

### Testing the REST API endpoint

There are various options to test the endpoint. The simpliest is to use Curl from either PowerShell or a Bash/zsh terminal. For example:

From PowerShell 7 and above on Windows, macOS, and Linux:

```pwsh
curl -X 'POST' `
  'https://YOUR_REST_ENDPOINT/api/oai_prompt' `
  -H 'accept: application/json' `
  -H 'Content-Type: application/json' `
  -H 'openai-event-code: YOUREVENTCODE' `
  -d '{
  "messages": [
    {"role": "system", "content":"What is this about"},
    {"role": "user", "content":"The quick brown fox jumps over the lazy dog"}
  ],
  "max_tokens": 1024,
  "temperature": 0,
  "top_p": 0,
  "stop_sequence": "string",
  "frequency_penalty": 0,
  "presence_penalty": 0
}'  | ConvertFrom-Json | ConvertTo-Json
```

From Bash/zsh on macOS, Linux, and Windows WSL:

```bash
curl -X 'POST' \
  'https://YOUR_REST_ENDPOINT/api/oai_prompt' \
  -H 'accept: application/json' \
  -H 'Content-Type: application/json' \
  -H 'openai-event-code: YOUREVENTCODE' \
  -d '{
  "messages": [
    {"role": "system", "content":"What is this about"},
    {"role": "user", "content":"The quick brown fox jumps over the lazy dog"}
  ],
  "max_tokens": 1024,
  "temperature": 0,
  "top_p": 0,
  "stop_sequence": "string",
  "frequency_penalty": 0,
  "presence_penalty": 0
}'
```

Better still, pip or brew install `jq` to pretty print the JSON response.

```bash
curl -X 'POST' \
  'https://YOUR_REST_ENDPOINT/api/oai_prompt' \
  -H 'accept: application/json' \
  -H 'Content-Type: application/json' \
  -H 'openai-event-code: YOUREVENTCODE' \
  -d '{
  "messages": [
    {"role": "system", "content":"What is this about"},
    {"role": "user", "content":"The quick brown fox jumps over the lazy dog"}
  ],
  "max_tokens": 1024,
  "temperature": 0,
  "top_p": 0,
  "stop_sequence": "string",
  "frequency_penalty": 0,
  "presence_penalty": 0
}' | jq "."
```

## Load testing

There are a number of load testing tools available. The recommended tool is JMeter as the test plan can be deployed to Azure. The JMeter test plan is located in the `loadtest` folder. The test plan is configured to run 100 concurrent users, generating 4 requests per minute.

1. You'll need to update the URL in the `HTTP Request Defaults` element to point to your REST API endpoint.

    ![update url](./docs/media/jmeter_requests.png)

2. You'll need to update the `HTTP Header Manager` element to include your event code.

    ![update event code](./docs/media/jmeter-request-header.png)

### Example load test

![](./docs/media/example_perf_jmeter.png)
