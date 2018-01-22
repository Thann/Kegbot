// Layout - The parent view of the whole app, and also the router.

require('styles/layout.css');

const UserModel = require('models/user.js');

module.exports = Backbone.View.extend({
	el: 'body',
	template: `
		<div data-subview="header"></div>
		<div class="main-bar">
			<div data-subview="sidebar"></div>
			<div class="main-panel">...</div>
		</div>
		<div class="footer hidden"></div>
		<canvas style="position: absolute; pointer-events: none;"></canvas>
	`,
	loading: true,
	mainTemplate: '<div data-subview="main"></div>',
	userTemplate: '<div data-subview="user"></div>',
	// doorTemplate: '<div data-subview="door"></div>',
	adminTemplate: '<div data-subview="admin"></div>',
	loginTemplate: '<div data-subview="login"></div>',
	events: {
		'click #Header .toggle-left-sidebar': function() {
			this.subviews.sidebar.toggle();
		},
	},
	subviewCreators: {
		main: function() { return new Kegbot.Views.MainPanel(); },
		user: function() { return new Kegbot.Views.UserPanel(); },
		// door: function() { return new Kegbot.Views.DoorPanel(); },
		admin: function() { return new Kegbot.Views.AdminPanel(); },
		login: function() { return new Kegbot.Views.LoginPanel(); },
		header: function() { return new Kegbot.Views.Header(); },
		sidebar: function() { return new Kegbot.Views.Sidebar(); },
	},
	initialize: function() {
		const layout = this;
		this.loading = true;
		Backbone.Subviews.add( this );

		Kegbot.Router = new (Backbone.Router.extend({
			routes: {
				'': 'mainTemplate',
				'login': 'loginTemplate',
				'admin': 'adminTemplate',
				'user/:id': 'userTemplate',
				// 'door/:id': 'doorTemplate',
				'*notFound': '',
			},
			execute: function(cb, args, name) {
				this.args = args;
				if (!layout.loading && !Kegbot.User.isAuthed) {
					this.navigate('login', {trigger: true});
				} else if (!Kegbot.Router.name && layout[name]) {
					layout.render(layout[name]);
				} else {
					// route not found
					this.navigate('', {trigger: true});
				}
			},
		}))();

		Kegbot.User = new UserModel();
		Kegbot.User.on('relog', function(loggedIn) {
			if (loggedIn) {
				layout.render();
			} else {
				Kegbot.Router.navigate('login', {trigger: false});
				layout.render(layout.loginTemplate);
			}
		});

		Kegbot.Settings = new (Backbone.Model.extend({
			url: '/site/settings',
		}))();
		Kegbot.Settings.fetch();
		// Fetch on user sync?

		this.setTitle();
		Backbone.history.start();
		Kegbot.User.init();
	},
	setTitle: function() {
		document.title = 'Kegbot '+(
			Kegbot.AppConfig.OrgName? ' - '+Kegbot.AppConfig.OrgName : '');
	},
	render: function(tmpl) {
		this.$el.html(this.template);
		if (tmpl)
			this._current_template = tmpl;
		if (!this.loading) {
			this.$('.main-panel').html(this._current_template);
		}
		this.loading = false;
		return this;
	},
});
