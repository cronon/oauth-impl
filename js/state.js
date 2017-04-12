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
        ${vkView(state)}
        <h1>github credentials</h1>
        <p>${githubView(state)}</p>
        <h1>google credentials</h1>
        ${googleView(state)}
    `
}
function vkView(state){
    return `
        <dl>
            <dt>First name</dt>
            <dd>${state.vk.first_name}</dd>
            <dt>Last name</dt>
            <dd>${state.vk.last_name}</dd>
        </dl>
    `
}
function githubView(state){
    return JSON.stringify(state.github);
}
function googleView(state){
    return `
        <dl>
            <dt>Name</dt>
            <dd>${state.google.name}</dd>
            <dt>Email</dt>
            <dd>${state.google.name}</dd>
            <dt>Image</dt>
            <dd><img src="${state.google.image}"></dd>
        </dl>
    `
}
