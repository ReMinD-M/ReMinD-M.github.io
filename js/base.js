document.addEventListener('DOMContentLoaded', function () {
	initSiteTitle();
	var currentYear = new Date().getFullYear();
	$('#copyright-year').text(`Copyright © ${currentYear} All rights Reserved`);
});
function initSiteTitle() {
	var siteTitle = getCookieValue("siteTitle");
	if (siteTitle && siteTitle !== '') {
		if (siteTitle != 'default') {
			$(".site-title").text(siteTitle);
			document.title = siteTitle;
		}
	} else {
		getSiteTitle();
	}
}
$(document).ready(function () {

	var currentUrl = window.location.href;
	var sessionToken = getCookieValue('session_token');

	verifyToken(sessionToken, currentUrl);

	function verifyToken(token, url) {
		if (!token) {
			redirectToLoginIfNecessary(url);
			return;
		}

		var data = {
			token: token,
			loginType: "WEB"
		};
		$.ajax({
			url: domain + '/auth/verifyToken',
			type: 'POST',
			contentType: 'application/json',
			data: JSON.stringify(data),
			success: function (response) {
				if (response.code === 200) {
					redirectToCenterIfNecessary(url);
				} else {
					deleteCookie('session_token');
					redirectToLoginIfNecessary(url);
				}
			},
			error: function (xhr, status, error) {
				console.log('验证遇到错误：' + error);
			}
		});
	}


});

function redirectToLoginIfNecessary(url) {
	if (!url.includes('login') && !url.includes('register')) {
		window.location.href = "/login.html";
	}
}

function redirectToCenterIfNecessary(url) {
	if (url.includes('login') || url.includes('register')) {
		deviceRoute();
	}
}
function setCookie(name, value, days) {
	var expires = "";
	if (days) {
		var date = new Date();
		date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
		expires = "; expires=" + date.toUTCString();
	}
	document.cookie = name + "=" + (value || "") + expires + "; path=/";
}

function logout() {
	deleteCookie('session_token');
	window.location.href = "/login.html";
}

function deleteCookie(name) {
	document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/';
}

function getCookieValue(name) {
	let nameString = name + "=";
	let value = null;
	document.cookie.split(';').forEach(function (cookie) {
		cookie = cookie.trim();
		if (cookie.indexOf(nameString) == 0) {
			value = cookie.substring(nameString.length, cookie.length);
		}
	});
	return value;
}
$.ajaxSetup({
	beforeSend: function (xhr) {
		xhr.setRequestHeader('Authorization', 'Bearer ' + getCookieValue('session_token'));
		xhr.setRequestHeader('loginType', 'WEB');
	}
});
$(document).ajaxSuccess(function (event, xhr, settings) {
	// 检查HTTP状态码
	if (xhr.status === 401) {
		// 如果状态码是401，跳转到登录页面
		redirectToLoginIfNecessary(window.location.href);
		return;
	}
	
	// 检查响应内容是否为JSON格式
	if (xhr.getResponseHeader("content-type") && xhr.getResponseHeader("content-type").indexOf("application/json") !== -1) {
		try {
			var response = JSON.parse(xhr.responseText);
			if (response.code === 401) {
				// 如果code是401，跳转到登录页面
				redirectToLoginIfNecessary(window.location.href);
			}
		} catch (e) {
			console.error('解析JSON响应时出错', e);
		}
	}
});

function getSiteTitle() {
	$.ajax({
		url: domain + '/owl/getSiteTitle?_=' + new Date().getTime(),
		type: 'GET',
		cache: false,
		xhrFields: {
			withCredentials: true
		},
		dataType: 'json',
		success: function (response) {
			if (response.code === 200) {
				const result = response.result;
				const siteTitle = result.siteTitle;
				setCookie("siteTitle", siteTitle, 1);
				initSiteTitle();
			} else {
				layer.msg(response.message);
			}
		},
		error: function (xhr, status, error) {
			console.log('查询title遇到错误');
		}
	});
}

function getInviteStatus() {
	$.ajax({
		url: domain + '/owl/getInviteStatus?_=' + new Date().getTime(),
		type: 'GET',
		cache: false,
		xhrFields: {
			withCredentials: true
		},
		dataType: 'json',
		success: function (response) {
			if (response.code === 200) {
				const inviteStatus = response.result;
				if (!inviteStatus) {
					$('.applyInviteButton').show();
				}
			} else {
				layer.msg(response.message);
			}
		},
		error: function (xhr, status, error) {
			console.log('查询邀请开关遇到错误');
		}
	});
}

function getUseTutorialLink() {
	$.ajax({
		url: domain + '/owl/getUseTutorialLink?_=' + new Date().getTime(),
		type: 'GET',
		cache: false,
		xhrFields: {
			withCredentials: true
		},
		dataType: 'json',
		success: function (response) {
			if (response.code === 200) {
				const useTutorialLink = response.result;
				if (useTutorialLink) {
					// 设置所有.useTutorialLink元素点击事件
					$('.useTutorialLink').on('click', function (e) {
						e.preventDefault(); // 阻止默认行为
						window.open(useTutorialLink, '_blank'); // 在新标签页中打开链接
					});
				}
			} else {
				layer.msg(response.message);
			}
		},
		error: function (xhr, status, error) {
			console.log('查询UseTutorialLink遇到错误');
		}
	});
}
function getIdShareUrl() {
	$.ajax({
		url: domain + '/owl/getIdShareUrl?_=' + new Date().getTime(),
		type: 'GET',
		cache: false,
		xhrFields: {
			withCredentials: true
		},
		dataType: 'json',
		success: function (response) {
			if (response.code === 200) {
				const idShareUrl = response.result;
				if (idShareUrl) {
					$('.idShareUrl').on('click', function (e) {
						e.preventDefault(); // 阻止默认行为
						window.open(idShareUrl, '_blank'); // 在新标签页中打开链接
					});
				}
			} else {
				layer.msg(response.message);
			}
		},
		error: function (xhr, status, error) {
			console.log('查询IdShareUrl遇到错误');
		}
	});
}
function getSubscribeUrlName() {
	$.ajax({
		url: domain + '/owl/getSubscribeUrlName',
		type: 'GET',
		cache: false,
		xhrFields: {
			withCredentials: true
		},
		dataType: 'json',
		success: function (response) {
			if (response.code === 200) {
				const name = response.result;
				if (name) {
					$('#subscribeUrlName').val(name);
				}
			} else {
				layer.msg(response.message);
			}
		},
		error: function (xhr, status, error) {
			console.log('查询SubscribeUrlName遇到错误');
		}
	});
}
function getUrlParam(name) {
	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
	var r = window.location.search.substr(1).match(reg); //匹配目标参数
	if (r != null) return unescape(r[2]);
	return null; //返回参数值
}
function deviceRoute() {
	if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth <= 768 || (window.matchMedia && window.matchMedia('(max-device-width: 768px)').matches)) {
		window.location.href = "/mobile/center.html";
	} else {
		window.location.href = "/center.html";
	}
}

// 添加全局实时监听
function checkDeviceAndRedirect() {
	if (window.location.pathname.endsWith('center') || window.location.pathname.endsWith('center.html')) {
		if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth <= 768 || (window.matchMedia && window.matchMedia('(max-device-width: 768px)').matches)) {
			if (!window.location.pathname.includes('mobile/')) {
				window.location.href = "mobile/center.html";
			}
		}else{
			console.log('pc');
			if (window.location.pathname.includes('mobile/')) {
				deviceRoute();
			}
		}
	}
}

// 页面加载时检查
window.addEventListener('load', checkDeviceAndRedirect);

// 窗口大小改变时检查
window.addEventListener('resize', checkDeviceAndRedirect);

