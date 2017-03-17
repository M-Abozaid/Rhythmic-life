'use strict';

const request = require('request-promise');
const config = require('./config')
const FB_PAGE_TOKEN = 'EAAGCwOXSeYsBAII8O2PpPLM2kVNv80Ge78FR1tuima9fJdzTI5RGufCqBmqN4aICPMN9ZCENFhomY3EOZBdqZBZAVOFzYwvvw2ZA2GanvVVNOPcxAbBAO3HR5ztoV9z2L4hZBPkjUIYKkxTdZC6DgFvcGJZAL28Ftxrha60fge5pOwZDZD';
const Q = require('q');
const _ = require('lodash');

class GraphAPI {
	constructor() {
		this.api = request.defaults({
			uri: 'https://graph.facebook.com/v2.6/me/messages',
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