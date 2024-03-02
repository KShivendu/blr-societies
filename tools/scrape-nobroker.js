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

function b64Encode(jsonData) {
    const str = JSON.stringify(jsonData);
    return Buffer.from(str).toString('base64');
}

// Code:
const baseUrl = `https://www.nobroker.in/api/v3/multi/property/RENT/filter/building/properties`;
const queryParams = {
    pageNo: 1,
    searchParam: b64Encode([
        {
            lat: 12.9699334403681,
            lon: 77.5981770328522,
            placeId: 'ChIJbU60yXAWrjsR4E9-UejD3_g', // No need to change
            placeName: 'Bangalore',
            showMap: false,
        }
    ]),
    sharedAccomodation: 0,
    radius: 2.0,
    buildingType: 'GC', // AP,
    city: 'bangalore',
};

const url = new URL(baseUrl);
url.search = new URLSearchParams(queryParams);

(async () => {
    // TODO: Pagination
    const societies = await fetch(url).then(res => res.json());

    for (const [index, society] of societies.data.entries()) {
        const societyUrl = `https://www.nobroker.in/` + society.buildingPageUrl;
        console.log(`(${index + 1}/${societies.data.length}) Scraping ${societyUrl}`);
        const htmlContent = await fetch(societyUrl).then(res => res.text()).catch(err => console.error(err));

        if (!htmlContent) {
            console.error(`Error fetching HTML for ${htmlContent}`);
            continue;
        }

        const regex = /nb\.appState = (\{.*?\})(\n|;)/s;
        const jsonData = parseVariable(htmlContent, regex);
        const rentProperties = jsonData.builderProjectReducer.builderOtherData.builderOtherInfo.rentProperties;

        console.log(`Found ${rentProperties.length} rentals`);
        for (const property of rentProperties) {
            console.log(`Rate: ${property.formattedPrice}; Area: ${property.propertySize} sqft; Link: ${property.shortUrl}`);
        }
        await new Promise(resolve => setTimeout(resolve, 500));
    }
})();
