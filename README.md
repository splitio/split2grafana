# Send Audit Log Notifications to Grafana as Chart Annotations

This is a Split Audit Log webhook that abridges notifications into chart annotations for Grafana.  The annotations are tagged 'split' so that a Grafana user can put an annotation query on any dashboard to see Split notifications.

You can read about [Grafana Chart Annotations](https://grafana.com/docs/grafana/latest/developers/http_api/annotations/).

## Installation

The Split Audit Log webhook is a node.js lambda, designed to be deployed in AWS.

Clone the repository in an empty directory.  

Inside the directory created, copy your Grafana API key (carefully) into:

 - *GRAFANA_API_KEY* (I used admin)

An extra space at the end of the line, or empty lines after could spell disaster later.
The file must have precisely this name.

 - Edit index.js to include your Grafana host and port

Line four of the index.js:

```javascript
const GRAFANA_URL = 'http://<your grafana server host>:3000';
```

Change this to the proper host and port of your Grafana server (port 3000 is the default port).  The host must be accessible from AWS.

Now, from this same directory..

```
> npm install 
> zip -r grafana.zip *
```

You can "brew install npm" on OSX.  Follow the instructions to install npm for other operating systems.

The grafana.zip should include the index.js, the Grafana key file and a full node_modules directory.

A single node.js lambda does the work for the integration, using only the filesystem (for API keys) and the Axios HTTP client.  The integration receives audit log notifications, abridges them into new annotations, and calls the Grafana annotation API to create new annotations.

You must create an annotation query for tag 'split' on the dashboards for which you wish the Split annotations to appear.  See Grafana documentation for details about Dashboard settings. 

Install in AWS.  
 - Create a new "split2grafana" lambda for Nodes.js
 - Upload grafana.zip to the Code screen of your AWS lambda.  
 - Give the lambda a functional URL to POST to it.  Enable CORS and give the Allow Headers field a *  
 - Provide the function URL to a new Split Audit Log webhook.

Use the Split webhook test button to make sure you get back a 200 reponse from your lambda.

## Debug

Use CloudWatch to look at inbound events and check they're properly handled. Incorrect key or Grafana server host and port are likely problems. 

## Author

David.Martin@split.io
