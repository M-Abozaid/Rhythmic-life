'use strict';

const request = require('request-promise');
const config = require('./config')
const FB_PAGE_TOKEN = config.fbPageToken;
const Q = require('q');
const _ = require('lodash');

class GraphAPI {
	constructor() {
		this.api = request.defaults({
			uri: 'https://graph.facebook.com/v2.8/me/messages',
			method: 'POST',
			json: true,
			qs: { access_token: FB_PAGE_TOKEN },
			headers: {'Content-Type': 'application/json'},
		});
	}
	
	sendTemplateMessage(recipientId, data) {
		const opts = {
			form: {
				recipient: {
					id: recipientId,
				},
				message: data,
			}
		};
		console.log('opts inside sendTemplateMessage ', JSON.stringify(opts));
		return this.api(opts);
	}

	sendPlainMessage(recipientId, msg) {
		return this.sendTemplateMessage(recipientId, {text: msg});
	}

	sendBulkMessages(recipientId, messages) {
		return messages.reduce((p, message) => {
			return p.then(() => {
				return this.sendTypingOn(recipientId)
					.then(() => {
						const delay = message.text && message.text.length * 20;
						return Q.delay(delay || 500)	
					})
					.then(() => {
						if (_.isString(message)) {
							return this.sendPlainMessage(recipientId, message);
						} else {
							return this.sendTemplateMessage(recipientId, message);
						}
					});
			});
		}, Q());
	}

	sendTypingOn(recipientId) {
		return this._sendTyping(recipientId, 'typing_on');
	}

	sendTypingOff(recipientId) {
		return this._sendTyping(recipientId, 'typing_off');
	}

	_sendTyping(recipientId, action) {
		const opts = {
			form: {
				recipient: {
					id: recipientId,
				},
				sender_action: action
			}
		};
		return this.api(opts);
	}

	getUserProfile(recipientId) {
		console.log('gettingg UserProfile');
		return request({
			method:'GET', 
			url: 'https://graph.facebook.com/v2.8/' + recipientId,
			json: true,
			qs: {
				fields: 'first_name,last_name,locale,timezone,gender', 
				access_token: FB_PAGE_TOKEN
			}
		})
	}
}


module.exports = new GraphAPI();

//https://www.facebook.com/ads/growth/aymt/homepage/panel/redirect/?data=%7B%22ad_account_ids%22%3A%5B10200661529474112%5D%2C%22object_ids%22%3A%5B770789176412771%2C409404772753237%5D%2C%22campaign_ids%22%3A%5B%5D%2C%22selected_ad_account_id%22%3A10200661529474112%2C%22selected_object_id%22%3A770789176412771%2C%22selected_time_range%22%3A%22%22%2C%22is_panel_collapsed%22%3A0%2C%22is_advertiser_valid%22%3A0%2C%22section%22%3A%22Object+Section%22%2C%22clicked_target%22%3A%22Selected+Object%22%2C%22event%22%3A%22click%22%7D&redirect_url=https%3A%2F%2Fwww.facebook.com%2FLife-Rhythm-770789176412771%2F%3Fref%3Daymt_homepage_panel