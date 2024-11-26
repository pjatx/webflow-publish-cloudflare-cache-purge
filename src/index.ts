interface CloudflareAPIResponse {
	success: boolean;
	errors: any[];
}

export default {
	async fetch(request: Request, env: { ZONE_ID: string; CF_API_TOKEN: string }) {
		// Only allow POST requests
		if (request.method !== 'POST') {
			return new Response('Method not allowed', { status: 405 });
		}

		try {
			// Verify the webhook signature if provided
			// You can add Webflow webhook signature verification here if needed

			// Parse the webhook payload
			const payload = await request.json();

			// Initialize the Cloudflare API client with your API token
			const purgeRequest = await fetch('https://api.cloudflare.com/client/v4/zones/' + env.ZONE_ID + '/purge_cache', {
				method: 'POST',
				headers: {
					Authorization: `Bearer ${env.CF_API_TOKEN}`,
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					purge_everything: true,
				}),
			});

			const purgeResponse = (await purgeRequest.json()) as CloudflareAPIResponse;

			if (!purgeResponse.success) {
				throw new Error('Cache purge failed: ' + JSON.stringify(purgeResponse.errors));
			}

			return new Response(
				JSON.stringify({
					success: true,
					message: 'Cache purged successfully',
					webflowTrigger: payload,
				}),
				{
					headers: {
						'Content-Type': 'application/json',
					},
				}
			);
		} catch (error: any) {
			return new Response(
				JSON.stringify({
					success: false,
					error: error.message,
				}),
				{
					status: 500,
					headers: {
						'Content-Type': 'application/json',
					},
				}
			);
		}
	},
};
