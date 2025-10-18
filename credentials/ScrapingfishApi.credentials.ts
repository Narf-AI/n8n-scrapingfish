import type {
	IAuthenticateGeneric,
	ICredentialTestRequest,
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class ScrapingfishApi implements ICredentialType {
	name = 'scrapingfishApi';

	displayName = 'Scrapingfish API';

	// Test dummy icon - using a built-in n8n icon
	icon = 'file:scrapingfish.svg';

	// Link to your community node's README
	documentationUrl = 'https://github.com/org/-scrapingfish?tab=readme-ov-file#credentials';

	properties: INodeProperties[] = [
		{
			displayName: 'API Key',
			name: 'apiKey',
			type: 'string',
			typeOptions: { password: true },
			required: true,
			default: '',
		},
	];

	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {
			headers: {
				'x-api-key': '={{$credentials.apiKey}}',
			},
		},
	};

	test: ICredentialTestRequest = {
		request: {
			baseURL: 'https://scraping.narf.ai/api/v1/',
			url: '/v1/user',
		},
	};
}
