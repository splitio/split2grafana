const axios = require('axios');
const fs = require('fs');

exports.handler = async (event) => {
    const startTimeInMillis = new Date().getTime();
    console.log(event);
    const body = JSON.parse(event.body);
    console.log(body);

    const time = body.time;
    const description = body.description;
    const link = body.link;
    console.log('time: ' + time);
    console.log('description: ' + description);
    console.log('link: ' + link);

    const grafanaApiKey = fs.readFileSync('GRAFANA_API_KEY', 'utf8').trim();
    const grafanaUrl = fs.readFileSync('GRAFANA_URL', 'utf8').trim();

    const annotation = {
        // Use a Dashboard annotation query to bring in 'split' tagged annotations
        // dashboardUID: 'rarqupc4k',
        // panelId: 0,
        time: time,
        tags: ["split"],
        text: description + ' - <a href="' + link + '">Go to Split</a>'
    }

    console.log(annotation);
    await axios.post(grafanaUrl + '/api/annotations', annotation, { headers: {'Authorization': 'Bearer ' + grafanaApiKey }}) 
    .then(function (response) {
        console.log(response.status);
    })
    .catch(function (error) {
        console.log(error);
    })
    .finally(() => {
        let endTimeInMillis = new Date().getTime();
        console.log('finished events post in ' + (endTimeInMillis - startTimeInMillis));
    })

    // TODO implement
    const response = {
        statusCode: 200,
        body: JSON.stringify('sent Split notification to Grafana'),
    };
    return response;
};



