class VkAuth {
    constructor(){
        if (document.location.search === '?authenticated') {
            const query = new URLSearchParams(document.location.hash.slice(1));
            this.accessToken = query.get('access_token');
            localStorage.setItem('accessToken', this.accessToken)
            this.userId = query.get('user_id');
            localStorage.setItem('userId', this.userId)
            this.authenticated = true;
            // document.location.hash = '';
            // document.location.search = '';
        } else if (localStorage.hasOwnProperty('accessToken') && localStorage.hasOwnProperty('userId')) {
            this.userId = localStorage.getItem('userId');
            this.accessToken = localStorage.getItem('accessToken');
            this.authenticated = true;
        } else {
            this.authenticated = false;
        }
        console.log(this.accessToken)
    }
    authenticate(){
        fetch('keys.json').then(res => {
            return res.json();
        }).then(keys => {
            const host = 'https://oauth.vk.com/authorize?';
            const query = new URLSearchParams();
            query.set('client_id', keys.vk.client_id)
            query.set('redirect_uri', document.location.host+'?authenticated')
            query.set('display', 'page')
            // query.set('scope', 'status,offline')
            query.set('response_type', 'token')
            query.set('v', '5.63')
            query.set('state', 'vk')
            query.set('revoke', 1)
            const url = host+query.toString();
            document.location.href = url;
        })
    }
}

var vkAuth = new VkAuth;

class VkAPI {
    constructor(auth){
        if (!auth.authenticated) {
            auth.authenticate();
        } else {
            $.ajax({
                url: this.buildUrl('users.get', {user_ids: auth.userId}, auth.accessToken),
                dataType:'jsonp',
                callback: 'callback'
            })
            .done(json => {
                this.data = json.response[0]
                console.log(json);
                updateView(this.data);
            })
        }
    }
    buildUrl(methodName, params, accessToken) {
        const query = new URLSearchParams();
        for (let key in params){
            query.set(key, params[key]);
        }
        return `https://api.vk.com/method/${methodName}?${query.toString()}&access_token=${accessToken}&v=5.63`
    }
}
var vkAPI = new VkAPI(vkAuth);
customElements.define('x-view', class extends HTMLElement {
    render(data){
        this.innerHTML =  `
            <dl>
                <dt>First name</dt>
                <dd>${data.first_name}</dd>
                <dt>Last name</dt>
                <dd>${data.last_name}</dd>
            </dl>
        `
    }
})
function updateView(data){
    document.querySelector('x-view').render(data);
}
// client_id
// обязательный Идентификатор Вашего приложения.
// redirect_uri
// обязательный Адрес, на который будет переадресован пользователь после прохождения авторизации (см. redirect_uri).
// display  Указывает тип отображения страницы авторизации. Поддерживаются следующие варианты:
// page — форма авторизации в отдельном окне;
// popup — всплывающее окно;
// mobile — авторизация для мобильных устройств (без использования Javascript)
// Если пользователь авторизуется с мобильного устройства, будет использован тип mobile.
// scope    Битовая маска настроек доступа приложения, которые необходимо проверить при авторизации пользователя и запросить отсутствующие.
// response_type    Тип ответа, который необходимо получить. Укажите token.
// v    Версия API, которую Вы используете. Актуальная версия: 5.63.
// state    Произвольная строка, которая будет возвращена вместе с результатом авторизации.
// revoke=1 Параметр, указывающий, что необходимо не пропускать этап подтверждения прав, даже если пользователь уже авторизован.

// Пример запроса:
// https://oauth.vk.com/authorize?client_id=1&display=page&redirect_uri=http://example.com/callback&scope=friends&response_type=token&v=5.63&state=123456