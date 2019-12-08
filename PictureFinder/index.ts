import { AzureFunction, Context, HttpRequest } from "@azure/functions";
require('es6-promise').polyfill();
require('isomorphic-fetch');
import Unsplash, { toJson } from 'unsplash-js';


const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
    let imageSearch = req.query.imageSearch;

    const key_var = 'APP_ACCESS_KEY';
    if (!process.env[key_var]) {
        throw new Error('please set/export the following environment variable: ' + key_var);
    }
    const access_key = process.env[key_var];

    if (imageSearch) {
        let returnJSON = await findPhoto(access_key, imageSearch);
        context.res = {
            body: returnJSON
        };
    }
    else {
        context.res = {
            status: 400,
            body: "Please pass an phrase to search in the imageSearch query string"
        };
    }
};

async function findPhoto(accesskey: string, imageToFind: string): Promise<string> {
    let unsplashreq = new Unsplash({ accessKey: accesskey });
    let unsplashResults = await unsplashreq.search.photos(imageToFind, 1, 10, { orientation: "portrait" });
    let resultsJSON = await toJson(unsplashResults);

    let pageLength:number = resultsJSON.results.length;
    let dNumber:number = Math.floor(Math.random() * pageLength) + 1;
    let pictureUrl: string = resultsJSON.results[dNumber].urls.regular;

    return pictureUrl;
}

export default httpTrigger;
