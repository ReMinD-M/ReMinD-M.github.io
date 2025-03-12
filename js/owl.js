$(document).ready(function () {
	$('#sendCode').click(handleSendCode);
	$('#register').click(handleRegister);
	$('#login_button').click(handleLogin);
});

function handleRegister(event) {
	event.preventDefault();

	// var username = $('#username').val().trim();
	var email = $('#email').val().trim();
	var code = $('#code').val().trim();
	var password = $('#password').val().trim();
	var inviteCode = $('#inviteCode').val().trim();
	if (!email || !password) {
		layer.msg('所有字段都是必填项，请确保填写完整。');
		return;
	}
	var username = email;
	register(username, email, code, password, inviteCode);
}



function handleLogin(event) {
	event.preventDefault();

	var email = $('#login_email').val().trim();
	var password = $('#login_password').val().trim();

	if (!email || !password) {
		layer.msg('所有字段都是必填项，请确保填写完整。');
		return;
	}
	if (!validateEmail(email)) {
		layer.msg('邮箱格式不正确');
		return;
	}	
	setLoginInfo(email, password);
	login(email, password);
}
function setLoginInfo(email, password) {
	var remember_password = $('#remember_password').is(':checked');
	if (remember_password) {
		var loginInfo = {
			remember_password: "true",
			email: email,
			password: btoa(password)
		};
		setCookie("remember", JSON.stringify(loginInfo), 365);
	} else {
		deleteCookie("remember");
	}
}
//写一个函数，获取cookie中的loginInfo,如果loginInfo存在，则将email和password填充到表单中
function getLoginInfo() {
	var loginInfo = getCookieValue("remember");
	if (loginInfo) {
		loginInfo = JSON.parse(loginInfo);
		$('#login_email').val(loginInfo.email);
		$('#login_password').val(atob(loginInfo.password));
		$('#remember_password').prop('checked', true);
	}
}



function validateEmail(email) {
	var re =
		/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@(([^<>()[\]\.,;:\s@"]+\.[^<>()[\]\.,;:\s@"]{2,}))$/i;
	return re.test(email);
}


function register(username, email, code, password, inviteCode) {
	// 构建请求数据
	var data = {
		username: username,
		email: email,
		emailCode: code,
		password: password,
		inviteCode: inviteCode
	};
	var index = layer.load(1, {
		shade: [0.5, '#fff']
	});
	// 发送注册请求（示例代码，根据实际API调整）
	$.ajax({
		url: domain + '/auth/register',
		type: 'POST',
		contentType: 'application/json',
		data: JSON.stringify(data),
		success: function (response) {
			layer.close(index);
			if (response.code === 200) {
				// 显示Layer提示框
				layer.alert('注册成功', {
					title: '提示',
					closeBtn: 0,
					anim: 1 // 动画类型
				}, function (index) {
					// 点击确定按钮后的回调函数
					window.location.href = '/login.html'
					layer.close(index); // 关闭当前弹出层
				});
			} else {
				layer.alert(response.message);
			}
		},
		error: function (xhr, status, error) {
			layer.msg('注册遇到错误：' + error);
		}
	});
}

function handleSendCode(event) {
	event.preventDefault();

	if (this.classList.contains('disabled')) {
		return;
	}

	var email = $('#email').val().trim();
	if (!email) {
		layer.msg('请输入邮箱');
		return;
	}

	if (!validateEmail(email)) {
		layer.msg('邮箱格式不正确');
		return;
	}

	var seconds = 60;
	var originalText = this.textContent;
	var btn = this;
	btn.classList.add('disabled'); // 添加`disabled`类

	var intervalId = setInterval(function () {
		if (seconds <= 0) {
			clearInterval(intervalId);
			btn.textContent = originalText;
			btn.classList.remove('disabled'); // 移除`disabled`类，允许再次点击
		} else {
			btn.textContent = `${seconds--}s`;
		}
	}, 1000);

	sendCode(email, btn, originalText, intervalId);
}

function sendCode(email, btn, originalText, intervalId) {
	var data = {
		"email": email
	};
	console.log(data);
	// 发送注册请求（示例代码，根据实际API调整）
	$.ajax({
		url: domain + '/auth/sendEmailCode',
		type: 'POST',
		contentType: 'application/json',
		data: JSON.stringify(data),
		success: function (response) {
			if (response.code != 200) {
				layer.msg(response.message);
				// 恢复按钮为正常状态
				clearInterval(intervalId);
				btn.textContent = originalText;
				btn.classList.remove('disabled');
			} else {
				layer.msg('发送成功');
			}
		},
		error: function (xhr, status, error) {
			layer.msg('发送遇到错误：' + error);
			// 恢复按钮为正常状态
			clearInterval(intervalId);
			btn.textContent = originalText;
			btn.classList.remove('disabled');
		}
	});
}



function validateEmail(email) {
	var emailReg = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
	return emailReg.test(email);

}

function login(email, password) {
	// 构建请求数据
	var data = {
		email: email,
		password: password,
		loginType: "WEB"
	};
	// 显示加载动画
	var index = layer.load(1, {
		shade: [0.5, '#fff'], // 背景遮罩的颜色和透明度
		content: '', // 由于layer.load本身不支持直接显示文本，我们可以结合使用layer.msg或其他方式来达到预期效果
		success: function (layero) {
			layero.find('.layui-layer-content').css({
				'width': '200px',
				'backgroundPositionX': 'center',
				'color': 'red',
				'fontWeight': 'bold'
			}).text('');
		}
	});
	// 发送注册请求（示例代码，根据实际API调整）
	$.ajax({
		url: domain + '/auth/login',
		type: 'POST',
		xhrFields: {
			withCredentials: true
		},
		contentType: 'application/json',
		data: JSON.stringify(data),
		success: function (response) {
			if (response.code === 200) {
				setCookie("session_token", response.result.token, 7)
				deviceRoute();
			} else {
				layer.alert(response.message);
			}
		},
		error: function (xhr, status, error) {
			layer.msg('登录遇到错误：' + error);
		},
		complete: function () {
			// 关闭加载指示器
			layer.close(index);
		}
	});
}