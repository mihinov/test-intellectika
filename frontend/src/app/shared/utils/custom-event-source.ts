export class CustomEventSource {
  private _xhr: XMLHttpRequest;
  private _url: string;
  private _headers?: { [key: string]: string }; // Заголовки
  private _onmessage: (event: MessageEvent) => void = () => {}; // Инициализация с пустой функцией
  private _onerror: (event: Event) => void = () => {}; // Инициализация с пустой функцией
  private _onopen: () => void = () => {}; // Инициализация с пустой функцией

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

  // Открытие подключения (инициализация)
  open(): void {
    this._xhr.open('GET', this._url, true);

    if (this._headers) {
      Object.keys(this._headers).forEach((key) => {
        if (this._headers) this._xhr.setRequestHeader(key, this._headers[key]);
      });
    }

    this._xhr.setRequestHeader('Accept', 'text/event-stream'); // SSE header

    // Обработчик состояния запроса
    this._xhr.onreadystatechange = () => {
      if (this._xhr.readyState === XMLHttpRequest.OPENED) {
        this._onopen && this._onopen();
      }
    };

    // Обработчик для получения данных в реальном времени
    this._xhr.onprogress = () => {
      if (this._xhr.status === 200) {
        const response = this._xhr.responseText;
        this._processData(response); // Обрабатываем данные при каждом новом поступлении
      }
    };

    // Обработчик ошибок
    this._xhr.onerror = (error) => {
      console.error('SSE Error: ', error);
      this._onerror && this._onerror(error);
    };

    // Ожидаем ответ
    this._xhr.send();
  }

  // Обработка поступающих данных от сервера
  private _processData(dataInput: string): void {
		//console.log(dataInput);

  	const events = dataInput.split('\n').filter(Boolean); // Убираем пустые строки

		let data = '';
		//let id = -1;

    events.forEach((eventStr) => {
      //console.log('eventStr:', eventStr);

			if (eventStr.startsWith('data: ')) {
				data = JSON.parse(eventStr.substring(6));
			}

			//if (eventStr.startsWith('id: ')) {
			//	id = JSON.parse(eventStr.substring(4));
			//}

		});

		//console.log(data);
		//console.log(id);

		const messageEvent = new MessageEvent('message', { data: data });

		this._onmessage(messageEvent)
  }

  // Установка обработчика события onmessage
  set onmessage(callback: (event: MessageEvent) => void) {
    this._onmessage = callback;
  }

  // Установка обработчика события onerror
  set onerror(callback: (event: Event) => void) {
    this._onerror = callback;
  }

  // Установка обработчика события onopen
  set onopen(callback: () => void) {
    this._onopen = callback;
  }

  // Закрытие соединения
  close(): void {
    if (this._xhr) {
      this._xhr.abort();
    }
  }
}
