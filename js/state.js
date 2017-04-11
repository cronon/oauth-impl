const state = {
	vk: {
		first_name: '',
		last_name: ''
	},
	github: {}
}

customElements.define('x-view', class extends HTMLElement {})
function updateView(data){
	Object.assing(state, data);
    document.querySelector('x-view').innerHTML = render(state);
}
function render(state){
	return `
		<h1>vk credentials</h1>
		${vkView(state)}
		<h1>github credentials</h1>
		<p>${githubView(state)}</p>
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
	return JSON.strigify(state.github);
}