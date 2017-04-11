class VkAuth {
    constructor(){
        if (document.location.search === '?vk_authenticated') {
            const query = new URLSearchParams(document.location.hash.slice(1));
            this.accessToken = query.get('access_token');
            localStorage.setItem('accessToken', this.accessToken)
            this.userId = query.get('user_id');
            localStorage.setItem('userId', this.userId)
            this.authenticated = true;
            history.pushState({}, '', '')
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
            query.set('redirect_uri', document.location.host+'?vk_authenticated')
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
                updateView({vk: this.data});
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
