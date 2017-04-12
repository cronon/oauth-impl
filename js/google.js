class GoogleAuth {
    constructor(){
        if (document.location.search.match(/^\?google_authorized/)){
            const query = new URLSearchParams(document.location.hash.slice(1));
            const access_token = query.get('access_token');
            const id_token = jwt_decode(query.get('id_token'));
            history.pushState({}, '/', '/');
            this.access_token = access_token;
            this.id_token = id_token;
            localStorage.google_access_token = access_token;
            localStorage.id_token = JSON.stringify(id_token);
            console.assert(localStorage.nonce == id_token.nonce, 'Invalid nonce!');
            localStorage.nonce = null;
            this.authenticated = true;
        } else if (localStorage.google_access_token){
            this.access_token = localStorage.google_access_token;
            this.authenticated = true;
        } else {
            this.authenticated = false;
        }
    }
    authenticate(){
        fetch('keys.json').then(res => res.json())
        .then((keys) => {
            const url = 'https://accounts.google.com/o/oauth2/v2/auth?'
            const query = new URLSearchParams();
            query.set('client_id', keys.google.client_id);
            query.set('response_type', 'id_token token');
            query.set('scope','openid email profile');
            query.set('redirect_uri', document.location.origin + '?google_authorized');
            const nonce = parseInt(Math.random().toString().slice(2)).toString(36);
            localStorage.nonce = nonce;
            query.set('nonce', nonce);
            document.location = url+query.toString();
        })
    }
    signout(){
        localStorage.removeItem('google_access_token');
        this.authenticated = false;
        document.location = document.location;
    }
}
var googleAuth = new GoogleAuth;

class GoogleAPI {
    constructor(auth){
        this.auth = auth;
        if (auth.authenticated) {
            this.getProfile();
        }
    }
    getProfile(){
        if (this.auth.authenticated){
            const url = 'https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token='+this.auth.access_token;
            return fetch(url).then(res => res.json())
            .then(json => updateView({google: json}))
        } else {
            this.auth.authenticate();
        }
    }
}
var googleAPI = new GoogleAPI(googleAuth)
