const openAuthModalCallback = () => {
	//console.log('Открытие модалки');

	let authOrLogoutBtnNode = getAuthOrLogoutBtnNode();

	authOrLogoutBtnNode.addEventListener('click', () => {
		const inputTokenNode = getInputTokenNode();
		authOrLogoutBtnNode = getAuthOrLogoutBtnNode();
		if (authOrLogoutBtnNode.classList.contains('authorize')) {
			//console.log('клик по кнопке authorize');

			const token = inputTokenNode.value;

			//console.log('токен из input', token);

			if (token) {
				localStorage.setItem('jwtToken', token);
			}
		} else {
			//console.log('токен удалён из localStorage');

			localStorage.removeItem('jwtToken');
		}
	});
};


const getInputTokenNode = () => document.querySelector('#auth-bearer-value');
const getAuthOrLogoutBtnNode = () => document.querySelector('.auth-btn-wrapper .btn.auth');

window.addEventListener('load', () => {
	setTimeout(() => {
		main();
	}, 0);
});

function main() {
	//console.log('Скрипт swagger-custom.js работает');

	const authMainInitBtnNode = document.querySelector('.auth-wrapper .btn.authorize');

	authMainInitBtnNode.addEventListener('click', () => setTimeout(() => openAuthModalCallback(), 0));

	const authBtnsOnTheRoutes = Array.from(document.querySelectorAll('.authorization__btn'));

	for (const authBtnNode of authBtnsOnTheRoutes) {
		authBtnNode.addEventListener('click', () => setTimeout(() => openAuthModalCallback(), 0));
	}

	// Загружаем токен из localStorage, если он есть
	const storedToken = localStorage.getItem('jwtToken');
	if (storedToken) {
		// Устанавливаем токен в Swagger-UI
		window.ui.preauthorizeApiKey('bearer', storedToken);
	}
}
