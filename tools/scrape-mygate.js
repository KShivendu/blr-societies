const fs = require('fs');

// Get from env
const myGateUserId = process.env.MYGATE_USER_ID;
const myGateAccessKey = process.env.MYGATE_ACCESS_KEY;

async function searchProperties() {
    const url = 'https://classifieds-be.mygate.com/graphql';
    const options = {
        method: 'POST',
        headers: {
            'content-type': 'application/json',
            'user-id': myGateUserId,
            'sec-ch-ua': '"Chromium";v="122", "Not(A:Brand";v="24", "Android WebView";v="122"',
            'sec-ch-ua-mobile': '?1',
            'user-agent': 'Mozilla/5.0 (Linux; Android 14; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/122.0.6261.64 Mobile Safari/537.36',
            accept: '*/*',
            'access-key': myGateAccessKey,
            'sec-ch-ua-platform': '"Android"',
            origin: 'https://classifieds.mygate.com',
            'x-requested-with': 'com.mygate.user',
            'sec-fetch-site': 'same-site',
            'sec-fetch-mode': 'cors',
            'sec-fetch-dest': 'empty',
            referer: 'https://classifieds.mygate.com/',
            'accept-language': 'en-IN,en-US;q=0.9,en;q=0.8'
        },
        body: JSON.stringify({
            "operationName": "homesSearchFilter",
            "variables": {
                "dynamicFilters": [
                    {
                        "fieldName": "categoryName",
                        "fieldValue": [
                            "Rent"
                        ]
                    },
                    {
                        "fieldName": "cityId",
                        "fieldValue": 613
                    },
                    {
                        "fieldName": "locations",
                        "fieldValue": [
                            {
                                "lat": 12.8452145,
                                "lng": 77.6601695,
                                "formattedAddress": "Electronic City"
                            }
                        ]
                    }
                ],
                "sortBy": [],
                "limit": 150, // Limited to 150 from server
                "page": 1 // Change this
            },
            "query": `query homesSearchFilter($dynamicFilters: [filters], $sortBy: [sortByInput], $page: Int, $limit: Int) {\n  homesSearchFilter(dynamicFilters: $dynamicFilters, sortBy: $sortBy, page: $page, limit: $limit) {\n    data {\n      postType\n      city\n      id\n      userId\n      categoryId\n      flatType\n      hasBookmarked\n      locality\n      title\n      subtitle\n      area {\n        value\n        unit\n      }\n      rent\n      maintenanceCost\n      furnishingStatus\n      tags {\n        id\n        name\n        type\n        colour\n        icon\n      }\n      image {\n        url\n        largeUrl\n      }\n      amount {\n        value\n        unit\n      }\n      location {\n        lat\n        lng\n      }\n      gallery {\n        url\n        largeUrl\n      }\n      searchDistance {\n        location {\n          lat\n          lng\n        }\n        distance\n      }\n    }\n    total\n    searchId\n  }\n}\n`
        })
    };

    try {
        // TODO: Paginate
        const response = (await fetch(url, options).then(res => res.json())).data.homesSearchFilter;
        console.log(`${response.total} matching results`);
        return response;
    } catch (error) {
        console.error(error);
    }
}

async function getPropertyListing(listingId) {
    // Usage:
    // const listingDetail = await getPropertyListing(property.id);
    // console.log(`Listing was created at ${listingDetail.postDetails.createdAt}`)

    // TODO: See if this function can be eliminated by extending query in `searchProperties`

    const url = 'https://classifieds-be.mygate.com/graphql';
    const options = {
        method: 'POST',
        headers: {
            'content-type': 'application/json',
            'user-id': myGateUserId,
            'sec-ch-ua': '"Chromium";v="122", "Not(A:Brand";v="24", "Android WebView";v="122"',
            'sec-ch-ua-mobile': '?1',
            'user-agent': 'Mozilla/5.0 (Linux; Android 14; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/122.0.6261.64 Mobile Safari/537.36',
            accept: '*/*',
            'access-key': myGateAccessKey,
            'sec-ch-ua-platform': '"Android"',
            origin: 'https://classifieds.mygate.com',
            'x-requested-with': 'com.mygate.user',
            'sec-fetch-site': 'same-site',
            'sec-fetch-mode': 'cors',
            'sec-fetch-dest': 'empty',
            referer: 'https://classifieds.mygate.com/',
            'accept-language': 'en-IN,en-US;q=0.9,en;q=0.8'
        },
        body: JSON.stringify({
            "operationName": "GetPropertyListing",
            "variables": {
                "postId": listingId
            },
            "query": `query GetPropertyListing($postId: String!) {\n  propertyListing(postId: $postId) {\n    postDetails {\n      brokerPlan {\n        status\n        updatedAt\n      }\n      floorNumber\n      totalFloorNumber\n      id\n      categoryName\n      contactNumber\n      userId\n      status\n      categoryId\n      categoryName\n      title\n      subtitle\n      flatType\n      maintenanceCost\n      maintenanceIncluded\n      moveInDate\n      hasBookmarked\n      isPostOwner\n      hasRequestedImages\n      rooms {\n        bathrooms\n        balcony\n        poojaRooms\n        studyRooms\n        servantRooms\n        storeRooms\n      }\n      parking {\n        closed\n        open\n      }\n      furnishingDetails {\n        beds\n        cupboards\n        modularKitchen\n        fridge\n        couchSofa\n        airConditioner\n        tv\n        washingMachine\n        oven\n        table\n        chair\n        waterPurifier\n      }\n      preferredTimeToContact {\n        day\n        time\n      }\n      city\n      platformListingInfo {\n        listingUrl\n        slug\n        icon\n      }\n      gallery {\n        url\n        largeUrl\n      }\n      rent\n      deposit\n      amount {\n        value\n        unit\n      }\n      area {\n        value\n        unit\n      }\n      furnishingStatus\n      createdAt\n      updatedAt\n      tags {\n        name\n        colour\n        icon\n      }\n      postType\n    }\n    societyDetails {\n      city\n      id\n      societyName\n      tags {\n        name\n      }\n      amenities {\n        name\n        icon\n        id\n      }\n      gallery {\n        url\n        largeUrl\n      }\n      location {\n        lat\n        lng\n        formattedAddress\n      }\n      areaName\n      societyName\n      nearbyPlaces {\n        type\n        typeName\n        entities {\n          name\n          location {\n            lat\n            lng\n            formattedAddress\n          }\n          address\n          distance {\n            value\n            unit\n          }\n        }\n      }\n    }\n    userDetails {\n      name\n      type\n    }\n  }\n}\n`
        })
    };

    try {
        const response = await fetch(url, options);
        const data = (await response.json()).data.propertyListing;
        return data;
    } catch (error) {
        console.error(error);
    }
}

(async () => {
    const results = await searchProperties();

    if (!fs.existsSync('data')) {
        fs.mkdirSync('data');
    }
    fs.writeFileSync('data/mygate.csv', 'title, locality, rent, url\n');

    for (const property of results.data) {
        const url = `https://classifieds.mygate.com/listing/${property.id}`;
        // const androidDeepLink = `https://mygate.in/dl/homes?homes_url=https://classifieds.mygate.com/post/${property.id}`;
        console.log(`Found ${property.title} in ${property.locality} for ${property.rent}; ${url}`);

        fs.appendFileSync('data/mygate.csv', `${property.title}, ${property.locality}, ${property.rent}, ${url}\n`);
    }
})();
