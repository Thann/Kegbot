
require('styles/header.css');

module.exports = Backbone.View.extend({
	id: 'Header',
	template: `
		<a href="#">
			<span>Kegbot</span>
			<span rv-if="orgName">- { orgName }</span>
		</a>
		<span class="pull-right">
			<a href="#admin" rv-show="user.isAuthed |and user.attributes.admin" class="fa fa-cogs"></a>
			<a href="#login" rv-show="user.isAuthed">{ user.attributes.username }</a>
		</span>
	`,
	render: function() {
		this.scope = {
			user: Kegbot.User,
			orgName: Kegbot.AppConfig.OrgName,
		};
		this.$el.html(this.template);
		Rivets.bind(this.$el, this.scope);
		return this;
	},
});
