class GithubAuth {
    constructor(){
        if (document.location.search.match(/\?github_authorized/)) {
            const query = new URLSearchParams(document.location.search.slice(1));
            const code = query.get('code');
            history.pushState({}, '', '')
            fetch('keys.json').then(res => {
                return res.json();
            }).then(keys => {
                const headers = new Headers();
                headers.append('Accept', 'application/json');
                const request = new Request('https://github.com/login/oauth/access_token', {
                    method: 'POST',
                    body: JSON.stringify({
                        code: code,
                        client_id: keys.github.clientId,
                        client_secret: keys.github.clientSecret
                    }),
                    headers: headers
                })
                return fetch(request)
            })
            .then(res => res.json())
            .then(json => {
                console.log(json)
                this.accessToken = json.access_token;
                localStorage.setItem('accessToken', this.accessToken)
                localStorage.setItem('github');
                this.authenticated = true;
            })
            
        } else if (
            localStorage.hasOwnProperty('accessToken') && 
            localStorage.hasOwnProperty('github')
            ) {
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
            const host = 'https://github.com/login/oauth/authorize?';
            const query = new URLSearchParams();
            query.set('client_id', keys.github.clientId)
            query.set('scope', 'user')
            const url = host+query.toString();
            document.location.href = url;
        })
    }
}

var githubAuth = new GithubAuth;

class GithubAPI {
    constructor(auth){
        // if (!auth.authenticated) {
        //     auth.authenticate();
        // } else {
        //     $.ajax({
        //         url: this.buildUrl('users.get', {user_ids: auth.userId}, auth.accessToken),
        //         dataType:'jsonp',
        //         callback: 'callback'
        //     })
        //     .done(json => {
        //         this.data = json.response[0]
        //         console.log(json);
        //         updateView({vk: this.data});
        //     })
        // }
    }
    buildUrl(methodName, params, accessToken) {
        const query = new URLSearchParams();
        for (let key in params){
            query.set(key, params[key]);
        }
        return `https://api.vk.com/method/${methodName}?${query.toString()}&access_token=${accessToken}&v=5.63`
    }
}
var githubAPI = new GithubAPI(githubAuth);
