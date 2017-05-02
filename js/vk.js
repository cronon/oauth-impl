class VkAuth {
    constructor(){
        if (document.location.search === '?vk_authorized') {
            const query = new URLSearchParams(document.location.hash.slice(1));
            this.access_token = query.get('access_token');
            this.user_id = query.get('user_id');
            localStorage.setItem('vk_access_token', this.access_token)
            localStorage.setItem('vk_user_id', this.user_id)
            this.authenticated = true;
            history.pushState({}, '/', '/')
        } else if (localStorage.hasOwnProperty('vk_access_token') && localStorage.hasOwnProperty('vk_user_id')) {
            this.user_id = localStorage.getItem('vk_user_id');
            this.access_token = localStorage.getItem('vk_access_token');
            this.authenticated = true;
        } else {
            this.authenticated = false;
        }
    }
    authenticate(){
        fetch('keys.json').then(res => {
            return res.json();
        }).then(keys => {
            const host = 'https://oauth.vk.com/authorize?';
            const query = new URLSearchParams();
            query.set('client_id', keys.vk.client_id)
            query.set('redirect_uri', document.location.host+'?vk_authorized')
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
    signout(){
        this.user_id = null;
        this.access_token = null;
        localStorage.removeItem('vk_access_token');
        this.authenticated = false;
        document.location = document.location;
    }
}

var vkAuth = new VkAuth;

class VkAPI {
    constructor(auth){
        this.auth = auth;
        if (auth.authenticated) {
            this.getProfile();
        }
    }
    getProfile(){
        if (this.auth.authenticated) {
            $.ajax({
                url: this.buildUrl('users.get', {
                        user_ids: this.auth.user_id,
                        fields: 'photo,screenname'
                    }, this.auth.access_token),
                dataType:'jsonp',
                callback: 'callback'
            })
            .done(json => {
                if (json.response) {
                    this.data = json.response[0]
                    updateView({vk: this.data});
                } else {
                    console.log(json)
                }
            });
        } else {
            this.auth.authenticate();
        }
    }
    buildUrl(methodName, params, access_token) {
        const query = new URLSearchParams();
        for (let key in params){
            query.set(key, params[key]);
        }
        return `https://api.vk.com/method/${methodName}?${query.toString()}&access_token=${access_token}&v=5.63`
    }
}
var vkAPI = new VkAPI(vkAuth);
