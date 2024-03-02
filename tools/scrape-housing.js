// Utils:
function parseVariable(content, regex) {
    const match = content.match(regex);
    if (match && match[1]) {
        const jsonString = match[1];
        try {
            const jsonData = JSON.parse(jsonString);
            return jsonData;
        } catch (e) {
            console.error('Error parsing JSON string', e);
        }
    } else {
        console.log('No matching data found');
    }
}

// Code:
async function findSocitiesWithLetter(indexLetter) {
    // TODO: Paginate and convert into an iterator
    return await fetch(
        "https://mightyzeus.housing.com/api/gql/stale?apiName=FETCH_URL_LIST_API&emittedFrom=client_rent_URL_LIST&isBot=false&source=web", {
        "headers": {
            "accept": "*/*",
            "accept-language": "en-GB,en-US;q=0.9,en;q=0.8",
            "app-name": "desktop_web_buyer",
            "content-type": "application/json; charset=UTF-8",
            "phoenix-api-name": "FETCH_URL_LIST_API",
            "sec-ch-ua": "\"Not(A:Brand\";v=\"24\", \"Chromium\";v=\"122\"",
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": "\"Linux\"",
            "sec-fetch-dest": "empty",
            "sec-fetch-mode": "cors",
            "sec-fetch-site": "same-site"
        },
        "referrer": `https://housing.com/rent/projects-bangalore/all-societies-${indexLetter}`,
        "referrerPolicy": "no-referrer-when-downgrade",
        "body": `{"query":"  query(    $pageInfo: PageInfoInput    $type: String    $service: String    $category: String    $city: CityInput    $hash: String    $slug: String    $buy: Boolean!    $rent: Boolean!    $pg: Boolean!  ) {    urlList(      type: $type      pageInfo: $pageInfo      service: $service      category: $category      city: $city      hash: $hash      slug: $slug    ) {      list {        rent @include(if: $rent)        buy @include(if: $buy)        pg @include(if: $pg)        label      }      pageInfo {        hasMorePages        size        page      }    }  }\",\"variables\":\"{\\\"pageInfo\\\":{\\\"page\\\":1,\\\"size\\\":95},\\\"type\\\":\\\"projects\\\",\\\"service\\\":\\\"rent\\\",\\\"category\\\":\\\"residential\\\",\\\"city\\\":{\\\"name\\\":\\\"Bengaluru\\\",\\\"id\\\":\\\"d94a0854185332e78d1b\\\",\\\"cityId\\\":\\\"747be13fe47cb8ae14c3\\\",\\\"url\\\":\\\"bangalore\\\",\\\"products\\\":[\\\"buy\\\",\\\"plots\\\",\\\"rent\\\",\\\"paying_guest\\\",\\\"commercial\\\",\\\"flatmate\\\"]},\\\"slug\\\":\\\"${indexLetter}\\\",\\\"rent\\\":true,\\\"buy\\\":false,\\\"pg\\\":false}\"}`,
        "method": "POST",
        "mode": "cors",
        "credentials": "include"
    }).then(res => res.json());
};

(async () => {
    const indexLetter = `z`;
    const result = await findSocitiesWithLetter(indexLetter);

    for (const { rent: societyPath } of result.data.urlList.list) {
        const societyUrl = 'https://housing.com' + societyPath;
        console.log(`Scraping ${societyUrl}`);
        const htmlContent = await fetch(societyUrl).then(res => res.text()).catch(err => console.error(err));

        if (!htmlContent) {
            console.error(`Error fetching HTML for ${societyUrl}`);
            continue;
        }

        const regex = /window\.__INITIAL_STATE__=JSON\.parse\((\"\{.*?\}\")\);/s;
        // Note: parseVariable is only able to extract the JSON and unescape quotes here
        // So we need another JSON.parse to convert into JS object.
        const jsonData = JSON.parse(parseVariable(htmlContent, regex));

        for (const [_, listing] of Object.entries(jsonData.searchResults.data)) {
            console.log(`Price: ${listing.displayPrice.displayValue}; URL: ${listing.url}`)
        }
    }

})();
