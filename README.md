# sample-js-helper
Sample Watson Content Hub JS helper providing simple instantiation and method calls against WCH APIs.

### Overview
Watson Content Hub provides a set of [REST based APIs](https://developer.ibm.com/api/view/id-618:title-IBM_Watson_Content_Hub_API#doc) that may be called from standard browser based xmlHttpRequest (xhr) support, or from your JS framework of choice.   The sample wchHelper.js provided here illustrates an example of one possible means of calling these APIs.  This sample helper is available to help get new WCH developers going quickly, but is not intended to imply that this is the only or even necessarily the best way to call such APIs.  You are free to choose the framework(s) and REST consumption mechanism that best suits your application requirements and developers' expertise.   The full set of public APIs is listed in the API explorer referred to above, while this sample helper currently provides only a subset of convenience methods to help you get started calling commonly used WCH APIs from modern browsers.


### Tenant Base URL for WCH API Calls
You must know your tenant base URL prior to trying this sample, as is the case with all of the Getting Started Tutorials and usage of the WCH APIs.   For more info on obtaining base API URL specific to your Watson Content Hub tenant, see the following Watson Content Hub API documentation https://developer.ibm.com/api/view/id-618:title-IBM_Watson_Content_Hub_API

The API URL is also available in the "Hub Information" dialog, under the User dropdown menu, in the Watson Content Hub authoring UI.

E.g.,
```
const wchTenantBaseAPIURL = https://{tenant-host}/api/{tenant-id}
```

### Watson Content Hub REST API URLs

The format of the WCH REST API URLs is:
  {WCH Tenant Base API URL}/{WCH API Endpoint}

where the endpoints are described in the [Watson Content Hub API documentation](https://developer.ibm.com/api/view/id-618:title-IBM_Watson_Content_Hub_API#doc),  such as "/delivery/v1/content/{content item id}" for accessing published content from the content delivery service or "/authoring/v1/content/{content item id}" for accessing content items directly from the authoring service.   Delivery APIs are available to anonymous, unauthenticated callers, where authoring APIs require authenticating (logging in) to Watson Content Hub via the "/login/v1/basicauth" endpoint first.

### Retrieving a published content item by id

Once you know the id of a specific content item that you want to retrieve, calling the content delivery service to retrieve the JSON for that content item is as straightforward as making a call to:

  {wchTenantBaseUrl}/delivery/v1/content/{id}

### Sample WCH API helper

The sample WCH API helper provided here illustrates the above use cases in a straightforward minimalist manner.  For production applications, you would include support for all endpoints required by the application, use the JS framework of choice for your development organization and applications, and provide additional error handling based on the framework chosen.

ownload the sample wchhelper.js to your local web application project (eg, as js/wchhelper.js ) and load it with

`<script src="js/wchhelper.js">`

The sample WCH helper API provides a simple wrapper allowing you to construct an instance of the helper for a specific tenant base URL and then makes the REST API calls for you, handling the xhr request and JSON parsing of the response for you.  This is just a sample to get you started,  after which you are free to use the JS framework of your choice to build out your applications calling these same REST APIs.

### Example use of the sample WCH API JS helper

The JS in the sample WCH API helper can be used for simple retrieval of a known published content item by id, and then displaying the JSON in the browser, as shown below.

Construct an instance of the sample helper with the tenant specific base API URL like this:

    options = {
        url: "https://my11.digitalexperience.ibm.com/api/00000000-1111-2222-3333-444444444444",
        debug: true
    };
    wchHelper = new WchHelper(options);

Then use the helper make a call to retrieve and display the JSON response for a content item like this:

    // Content id of the content item to retrieve. The following id is part of the sample-article-content package.
    contentId = 'b7abe31d-7763-41a9-b8d5-f7cf78565cbd';
    wchHelper.getDeliveryContentById(contentId)
        .then(content => { alert("Delivery Content response: " + JSON.stringify(content, null, ' ')) })
        .catch(err =>    { alert("getDeliveryContentById encountered an error: " + err); });

### Logging in and retrieving authoring content by id

Before calling an authoring API, you must first login to Watson Content Hub using the "/login/v1/basicauth" REST API and then call the individual authoring APIs.  Authoring APIs require that you are authenticated as a user with an Editor role or higher (Manager or Admin) and will not work with users associated with the Viewer role.

For example:

Construct the sample helper with the tenant specific base URL in the same way as the above sample, like this:

    options = {
        url: "https://my11.digitalexperience.ibm.com/api/00000000-1111-2222-3333-444444444444",
        debug: true
    };
    wchHelper = new WchHelper(options);

Then make a call to login, passing the username and password of the WCH user. On successful login, it then makes a call to retrieve and display the JSON response for an authoring content item like this:

    contentId = 'b7abe31d-7763-41a9-b8d5-f7cf78565cbd';
    wchHelper.login('myWCHuser@mydomain.com', 'myPassword')
        .then(tenantId => wchHelper.getAuthoringContentById(contentId))
        .then(acontent => { alert("Authoring Content response: " + JSON.stringify(acontent, null, ' ')) })
        .catch(err =>     { alert("getAuthoringContentById encountered an error: " + err); });


### Searching for published (ready) content items from the unauthenticated delivery search service

    // Simple all-content query, returning name, document, id, classification, type and status fields
    let queryParams="q=*:*&fl=name,document,id,classification,type,status&fq=classification:content";

    // Search the delivery system (published ready content and assets) with the above specified query params
    // This simple sample helper method assumes that the caller has encoded any search query parameters
    wchHelper.searchDelivery(queryParams)
        .then(response => { confirm("Delivery Search response: " + JSON.stringify(response, null, ' ')) })
        .catch(err =>     { confirm("searchDelivery encountered an error: " + err); });

### Searching for content items from the authenticated authoring search service

    // Search the authoring services with the above specified query params
    // This simple sample helper method assumes that the caller has encoded any search query parameters
    wchHelper.login(username, password)
        .then(tenantId => wchHelper.searchAuthoring(queryParams))
        .then(response => { confirm("Authoring Search response: " + JSON.stringify(response, null, ' ')) })
        .catch(err =>     { confirm("searchAuthoring encountered an error: " + err); });
