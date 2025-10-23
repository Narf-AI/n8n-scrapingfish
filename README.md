# n8n-nodes-scrapingfish

This is an n8n community node for [Scrapingfish](https://scrapingfish.com/), a web scraping API. It allows you to scrape web pages, render JavaScript, and extract structured data directly within your n8n workflows.

[n8n](https://n8n.io/) is a [fair-code licensed](https://docs.n8n.io/sustainable-use-license/) workflow automation platform.

[Installation](#installation)
[Operations](#operations)
[Credentials](#credentials)
[Resources](#resources)

## Installation

Follow the [installation guide](https://docs.n8n.io/integrations/community-nodes/installation/) in the n8n community nodes documentation.

## Operations

This node provides a single operation to scrape a URL with various options:

- **URL**: The target URL to scrape.
- **Render JS**: Enable to render JavaScript on the page.
- **Additional Fields**:
  - **Extraction Rules**: Define CSS selectors to extract structured JSON data.
  - **JS Scenario**: Execute a sequence of browser actions.
  - **Headers**: Forward custom HTTP headers.
  - **Timeouts**: Configure request, trial, and rendering timeouts.

## Credentials

To use this node, you need a Scrapingfish API key.

1. Sign up at [scrapingfish.com](https://scrapingfish.com/) to get your API key.
2. In your n8n instance, go to **Credentials > New**.
3. Search for "Scrapingfish API" and add your API key.

## Resources

- [n8n community nodes documentation](https://docs.n8n.io/integrations/community-nodes/)
- [Scrapingfish API Documentation](https://scrapingfish.com/docs)

## License

MIT
