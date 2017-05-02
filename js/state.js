const state = {
    // vk: {
    //     first_name: '',
    //     last_name: ''
    // },
    // auth0: {},
    // google: {
    //     name: '',
    //     image: '',
    //     email: ''
    // }
}

customElements.define('x-view', class extends HTMLElement {})
function updateView(data){
    Object.assign(state, data);
    document.querySelector('x-view').innerHTML = render(state);
}
function render(state){
    return `
        <h1>vk credentials</h1>
        ${vkView(state.vk)}
        <h1>auth0 credentials</h1>
        <p>${auth0(state.auth0)}</p>
        <h1>google credentials</h1>
        ${googleView(state.google)}
    `
}
function vkView(state){
    return state ? `
        <dl>
            <dt>First name</dt>
            <dd>${state.first_name}</dd>
            <dt>Last name</dt>
            <dd>${state.last_name}</dd>
            <dt>Photo</dt>
            <dd><img src="${state.photo}"/></dd>
        </dl>
        <button onclick="vkAuth.signout()">Sign out</button>
    ` : '';
}
function auth0(state){
    return state ? `
        <dl>
            <dt>Name</dt>
            <dd>${state.name}</dd>
            <dt>Email</dt>
            <dd>${state.email}</dd>
            <dt>Photo</dt>
            <dd><img src="${state.picture}"></dd>
        </dl>
        <button onclick="auth0Auth.signout()">Sign out</button>
    ` : '';
}
function googleView(state){
    return state ? `
        <dl>
            <dt>Name</dt>
            <dd>${state.name}</dd>
            <dt>Email</dt>
            <dd>${state.email}</dd>
            <dt>Photo</dt>
            <dd><img src="${state.picture}"></dd>
        </dl>
        <button onclick="googleAuth.signout()">Sign out</button>
    ` : '';
}
