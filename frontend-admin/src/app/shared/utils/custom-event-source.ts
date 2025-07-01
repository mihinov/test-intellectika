export interface ErrorDetail {
	status: number;
	statusText: string;
	body: any;
}

export class CustomEventSource {
	private _xhr: XMLHttpRequest;
	private _url: string;
	private _headers?: { [key: string]: string };
	private _onmessage: (event: MessageEvent) => void = () => {};
	private _onerror: (error: ErrorDetail) => void = () => {};
	private _onopen: () => void = () => {};

	get url(): string {
		return this._url;
	}

	get readyState(): number {
		return this._xhr.readyState;
	}

	constructor(url: string, headers?: { [key: string]: string }) {
		this._url = url;
		this._headers = headers;
		this._xhr = new XMLHttpRequest();
	}

	open(): void {
		this._xhr.open('GET', this._url, true);
		this._xhr.setRequestHeader('Accept', 'text/event-stream');

		if (this._headers) {
			for (const key in this._headers) {
				this._xhr.setRequestHeader(key, this._headers[key]);
			}
		}

		this._xhr.onreadystatechange = () => {
			if (this._xhr.readyState === XMLHttpRequest.OPENED) {
				this._onopen();
			}
		};

		this._xhr.onprogress = () => {
			if (this._xhr.status === 200) {
				const response = this._xhr.responseText;
				this._processData(response);
			}
		};

		this._xhr.onload = () => {
			if (this._xhr.status !== 200) {
				const errorDetail: ErrorDetail = {
					status: this._xhr.status,
					statusText: this._xhr.statusText,
					body: this._parseBody(this._xhr.responseText)
				};
				console.error(`SSE load error: ${errorDetail.status} - ${errorDetail.statusText}`, errorDetail.body);
				this._onerror(errorDetail);
			}
		};

		this._xhr.onerror = () => {
			this._onerror({
				status: this._xhr.status || 0,
				statusText: this._xhr.statusText || 'Network error',
				body: null
			});
		};

		this._xhr.ontimeout = () => {
			this._onerror({
				status: 0,
				statusText: 'Timeout',
				body: null
			});
		};

		this._xhr.send();
	}

	private _processData(dataInput: string): void {
		const events = dataInput.split('\n').filter(Boolean);
		let data = '';

		for (const eventStr of events) {
			if (eventStr.startsWith('data: ')) {
				try {
					data = JSON.parse(eventStr.substring(6));
				} catch (_) {
					_
					continue;
				}
			}
		}

		if (data === '') return;

		const messageEvent = new MessageEvent('message', { data });
		this._onmessage(messageEvent);
	}

	private _parseBody(responseText: string): any {
		try {
			return JSON.parse(responseText);
		} catch {
			return responseText;
		}
	}

	set onmessage(callback: (event: MessageEvent) => void) {
		this._onmessage = callback;
	}

	set onerror(callback: (error: ErrorDetail) => void) {
		this._onerror = callback;
	}

	set onopen(callback: () => void) {
		this._onopen = callback;
	}

	close(): void {
		this._xhr.abort();
	}
}
