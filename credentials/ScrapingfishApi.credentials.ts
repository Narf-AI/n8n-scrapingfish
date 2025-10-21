import type {
	IAuthenticateGeneric,
	Icon,
	ICredentialTestRequest,
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class ScrapingfishApi implements ICredentialType {
	name = 'scrapingfishApi';

	displayName = 'Scrapingfish API';

	icon = 'file:../nodes/Scrapingfish/scrapingfish.svg' as Icon;

	documentationUrl = 'https://scrapingfish.com/docs';

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
			qs: {
				api_key: '={{$credentials.apiKey}}',
			},
		},
	};

	test: ICredentialTestRequest = {
		request: {
			baseURL: 'https://scraping.narf.ai/api/v1/',
			url: 'usage',
		},
	};
}
