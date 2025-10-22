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
		subtitle: '={{$parameter["url"]}}',
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
				displayName: 'Additional Fields',
				name: 'fields',
				type: 'collection',
				placeholder: 'Add Field',
				default: {},
				options: [
					{
						displayName: 'Extraction Rules',
						name: 'extractRules',
						type: 'json',
						default: '',
						placeholder: '{"title": "h1", "description": ".description"}',
						description:
							'Rules to extract data from the page. See <a href="https://scrapingfish.com/docs/extract-rules">docs</a>.',
					},
					{
						displayName: 'Headers',
						name: 'headers',
						type: 'json',
						default: '',
						placeholder: '{"X-Custom-Header": "value"}',
						description:
							'HTTP headers to forward to the target URL. See <a href="https://scrapingfish.com/docs/forward-headers">docs</a>.',
					},
					{
						displayName: 'JS Scenario',
						name: 'jsScenario',
						type: 'json',
						default: '',
						placeholder:
							'{ "steps": [{ "wait": 1000 }, { "click_and_wait_for_navigation": "p > a" }]}',
						description:
							'JS instructions to execute on a page. See <a href="https://scrapingfish.com/docs/js-scenario">docs</a>.',
					},
					{
						displayName: 'Render JS Timeout',
						name: 'renderJsTimeoutMs',
						type: 'number',
						default: 5000,
						description: 'Timeout for JS rendering in milliseconds. Defaults to 5s.',
					},
					{
						displayName: 'Total Timeout',
						name: 'totalTimeoutMs',
						type: 'number',
						default: 90000,
						description: 'Total request timeout in milliseconds. Defaults to 9s.',
					},
					{
						displayName: 'Trial Timeout',
						name: 'trialTimeoutMs',
						type: 'number',
						default: 30000,
						description: 'Timeout for a single trial in milliseconds. Defaults to 30s.',
					},
				],
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
				const fields = this.getNodeParameter('fields', i, {}) as {
					extractRules?: string;
					jsScenario?: string;
					totalTimeoutMs?: number;
					trialTimeoutMs?: number;
					renderJsTimeoutMs?: number;
					headers?: string;
				};
				const extractRules = fields.extractRules;
				const jsScenario = fields.jsScenario;
				const credentials = await this.getCredentials('scrapingfishApi');

				const qs: {
					api_key: string;
					url: string;
					render_js?: boolean;
					extract_rules?: string;
					js_scenario?: string;
					total_timeout_ms?: number;
					trial_timeout_ms?: number;
					render_js_timeout_ms?: number;
					headers?: string;
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

				if (fields.totalTimeoutMs) {
					qs.total_timeout_ms = fields.totalTimeoutMs;
				}

				if (fields.trialTimeoutMs) {
					qs.trial_timeout_ms = fields.trialTimeoutMs;
				}

				if (fields.renderJsTimeoutMs) {
					qs.render_js_timeout_ms = fields.renderJsTimeoutMs;
				}

				if (fields.headers) {
					qs.headers = fields.headers;
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
