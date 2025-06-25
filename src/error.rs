use thiserror::Error;

#[derive(Error, Debug)]
pub enum ScraperError {
    #[error("Network error: {0}")]
    NetworkError(#[from] reqwest::Error),

    #[error("JSON parsing error: {0}")]
    JsonError(#[from] serde_json::Error),

    #[error("JSON parsing error: {0}")]
    JsonPathError(#[from] serde_path_to_error::Error<serde_json::Error>),

    #[error("Regex parsing error: {0}")]
    RegexError(#[from] regex::Error),

    #[error("Unexpected error: {0}")]
    Unexpected(String),
}
