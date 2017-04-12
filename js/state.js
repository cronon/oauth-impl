const state = {
    vk: {
        first_name: '',
        last_name: ''
    },
    github: {},
    google: {
        name: '',
        image: '',
        email: ''
    }
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
        <h1>github credentials</h1>
        <p>${githubView(state.githb)}</p>
        <h1>google credentials</h1>
        ${googleView(state.google)}
    `
}
function vkView(state){
    return `
        <dl>
            <dt>First name</dt>
            <dd>${state.first_name}</dd>
            <dt>Last name</dt>
            <dd>${state.last_name}</dd>
        </dl>
    `
}
function githubView(state){
    return JSON.stringify(state);
}
function googleView(state){
    return `
        <dl>
            <dt>Name</dt>
            <dd>${state.name}</dd>
            <dt>Email</dt>
            <dd>${state.name}</dd>
            <dt>Image</dt>
            <dd><img src="${state.picture}"></dd>
        </dl>
        <button onclick="googleAuth.signout()">Sign out</button>
    `
}
