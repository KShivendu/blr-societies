pub mod schema;

use crate::{
    error::ScraperError,
    scrapers::nobroker::schema::{Property, Society, SocietyListResponse},
};
use base64::prelude::*;
use reqwest::Client;
use serde_json::Value;
use serde_path_to_error::deserialize;

// ToDo: Pagination support and return iterator for parallel scraping?
// ToDo: Try to have targeted scraping for more interesting areas
pub async fn fetch_societies() -> Result<Vec<Society>, ScraperError> {
    let client = Client::new();

    let base_url = "https://www.nobroker.in/api/v3/multi/property/RENT/filter/building/properties";

    let search_data = serde_json::json!([{
        "lat": 12.9699334403681,
        "lon": 77.5981770328522,
        "placeId": "ChIJbU60yXAWrjsR4E9-UejD3_g",
        "placeName": "Bangalore",
        "showMap": false
    }]);
    let search_param = BASE64_STANDARD.encode(search_data.to_string());

    let res = client
        .get(base_url)
        .query(&[
            ("pageNo", "1"),
            ("searchParam", &search_param),
            ("sharedAccomodation", "0"),
            ("radius", "2.0"),
            ("buildingType", "GC"),
            ("city", "bangalore"),
        ])
        .send()
        .await?;

    let text = res.text().await?;
    // dbg!(&text);
    let res: SocietyListResponse = serde_json::from_str(&text)?;

    Ok(res.data)
}

fn parse_society_html(content: &str) -> Result<Vec<Property>, ScraperError> {
    // const regex = /nb\.appState = (\{.*?\})(\n|;)/s;
    let regex = regex::Regex::new(r"nb\.appState\s*=\s*(\{.*?\})(\n|;)")?;
    if let Some(captures) = regex.captures(content) {
        if let Some(json_match) = captures.get(1) {
            let json_string = json_match.as_str();
            let nb_app_state = serde_json::from_str::<Value>(json_string)?;

            // nb_app_state.builderProjectReducer.builderOtherData.builderOtherInfo.rentProperties
            let properties = nb_app_state
                .get("builderProject")
                .and_then(|v| v.get("builderOtherData"))
                .and_then(|v| v.get("builderOtherInfo"))
                .and_then(|v| v.get("rentProperties"))
                .and_then(|v| v.as_array())
                .ok_or(ScraperError::Unexpected(
                    "Could not find rentProperties in nb.appState".to_string(),
                ))?;

            let mut results = vec![];
            for property in properties {
                // Deserialize each property
                let property_str = property.to_string();
                let jd = &mut serde_json::Deserializer::from_str(&property_str);
                let property: Result<Property, _> = serde_path_to_error::deserialize(jd);
                match property {
                    Ok(p) => {
                        results.push(p);
                    }
                    Err(e) => {
                        println!("Error parsing property: {}", e);
                        continue; // Skip this property if there's an error so it can be improved later
                    }
                }
            }

            return Ok(results);
        }
    }

    Ok(vec![])
}

pub async fn scrape_society(society_url: &str) -> Result<Vec<Property>, ScraperError> {
    let client = Client::new();
    let res = client.get(society_url).send().await?;
    // FIXME: Need to take out stuff from nb.appData instead
    let text = res.text().await?;
    // dbg!(text.len());
    let society: Vec<Property> = parse_society_html(&text)?;
    Ok(society)
}

pub async fn scrape_nobroker() -> Result<Vec<(Society, Vec<Property>)>, ScraperError> {
    let mut result = vec![];
    let societies = fetch_societies().await?.into_iter().take(2); // Only take first 2 for testing
    for society in societies {
        let society_url = society.get_url();
        println!("Scraping society: {}", society_url);
        let properties = scrape_society(&society_url).await?;
        println!("{} rentals in {} society", properties.len(), society.building_name);
        result.push((society, properties));
    }

    Ok(result)
}
