mod error;
mod scrapers;

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    // let societies = scrapers::nobroker::fetch_societies().await?;
    // for society in societies {
    //     println!("Building Name: {}", society.building_name);
    // }

    let rentals = scrapers::nobroker::scrape_nobroker().await?;
    println!("======== Results ========");
    println!("Found {} societies with rentals", rentals.len());

    for (society, properties) in rentals {
        println!("Society: {}", society.building_name);
        for property in properties {
            println!("  Property: {} - Rent: {}", property.title, property.rent);
        }
    }

    // let properties = scrapers::nobroker::scrape_society(
    //     "https://www.nobroker.in/birla-alokya-whitefield_bangalore-prjt-8a9f888279943ebe017995173ecf57c7",
    // ).await?;
    // dbg!(properties);

    Ok(())
}
