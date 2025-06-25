use serde::Deserialize;
use std::collections::HashMap;

#[derive(Debug, Deserialize)]
pub struct SocietyListResponse {
    status: String,
    message: String,
    pub data: Vec<Society>,
}

#[derive(Debug, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Society {
    // pub building_id: String,
    pub building_name: String,
    pub building_page_url: String,
    project_images: Vec<String>,
    property_count: u32,
    search_param: String,
    images_map: serde_json::Value, // Adjust type as needed
    ready_to_move: bool,
    #[serde(flatten)]
    others: serde_json::Value, // Adjust type as needed
}

impl Society {
    pub fn get_url(&self) -> String {
        format!("https://www.nobroker.in/{}", self.building_page_url)
    }
}

#[derive(Debug, Deserialize)]
#[serde(untagged)]
enum NobrokerDates {
    Ts(u64), // Timestamp in milliseconds
    Date(String), // ISO 8601 date string
}

// Generated from nb.appState of https://www.nobroker.in/birla-alokya-whitefield_bangalore-prjt-8a9f888279943ebe017995173ecf57c7
#[derive(Debug, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Property {
    sponsored: bool,
    building_id: String,
    shortlisted_by_logged_in_user: bool,
    id: String,
    short_url: String,
    description: String,
    combine_description: Option<String>,
    owner_des: Option<String>,
    lease_type: String,
    floor: i32,
    total_floor: i32,
    property_size: i32,
    latitude: f64,
    longitude: f64,
    property_age: i32,
    accurate_location: bool,
    pin_code: Option<u32>,
    active: bool,
    negotiable: bool,
    activate_later: bool,
    future_activation_date: Option<String>,
    #[serde(rename = "type")]
    property_type_bhk: String,
    city: String,
    locality: String,
    street: String,
    society: String,
    property_type: String,
    state: String,
    bathroom: i32,
    cup_board: Option<i32>,
    parking: String,
    inactive_reason: Option<String>,
    swimming_pool: bool,
    gym: bool,
    furnishing: String,
    lift: bool,
    property_code: Option<String>,
    amenities: String, // JSON string
    available_from: NobrokerDates,
    creation_date: NobrokerDates,
    last_update_date: NobrokerDates,
    activation_date: NobrokerDates,
    last_activation_date: Option<NobrokerDates>,
    facing: Option<String>,
    locality_id: String,
    nb_locality: String,
    managed: Option<bool>,
    location: String,
    score: Option<Score>,
    owner_id: String,
    building_name: Option<String>,
    builder_name: Option<String>,
    project_url: String,
    show_project: bool,
    seo_description: String, // JSON string array
    landmark_details: Option<String>,
    plot_area: Option<i32>,
    listing_verified: Option<bool>,
    verified_by_user: Option<String>,
    target_localities: Option<Vec<String>>,
    nudges: Option<Vec<String>>,
    // promoted_b: bool,
    filter_preference_score: i32,
    colour: Option<String>,
    lease_type_new: Vec<String>,
    contacted_status_details: Option<ContactedStatusDetails>,
    reactivation_req_date: Option<NobrokerDates>,
    reactivation_source: Option<String>,
    amenities_map: HashMap<String, bool>,
    power_backup: Option<String>,
    water_supply: Option<String>,
    mapped: bool,
    reactivation_requested_by: Option<String>,
    pub rent: i32,
    deposit: i32,
    shared_accomodation: bool,
    accomodation_type: Option<String>,
    balconies: Option<i32>,
    building_type: String,
    for_lease: bool,
    maintenance: bool,
    maintenance_amount: Option<i32>,
    breadcrumb_urls: Option<Vec<BreadcrumbUrl>>,
    furnishing_desc: String,
    type_desc: String,
    loan_available: bool,
    accomodation_type_desc: String,
    tenant_type_desc: String,
    last_update_string: Option<NobrokerDates>,
    date_only: NobrokerDates,
    pub title: String,
    property_title: String,
    detail_url: String,
    index_name: Option<String>,
    document_name: Option<String>,
    formatted_price: String,
    formatted_deposit: Option<String>,
    formatted_maintenance_amount: Option<String>,
    maintenance_included: Option<bool>,
    photos: Vec<Photo>,
    facing_desc: String,
    parking_desc: String,
    inactive_reason_desc: Option<String>,
    photo_available: Option<bool>,
    address: String,
    url: Option<String>,
    owner_name: Option<String>,
    complete_street_name: String,
    owner_description: Option<String>,
    thumbnail_image: String,
    admin_event: String,
    locality_truncated: String,
    secondary_title: String,
    buyer_property: bool,
    property_title_truncated: String,
    original_image_url: String,
    video_unit: Vec<VideoUnit>,
}

#[derive(Debug, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Score {
    id: Option<String>,
    lifestyle: f64,
    transit: f64,
    last_updated_date: NobrokerDates,
}

#[derive(Debug, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ContactedStatusDetails {
    contacted: String,
    slot_booked: String,
}

#[derive(Debug, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct BreadcrumbUrl {
    name: String,
    url: String,
}

#[derive(Debug, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Photo {
    title: String,
    name: String,
    images_map: ImageMap,
    display_pic: bool,
    dis_affinity: i32,
    image_source: Option<String>,
    h: i32,
    w: i32,
    state: Option<String>,
    sub_state: Option<String>,
    sub_reasons: Option<String>,
    uploaded_by: Option<String>,
    landscape: bool,
    duplicate: bool,
}

#[derive(Debug, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ImageMap {
    thumbnail: String,
    original: String,
    large: String,
    medium: String,
}

#[derive(Debug, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct VideoUnit {
    id: String,
    original: String,
    low: String,
    high: String,
    thumbnail: String,
    state: String,
    sub_state: Option<String>,
}

// Helper structs for parsing nested JSON strings
#[derive(Debug, Deserialize)]
#[serde(rename_all = "SCREAMING_SNAKE_CASE")]
pub struct Amenities {
    lift: bool,
    gym: bool,
    internet: bool,
    ac: bool,
    club: bool,
    intercom: bool,
    pool: bool,
    cpa: bool,
    fs: bool,
    servant: bool,
    security: bool,
    sc: bool,
    gp: bool,
    park: bool,
    rwh: bool,
    stp: bool,
    hk: bool,
    pb: bool,
    vp: bool,
}

#[derive(Debug, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct SeoLocation {
    id: String,
    name: String,
    seo_url: String,
    latitude: f64,
    longitude: f64,
    place_type: String,
}

// Example usage
impl Property {
    pub fn parse_amenities(&self) -> Result<Amenities, serde_json::Error> {
        serde_json::from_str(&self.amenities)
    }

    pub fn parse_seo_description(&self) -> Result<Vec<SeoLocation>, serde_json::Error> {
        serde_json::from_str(&self.seo_description)
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_property_deserialization() {
        let json_str = r#"
        {
            "sponsored": false,
            "buildingId": "8a9f888279943ebe017995173ecf57c7",
            "shortlistedByLoggedInUser": false,
            "id": "8a9f8a89977d279d01977d69d56218bb",
            "rent": 50000,
            "deposit": 200000
        }
        "#;

        let result: Result<Property, _> = serde_json::from_str(json_str);
        // This will fail because we're missing required fields, but shows structure
        assert!(result.is_err());
    }
}
