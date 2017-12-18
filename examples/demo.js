const linebot = require('../index.js');
const sql = require('mssql');

const sqlConfig = {
	user: 'sa',
	password: 'P@ssw0rd',
	server: 'localhost',
	database: 'AskmeLineChatBot'
}

const bot = linebot({
	channelId: process.env.CHANNEL_ID,
	channelSecret: process.env.CHANNEL_SECRET,
	channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN,
	verify: true // default=true
});

function show(data) {
	return event.reply({
		type: "template",
		altText: "this is a carousel template",
		template: {
			type: "carousel",
			columns: data,
			imageAspectRatio: "rectangle",
			imageSize: "cover"
		}
	});
}


bot.on('message', function (event) {
	switch (event.message.type) {
		case 'text':
			switch (event.message.text) {
				case 'Menu':
					event.source.profile().then(function (profile) {
						var Id = profile.userId;
						var name = profile.displayName;
						// console.log('Save success', Id);
						// event.reply('Hello ' + profile.displayName + ' ' + profile.userId);
						event.reply({
							type: 'template',
							altText: ' Welcome to Askme Line Chat Bot ',
							template: {
								type: 'buttons',
								// thumbnailImageUrl: 'https://example.com/bot/images/image.jpg',
								title: 'Menu',
								text: 'Hello ' + name + ' Please choose our services',
								actions: [{
									type: 'postback',
									label: 'Product',
									data: Id,
									text: 'product'
								}, {
									type: 'postback',
									label: 'Support',
									data: 'support',
									text: 'support'
								}, {
									type: 'postback',
									label: 'Contact',
									data: 'contact',
									text: 'contact'
								}, {
									type: 'postback',
									label: 'Exit',
									data: 'exit',
									text: 'exit'
								}, ]
							}
						});

					});
					break;

				case 'product':
					event.source.profile().then(function (profile) {
						var Id = profile.userId;
						sql.connect(sqlConfig, function () {
							var request = new sql.Request();
							request.query("SELECT productName,productPictureURL  FROM [AskmeLineChatBot].[dbo].[UserAndProduct] INNER JOIN [AskmeLineChatBot].[dbo].[Product] ON Product.Id = UserAndProduct.productId WHERE userId = '" + Id + "'", function (err, result) {
								if (err) {
									console.log(err)
								} else {
									var rs = "";
									for (var i = 0; i < result.recordsets[0].length; i++) {
										var finalResult = '{ thumbnailImageUrl : "' + result.recordsets[0][i].productPictureURL + '", imageBackgroundColor : "#FFFFFF", title : "' + result.recordsets[0][i].productName + '", actions : [{ type: "postback", label: "Open Case", data: "opencase"}, {type: "postback", label: "Exit" ,data: "exit"}] },'
										rs = finalResult + rs;
									}
									var x = '[' + rs + ']';
									console.log(x);
									show(x);
									// show(x);
									console.log(show(x));
								}
								sql.close();
							});
						});
					});

					function show(callback) {

					}
					break;
				case 'exit':
					return event.reply(
						'Thank you for use our line service. If you need to use our service again please type "Menu" '
					);
					break;
				case 'aboutus':
					event.reply({
						type: 'image',
						originalContentUrl: 'https://d.line-scdn.net/stf/line-lp/family/en-US/190X190_line_me.png',
						previewImageUrl: 'https://d.line-scdn.net/stf/line-lp/family/en-US/190X190_line_me.png'
					});
				case 'Picture':
					event.reply({
						type: 'image',
						originalContentUrl: 'https://d.line-scdn.net/stf/line-lp/family/en-US/190X190_line_me.png',
						previewImageUrl: 'https://d.line-scdn.net/stf/line-lp/family/en-US/190X190_line_me.png'
					});
					break;
				case 'Location':
					event.reply({
						type: 'location',
						title: 'LINE Plus Corporation',
						address: '1 Empire tower, Sathorn, Bangkok 10120, Thailand',
						latitude: 13.7202068,
						longitude: 100.5298698
					});
					break;
				case 'Push':
					bot.push('U226cd3eaba9383d27cc67c34a2ad78e7', ['Hey!', 'สวัสดี ' + String.fromCharCode(0xD83D, 0xDE01)]);
					break;
				case 'Push2':
					bot.push(['U6350b7606935db981705282747c82ee1', 'U6350b7606935db981705282747c82ee1'], ['Hey!', 'สวัสดี ' + String.fromCharCode(0xD83D, 0xDE01)]);
					break;
				case 'Multicast':
					bot.push(['U6350b7606935db981705282747c82ee1', 'U6350b7606935db981705282747c82ee1'], 'Multicast!');
					break;
				case 'Confirm':
					event.reply({
						type: 'template',
						altText: 'this is a confirm template',
						template: {
							type: 'confirm',
							text: 'Are you sure?',
							actions: [{
								type: 'message',
								label: 'Yes',
								text: 'yes'
							}, {
								type: 'message',
								label: 'No',
								text: 'no'
							}]
						}
					});
				case 'cc':
					event.reply({
						"type": "template",
						"altText": "this is a carousel template",
						"template": {
							"type": "carousel",
							"columns": [{
									"thumbnailImageUrl": "https://example.com/bot/images/item1.jpg",
									"imageBackgroundColor": "#FFFFFF",
									"title": "this is menu",
									"text": "description",
									"actions": [{
											"type": "postback",
											"label": "Buy",
											"data": "action=buy&itemid=111"
										},
										{
											"type": "postback",
											"label": "Add to cart",
											"data": "action=add&itemid=111"
										},
										{
											"type": "uri",
											"label": "View detail",
											"uri": "http://example.com/page/111"
										}
									]
								},
								{
									"thumbnailImageUrl": "https://example.com/bot/images/item2.jpg",
									"imageBackgroundColor": "#000000",
									"title": "this is menu",
									"text": "description",
									"actions": [{
											"type": "postback",
											"label": "Buy",
											"data": "action=buy&itemid=222"
										},
										{
											"type": "postback",
											"label": "Add to cart",
											"data": "action=add&itemid=222"
										},
										{
											"type": "uri",
											"label": "View detail",
											"uri": "http://example.com/page/222"
										}
									]
								}
							],
							"imageAspectRatio": "rectangle",
							"imageSize": "cover"
						}
					});
					break;
				case 'Temp':
					event.reply({
						type: 'template',
						altText: 'this is a buttons template',
						template: {
							type: 'buttons',
							thumbnailImageUrl: 'https://example.com/bot/images/image.jpg',
							title: 'Menu',
							text: 'Please select',
							actions: [{
								type: 'postback',
								label: 'Buy',
								data: 'Temp',
								text: 'Temp'
							}, {
								type: 'postback',
								label: 'Add to cart',
								data: 'action=add&itemid=123'
							}, {
								type: 'uri',
								label: 'View detail',
								uri: 'http://example.com/page/123'
							}, ]
						}
					});
					break;
				case 'Multiple':
					return event.reply(['Line 1', 'Line 2', 'Line 3', 'Line 4', 'Line 5']);
					break;
				case 'Version':
					event.reply('linebot@' + require('../package.json').version);
					break;
				default:
					event.reply(event.message.text).then(function (data) {
						console.log('Success', data);
					}).catch(function (error) {
						console.log('Error', error);
					});
					break;
			}

			break;
		case 'image':
			event.message.content().then(function (data) {
				const s = data.toString('base64').substring(0, 30);
				return event.reply('Nice picture! ' + s);
			}).catch(function (err) {
				return event.reply(err.toString());
			});
			break;
		case 'video':
			event.reply('Nice movie!');
			break;
		case 'audio':
			event.reply('Nice song!');
			break;
		case 'location':
			event.reply(['That\'s a good location!', 'Lat:' + event.message.latitude, 'Long:' + event.message.longitude]);
			break;
		case 'sticker':
			event.reply({
				type: 'sticker',
				packageId: 1,
				stickerId: 1
			});
			break;
		default:
			event.reply('Unknow message: ' + JSON.stringify(event));
			break;
	}
});

bot.on('follow', function (event) {
	event.reply('follow: ' + event.source.userId);
});

bot.on('unfollow', function (event) {
	event.reply('unfollow: ' + event.source.userId);
});

bot.on('join', function (event) {
	event.reply('join: ' + event.source.groupId);
});

bot.on('leave', function (event) {
	event.reply('leave: ' + event.source.groupId);
});

bot.on('postback', function (event) {
	// event.reply('postback: ' + event.postback.data);
});

bot.on('beacon', function (event) {
	event.reply('beacon: ' + event.beacon.hwid);
});

bot.listen('/linewebhook', process.env.PORT || 80, function () {
	console.log('LineBot is running.');
});
