class Auth0Auth {
    constructor(){
        if (document.location.search.match(/^\?auth0_authorized/)){
            const query = new URLSearchParams(document.location.hash.slice(1));
            const access_token = query.get('access_token');
            const id_token = jwt_decode(query.get('id_token'));
            history.pushState({}, '/', '/');
            this.access_token = access_token;
            this.id_token = id_token;
            localStorage.auth0_access_token = access_token;
            localStorage.id_token = JSON.stringify(id_token);
            console.assert(localStorage.nonce == id_token.nonce, 'Invalid nonce!');
            localStorage.nonce = null;
            this.authenticated = true;
        } else if (localStorage.auth0_access_token){
            this.access_token = localStorage.auth0_access_token;
            this.authenticated = true;
        } else {
            this.authenticated = false;
        }
    }
    authenticate(){
        fetch('keys.json').then(res => res.json())
        .then((keys) => {
            const url = 'https://oauth-impl.eu.auth0.com/authorize?'
            const query = new URLSearchParams();
            query.set('client_id', keys.auth0.client_id);
            query.set('response_type', 'id_token token');
            query.set('scope','openid email profile');
            query.set('redirect_uri', document.location.origin + '?auth0_authorized');
            const nonce = parseInt(Math.random().toString().slice(2)).toString(36);
            localStorage.nonce = nonce;
            query.set('nonce', nonce);
            document.location = url+query.toString();
        })
    }
    signout(){
        localStorage.removeItem('auth0_access_token');
        this.authenticated = false;
        document.location = document.location;
    }
}
var auth0Auth = new Auth0Auth;

class Auth0API {
    constructor(auth){
        this.auth = auth;
        if (auth.authenticated) {
            this.getProfile();
        }
    }
    getProfile(){
        if (this.auth.authenticated){
            const url = 'https://oauth-impl.eu.auth0.com/userinfo?access_token='+this.auth.access_token;
            return fetch(url).then(res => res.json())
            .then(json => updateView({auth0: json}))
        } else {
            this.auth.authenticate();
        }
    }
}
var auth0API = new Auth0API(auth0Auth)
