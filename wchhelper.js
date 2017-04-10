/*
 * Copyright IBM Corp. 2017
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the
 * specific language governing permissions and limitations under the License.
 */
"use strict";

const wchDeliveryContentEndpoint  = '/delivery/v1/content';
const wchAuthoringContentEndpoint = '/authoring/v1/content';
const wchDeliverySearchEndpoint   = '/delivery/v1/search';
const wchAuthoringSearchEndpoint  = '/authoring/v1/search';
const wchLoginEndpoint            = '/login/v1/basicauth';

class WchHelper {
    // Construct an instance of the sample WCH Helper code
    // @param options structure containing the base API URL and optional debug boolean parameter
    constructor(options) {
        this.baseTenantURL = options.url;
        this.debug = (options.debug ? options.debug: false);
    }

    // Get the specified content from the specified WCH API endpoint
    getContentById(contentId, endpoint) {
        let wch = this;
        return new Promise((resolve, reject) => {
			const req = new XMLHttpRequest();
			req.onload = resolve;
            req.withCredentials = true;
			req.onerror = function(err){ reject("Network Error");};
			req.open("GET", wch.baseTenantURL + endpoint + '/' + contentId);
			req.send();
		}).
        // extract the XHR from the event
		then(event => event.target).
		// extract the response body from the xhr request
		then(req => req.responseText).
		then(res => wch.debugLog(wch,res)).
		// parse the JSON
		then(JSON.parse);
    }

    // Get published (ready) content from the content delivery service
    getDeliveryContentById(contentId) {
        return this.getContentById(contentId, wchDeliveryContentEndpoint);
    }

    // Get specified content from the authoring content service
    getAuthoringContentById(contentId) {
        return this.getContentById(contentId, wchAuthoringContentEndpoint);
    }

    login(username, password) {
        return new Promise((resolve, reject) => {
            const req = new XMLHttpRequest();
            req.onload = resolve;
            req.onerror = reject;
            req.withCredentials = true;
            req.open("GET", this.baseTenantURL + wchLoginEndpoint);
            req.setRequestHeader("Authorization", "Basic " + btoa(username + ":" + password));
            req.send();
        }).
        // extract the XHR from the onload event
        then(event => event.target).
        // access the tenant id header - if we don't get one, something may have gone wrong even without error
        then(req => req.getResponseHeader("x-ibm-dx-tenant-id")).
        then(this.debugLog);
    }

    // Search via the specified endpoint, with the specified query params
    // @param queryParams - Encoded (by caller) query paramters to WCH search
    // Eg: q=*:*&fl=name,document,id,classification,type,status&fq=classification:content
    search(queryParams, endpoint) {
        let wch = this;
        return new Promise((resolve, reject) => {
            const req = new XMLHttpRequest();
            req.onload = resolve;
            req.withCredentials = true;
            req.onerror = function(err){ reject("Network Error");};
            req.open("GET", wch.baseTenantURL + endpoint + '?' + queryParams);
            req.send();
        }).
        // extract the XHR from the event
        then(event => event.target).
        // extract the response body from the xhr request
        then(req => req.responseText).
        then(res => wch.debugLog(wch,res)).
        // parse the JSON
        then(JSON.parse);
    }

    // Search via the delivery search endpoint, with the specified query params
    // @param queryParams - Encoded (by caller) query paramters to WCH search
    // Eg: q=*:*&fl=name,document,id,classification,type,status&fq=classification:content
    searchDelivery(queryParams) {
        return this.search(queryParams, wchDeliverySearchEndpoint);
    }

    // Search via the authoring search endpoint, with the specified query params
    // @param queryParams - Encoded (by caller) query paramters to WCH search
    // Eg: q=*:*&fl=name,document,id,classification,type,status&fq=classification:content
    searchAuthoring(queryParams) {
        return this.search(queryParams, wchAuthoringSearchEndpoint);
    }

    // Debug logging if enabled via optional second constructor arg
    // reference to this helper is passed in, since called from arrow function
    // within promise, which loses the original this binding
    debugLog(wch, val) {
        if (wch.debug)
            console.log("Debug: " + val);
        return val;
    }

}
