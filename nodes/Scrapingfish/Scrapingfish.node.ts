import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	NodeConnectionTypes,
} from 'n8n-workflow';

export class Scrapingfish implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Scrapingfish',
		name: 'scrapingfish',
		icon: 'file:scrapingfish.svg',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Interact with the Scrapingfish API',
		defaults: {
			name: 'Scrapingfish',
		},
		usableAsTool: true,
		inputs: [NodeConnectionTypes.Main],
		outputs: [NodeConnectionTypes.Main],
		credentials: [{ name: 'scrapingfishApi', required: true }],
		properties: [
			{
				displayName: 'URL',
				name: 'url',
				type: 'string',
				default: '',
				placeholder: 'https://example.com',
				description: 'The URL to scrape',
				required: true,
			},
			{
				displayName: 'Render JS',
				name: 'renderJs',
				type: 'boolean',
				default: false,
				description: 'Whether to render JavaScript on the page',
			},
			{
				displayName: 'Extraction Rules',
				name: 'extractRules',
				type: 'json',
				default: null,
				placeholder: '{"title": "h1", "description": ".description"}',
				description:
					'Rules to extract data from the page. See <a href="https://scrapingfish.com/docs/extract-rules">docs</a>.',
			},
			{
				displayName: 'JS Scenario',
				name: 'jsScenario',
				type: 'json',
				default: null,
				placeholder: '{ steps: [{wait: 1000},{click_and_wait_for_navigation: "p > a"}]}',
				description:
					'Rules to extract data from the page. See <a href="https://scrapingfish.com/docs/extract-rules">docs</a>.',
			},
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];

		for (let i = 0; i < items.length; i++) {
			try {
				const url = this.getNodeParameter('url', i, '') as string;
				const renderJs = this.getNodeParameter('renderJs', i, false) as boolean;
				const extractRules = this.getNodeParameter('extractRules', i, null) as string | null;
				const jsScenario = this.getNodeParameter('jsScenario', i, null) as string | null;
				const credentials = await this.getCredentials('scrapingfishApi');

				const qs: {
					api_key: string;
					url: string;
					render_js?: boolean;
					extract_rules?: string;
					js_scenario?: string;
				} = {
					api_key: credentials.apiKey as string,
					url: url,
				};

				if (renderJs) {
					qs.render_js = true;
				}

				if (extractRules) {
					qs.extract_rules = extractRules;
				}

				if (jsScenario) {
					qs.js_scenario = jsScenario;
				}

				const response = await this.helpers.httpRequestWithAuthentication.call(
					this,
					'scrapingfishApi',
					{
						method: 'GET',
						url: 'https://scraping.narf.ai/api/v1/',
						qs: qs,
						json: true,
					},
				);

				returnData.push({
					json: response,
					pairedItem: { item: i },
				});
			} catch (error) {
				if (this.continueOnFail()) {
					returnData.push({
						json: { error: error.message },
						pairedItem: { item: i },
					});
					continue;
				}
				throw error;
			}
		}

		return [this.helpers.returnJsonArray(returnData)];
	}
}
