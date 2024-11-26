# Description

In the case that you're proxying your traffic through Cloudflare for a Webflow site, you might need to purge the Cloudflare cache when publishing a new version of the site as we're not using the Webflow CDN. This listens to Webflow webhooks and purges the cache for a given zone.

This assumes you have a Cloudflare account, Webflow site, and you're proxying all requests through Cloudflare (orange cloud). This isn't recommended by Webflow, but it can work really well.

## How to Use

### Setup Cloudflare Worker

1. Install Wrangler `npm install wrangler --save-dev` [More info](https://developers.cloudflare.com/workers/get-started/guide/)
1. Clone this repo
1. Login to Cloudflare and grab your Zone ID
1. Add it as a secret `wrangler secret put ZONE_ID` (will prompt you for zone id)
1. [Generate a new Cloudflare API Token](https://dash.cloudflare.com/profile/api-tokens) with Cache Purge permissions for that particular zone. Save that token
1. Add it as a secret as well `wrangler secret put CF_API_TOKEN` (will prompt you for token)
1. Deploy it `wrangler publish`
1. It should output the URL where the worker is published and where you'll send your webhook. If not, you can always login to the workers section in Cloudflare to find it.

### Setup Webflow Webhook

1. Add a webhook in Webflow project settings
1. Choose `Site publish` as the Trigger Type
1. Chose the `V2` version of the API
1. Paste your Cloudflare worker URL in the Webhook URL field.

### Test it

1. Go to your Cloudflare worker in the dashboard and live stream the logs
1. Publish your Webflow site
1. If you see a `200` status response it is working.

That's it!
