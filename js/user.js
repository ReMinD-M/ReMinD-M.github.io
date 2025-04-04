function getUser() {
	$.ajax({
		url: domain + '/user/fetchUserInfo',
		type: 'GET',
		xhrFields: {
			withCredentials: true
		},
		dataType: 'json',
		success: function (response) {
			if (response.code === 200) {
				const result = response.result;
				$('#username').text(result.username);
				$('#phone').val(result.phone)
				
				$('#user_avatar').show()
				$('#head_avatar').show();
				// $('#user_avatar').attr('src', result.profile);
				// $('#head_avatar').attr('src', result.profile);
				// $('#new_user_avatar').attr('src', result.profile);
				$('#new_username').val(result.username)
				$('#head_username').text(result.username);
				$('#uuid').val(result.uuid);
				const inviteStatus = result.inviteStatus;
				if (inviteStatus == 0) {
					$('.inviteStatus').show();
					$('#applyInviteButtonText').text('我的推广');
				}
				const accountIdentityType=result.accountIdentityType;
				console.log('accountIdentityType',accountIdentityType);
				if(accountIdentityType && accountIdentityType>0)
				{					
					$("#noAuthIdDiv").hide();
					$("#hasAuthIdDiv").show();
				}else{
					$("#noAuthIdDiv").show();
					$("#hasAuthIdDiv").hide();
					if(getCookieValue("center_default")=="price")
					{
						$("#selectAuthIdButton").click();
					}
					
				}
			} else {
				layer.msg("查询个人信息失败:" + response.message);
			}
		},
		error: function (xhr, status, error) {
			layer.msg('查询个人信息遇到错误：' + error);
		}
	});
}
function listPublicNotice() {
	$.ajax({
		url: domain + '/owl/listPublicNotice',
		type: 'GET',
		xhrFields: {
			withCredentials: true
		},
		dataType: 'json',
		success: function (response) {
			if (response.code === 200) {
				const notices = response.result;
				const carousel = $('#noticeCarousel');

				// 清空现有内容
				carousel.empty();

				// 创建新的轮播结构
				const carouselInner = $('<div class="carousel-inner"></div>');
				const indicators = $('<div class="carousel-indicators absolute bottom-2 left-0 right-0 flex justify-center"></div>');

				notices.forEach((notice, index) => {
					const noticeItem = $(`
						<div class="carousel-item ${index === 0 ? 'active' : ''}">
							<span class="absolute top-0 left-0 bg-red-600 text-xs px-2 py-1 rounded">公告</span>
							<h2 class="text-xl sm:text-2xl font-bold mt-10">${notice.title}</h2>
							<p class="mt-2 text-sm">${notice.createDate}</p>
						</div>
					`);

					noticeItem.on('click', function () {
						const modal = $(`
							<div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
								<div class="bg-white rounded-lg p-6 max-w-sm mx-auto w-11/12 relative">
									<button class="absolute top-2 right-2 text-gray-600 hover:text-gray-800">
										<i class="fas fa-times"></i>
									</button>
									<h2 class="text-xl font-bold mb-4">${notice.title}</h2>
									<div class="text-gray-700 overflow-y-auto max-h-60">${notice.content}</div>
								</div>
							</div>
						`);

						modal.find('button').on('click', function () {
							modal.remove();
						});

						$('body').append(modal);
					});

					carouselInner.append(noticeItem);

					const indicator = $(`<span class="carousel-indicator ${index === 0 ? 'active' : ''}" data-index="${index}"></span>`);
					indicators.append(indicator);
				});

				// 将新创建的结构添加到轮播容器中
				carousel.append(carouselInner);
				carousel.append(indicators);

				// 初始化轮播功能
				carouselInit();
			} else {
				layer.msg(response.message);
			}
		},
		error: function (xhr, status, error) {
			layer.msg('获取公告列表失败: ' + error);
		}
	});
}
function carouselInit() {
	const $carousel = $('#noticeCarousel');
	const $items = $carousel.find('.carousel-item');
	const $indicators = $carousel.find('.carousel-indicator');
	let currentIndex = 0;
	let intervalId;

	function showItem(index) {
		$items.eq(currentIndex).removeClass('active');
		$indicators.eq(currentIndex).removeClass('active');
		currentIndex = index;
		$items.eq(currentIndex).addClass('active');
		$indicators.eq(currentIndex).addClass('active');
	}

	function nextItem() {
		let nextIndex = (currentIndex + 1) % $items.length;
		showItem(nextIndex);
	}

	function startCarousel() {
		intervalId = setInterval(nextItem, 2000);
	}

	function stopCarousel() {
		clearInterval(intervalId);
	}

	function initCarousel() {
		// 点击指示器切换
		$indicators.on('click', function () {
			stopCarousel();
			showItem($(this).data('index'));
			startCarousel();
		});

		// 鼠标悬停时停止轮播，移开时继续
		$carousel.on('mouseenter', stopCarousel).on('mouseleave', startCarousel);

		// 开始自动轮播
		startCarousel();
	}

	// 在这里调用initCarousel
	initCarousel();
}

function fetchUserData() {
	$.ajax({
		url: domain + '/user/fetchUserData',
		type: 'GET',
		xhrFields: {
			withCredentials: true
		},
		dataType: 'json',
		success: function (response) {
			if (response.code === 200) {
				const result = response.result;
				$('#balance').text(result.balance);
				$('#orderNum').text(result.orderNum)
				$('#nodeNum').text(result.nodeNum)
				$('#days').text(result.days)
				$('#inviteBalance').text(result.inviteBalance);
				$('#inviteCode').text(result.inviteCode);
				$('#inviteRate').text(result.inviteRate + "%");
				$('#inviteNum').text(result.inviteNum);
				$('#pendingInviteBalance').text(result.pendingInviteBalance);
				$('#totalInviteBalance').text(result.totalInviteBalance);
			} else {
				layer.msg(response.message);
			}
		},
		error: function (xhr, status, error) {
			layer.msg('查询个人数据遇到错误');
		}
	});
}

function subscribeUrl(qrCodeElement, subscribeUrl) {
	try {
		// 检查 URL 长度
		if (subscribeUrl.length > 1000) {
			console.warn("订阅 URL 太长，使用替代方案");
			
			// 选项1：显示错误消息而不是二维码
			$(qrCodeElement).html('<div class="text-center text-red-500">二维码数据过长<br>请使用复制链接功能</div>');
			
			// 确保复制链接功能可用
			$("#copyBtn").show();
			return;
		}
		
		// 正常生成二维码（URL 长度在合理范围内）
		new QRCode(qrCodeElement, {
			text: subscribeUrl,
			width: 250,
			height: 250,
			colorDark: "#000000",
			colorLight: "#ffffff",
			correctLevel: QRCode.CorrectLevel.M  // 可以尝试 L 级别以容纳更多数据
		});
	} catch (error) {
		console.error("生成二维码出错:", error);
		$(qrCodeElement).html('<div class="text-center text-red-500">生成二维码失败<br>请使用复制链接功能</div>');
		$("#copyBtn").show();
	}
}

function showModal() {
	// 显示模态框
	const modal = document.getElementById('myModal');
	modal.classList.remove('hidden');
	modal.classList.add('flex');
}

function closeModal() {
	const modal = document.getElementById('myModal');
	modal.classList.add('hidden');
	modal.classList.remove('flex');
}

function copyToClipboard() {
	var copyText = document.getElementById('subscribeUrl').textContent;
	var $temp = $('<input>');
	$('body').append($temp);
	$temp.val(copyText).select();
	document.execCommand('copy');
	$temp.remove();
	layer.msg('复制成功');
}


function updateProfile() {
	var new_username = $('#new_username').val().trim();
	var user_avatar = $('#new_user_avatar').attr('src');
	if (!new_username) {
		layer.msg('请填写用户名。');
		return;
	}
	var maxLength = 8; // 如果包含中文字符，最大长度为4，否则为8
	if (new_username.length > maxLength) {
		layer.msg("用户名超过最大长度限制");
		return; // 阻止进一步的提交逻辑
	}
	// 构建请求数据
	var data = {
		username: new_username,
		profile: user_avatar
	};
	var index = layer.load(1, {
		shade: [0.5, '#fff']
	});
	// 发送注册请求（示例代码，根据实际API调整）
	$.ajax({
		url: domain + '/user/modifyUserInfo',
		type: 'POST',
		xhrFields: {
			withCredentials: true
		},
		contentType: 'application/json',
		data: JSON.stringify(data),
		success: function (response) {
			layer.close(index);
			if (response.code === 200) {
				layer.msg("修改成功");
				closeEditModal();
				getUser();
				layer.close(index); // 关闭当前弹出层
			} else {
				layer.msg("修改失败: " + response.message);
			}
		},
		error: function (xhr, status, error) {
			layer.msg('修改遇到错误：' + error);
			layer.close(index); // 关闭当前弹出层
		}
	});

}


//实名认证
function showSelectIdAuthModal() {
	toggleDropdown();
	// $('#new_username').val($('#username').text())
	// $('#new_user_avatar').attr('src', $('#user_avatar').attr('src'));
	// 显示模态框
	const modal = document.getElementById('selectIdAuthModal');
	modal.classList.remove('hidden');
	modal.classList.add('flex');

}
function closeSelectIdAuthModal() {
	const modal = document.getElementById('selectIdAuthModal');
	modal.classList.add('hidden');
	modal.classList.remove('flex');
}


function showAuthPersonalModal() {
 
	// $('#new_username').val($('#username').text())
	// $('#new_user_avatar').attr('src', $('#user_avatar').attr('src'));
	// 显示模态框
	const modal = document.getElementById('editAuthPersonal');
	modal.classList.remove('hidden');
	modal.classList.add('flex');

}
function closeAuthPersonalModal() {
	const modal = document.getElementById('editAuthPersonal');
	modal.classList.add('hidden');
	modal.classList.remove('flex');
}

//提交个人实名认证
function updatePersonalAuth() {
	var data={
		"images":{
			"front":"",
			"back":""
		}
	};
	$("#personalForm input").each(function(){
		id=$(this).attr('id');
		data[id]=$(this).val();
	}) ;
 
	if (!data.name) {
		layer.msg('请填写姓名。');
		return;
	}
	if (!data.idCard) {
		layer.msg('请填写身份证。');
		return;
	}
 
	 
	var index = layer.load(1, {
		shade: [0.5, '#fff']
	});
	// 发送注册请求（示例代码，根据实际API调整）
	$.ajax({
		url: domain + '/user/realNameAuthentication',
		type: 'POST',
		xhrFields: {
			withCredentials: true
		},
		contentType: 'application/json',
		data: JSON.stringify(data),
		success: function (response) {
			layer.close(index);
			if (response.code === 200) {
				layer.msg(response.message);
				closeAuthPersonalModal();
				location.reload();
				layer.close(index); // 关闭当前弹出层
			} else {
				layer.msg("修改失败: " + response.message);
			}
		},
		error: function (xhr, status, error) {
			layer.msg('修改遇到错误：' + error);
			layer.close(index); // 关闭当前弹出层
		}
	});

}

function showAuthEnterpriseModal() {
 
	// $('#new_username').val($('#username').text())
	// $('#new_user_avatar').attr('src', $('#user_avatar').attr('src'));
	// 显示模态框
	const modal = document.getElementById('editAuthEnterprise');
	modal.classList.remove('hidden');
	modal.classList.add('flex');

}
function closeAuthEnterpriseModal() {
	const modal = document.getElementById('editAuthEnterprise');
	modal.classList.add('hidden');
	modal.classList.remove('flex');
}

function updateEnterpriseAuth() {
	console.log('updateEnterpriseAuth');
	var data={
		"images":{
			"legalImages": [],
			"enterpriseImages": [],
			"Collection1Img": "",
			"Collection2Img": "",
			"Collection3Img": ""
		}
	};
	$("#enterpriseForm input").each(function(){
		id=$(this).attr('id');
		data[id]=$(this).val();
	}) ;
 
	if (!data.enterpriseName) {
		layer.msg('请填写企业名称。');
		return;
	}
	if (!data.enterpriseNo) {
		layer.msg('请填写企业代码。');
		return;
	}
	if (!data.legalName) {
		layer.msg('请填写企业法人姓名。');
		return;
	}
	 
	if (!data.legalName) {
		layer.msg('请填写企业法人身份证。');
		return;
	}

	var index = layer.load(1, {
		shade: [0.5, '#fff']
	});
	// 发送注册请求（示例代码，根据实际API调整）
	$.ajax({
		url: domain + '/user/enterpriseAuthentication',
		type: 'POST',
		xhrFields: {
			withCredentials: true
		},
		contentType: 'application/json',
		data: JSON.stringify(data),
		success: function (response) {
			layer.close(index);
			if (response.code === 200) {
				layer.msg(response.message);
				closeAuthEnterpriseModal();
				location.reload();
				layer.close(index); // 关闭当前弹出层
			} else {
				layer.msg("修改失败: " + response.message);
			}
		},
		error: function (xhr, status, error) {
			layer.msg('修改遇到错误：' + error);
			layer.close(index); // 关闭当前弹出层
		}
	});

}

function showEditProfileModal() {
	toggleDropdown();
	// $('#new_username').val($('#username').text())
	// $('#new_user_avatar').attr('src', $('#user_avatar').attr('src'));
	// 显示模态框
	const modal = document.getElementById('editProfileModal');
	modal.classList.remove('hidden');
	modal.classList.add('flex');

}

function closeEditModal() {
	const modal = document.getElementById('editProfileModal');
	modal.classList.add('hidden');
	modal.classList.remove('flex');
}


function showAvatarModal(startIndex = 1, endIndex = 10) {
	$('#avatarList').empty(); // 清空头像列表

	// 显示模态框并添加flex类以显示内容
	$('#avatarModal').removeClass('hidden').addClass('flex');

	for (let i = startIndex; i <= endIndex; i++) {
		const imgElement = $('<img>').attr('src', `https://avatar.fast-wol.online/${i}.png`)
			.addClass('w-20 h-20 m-1 cursor-pointer rounded-full')
			.click(function () {
				$('#new_user_avatar').attr('src', $(this).attr('src')); // 更新头像
				closeAvatarModal(); // 关闭模态框
			});

		$('#avatarList').append(imgElement);
	}
}

// 初始化选项卡的点击事件
function initavatarTab() {
	$('#avatarTab button').click(function () {
		// 移除所有按钮的活跃状态，然后为当前点击的按钮添加活跃状态
		$('#avatarTab button').removeClass('active');
		$(this).addClass('active');

		// 根据点击的选项卡加载不同的头像
		const index = $(this).parent().index();
		const startIndex = index * 10 + 1;
		const endIndex = startIndex + 9;
		showAvatarModal(startIndex, endIndex);
	});
	// 默认点击第一个选项卡，加载第一组头像
	$('#avatarTab button').first().click();
};

function closeAvatarModal() {
	const modal = document.getElementById('avatarModal');
	modal.classList.add('hidden');
	modal.classList.remove('flex');
}





function showChangePasswordDiv() {
	toggleDropdown();
	// 显示模态框
	const modal = document.getElementById('changePasswordDiv');
	modal.classList.remove('hidden');
	modal.classList.add('flex');
}

function closeChangePasswordDiv() {
	const modal = document.getElementById('changePasswordDiv');
	modal.classList.add('hidden');
	modal.classList.remove('flex');
}





function updatePassword() {
	var code = $('#code').val().trim();
	var password = $('#new_password').val().trim();
	if (!password) {
		layer.msg('所有字段都是必填项，请确保填写完整。');
		return;
	}
	// 构建请求数据
	var data = {
		phoneCode: code,
		password: password
	};
	var index = layer.load(1, {
		shade: [0.5, '#fff']
	});
	// 发送注册请求（示例代码，根据实际API调整）
	$.ajax({
		url: domain + '/user/modifyPassword',
		type: 'POST',
		xhrFields: {
			withCredentials: true
		},
		contentType: 'application/json',
		data: JSON.stringify(data),
		success: function (response) {
			layer.close(index);
			if (response.code === 200) {
				layer.alert('修改成功', {
					title: '提示',
					closeBtn: 0,
					anim: 1
				}, function (index) {
					parent.layer.close(layer.index);
					parent.window.location.href = '/login.html'
				});
			} else {
				layer.msg("修改失败:" + response.message);
			}
		},
		error: function (xhr, status, error) {
			layer.msg('修改遇到错误：' + error);
		}
	});
}
function notice() {
	layer.msg('您暂时没有消息')
}
//写个函数，获取当前是pc端还是移动端
function getDeviceType() {
	var userAgent = navigator.userAgent.toLowerCase();
	var windowWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;

	if (/mobile/i.test(userAgent) || windowWidth <= 768) {
		return 'mobile';
	} else {
		return 'pc';
	}
}
//判断当前是否在微信内
function isWechat() {
	var ua = navigator.userAgent.toLowerCase();
	return ua.match(/MicroMessenger/i) == "micromessenger";
}
// ----------------------------充值------------------------------------
function recharge() {
	const customAmountInput = $('#customAmount').val();
	if (!customAmountInput || customAmountInput <= 0) {
		layer.msg('请输入正确的金额。');
		return;
	}
	const deviceType = getDeviceType();
	const isWeixin = isWechat();
	console.log(isWeixin)
	// 构建请求数据
	var data = {
		amount: convertYuanToFen(customAmountInput),
		payType: 'qr_alipay',
		deviceType: deviceType
	};
	var index = layer.load(1, {
		shade: [0.5, '#fff']
	});
	$.ajax({
		url: domain + '/owl/createOrder',
		type: 'POST',
		xhrFields: {
			withCredentials: true
		},
		contentType: 'application/json',
		data: JSON.stringify(data),
		success: function (response) {
			layer.close(index);
			if (response.code === 200) {
				const result = response.result;
				const expiredMinutes = result.expiredMinutes;
				$('#orderId').val(result.outTradeNo);
				//如果是微信则跳转
				if (isWeixin) {
					window.location.href = result.payUrl;
					return;
				}
				// 立即更新倒计时显示
				updateCountdownDisplay((expiredMinutes - 1) * 60, 'payTime');
				// 打开支付模态框并显示二维码
				openPayModal(result.payUrl, customAmountInput);

				// 开始倒计时
				startCountdown(expiredMinutes, 'payTime', result.outTradeNo);

				toggleRechargeModal();
			} else {
				layer.alert("获取充值码失败:" + response.message);
			}
		},
		error: function (xhr, status, error) {
			layer.msg('获取充值码遇到错误：' + error);
		}
	});
}
function convertYuanToFen(amountInFen) {
	// 将元转换为分
	var amountInYuan = amountInFen * 100;
	return amountInYuan;
}
function toggleRechargeModal() {
	const modal = document.getElementById('rechargeModal');
	if (modal.classList.contains('hidden')) {
		// 如果当前是隐藏状态，则显示模态框
		modal.classList.remove('hidden');
		modal.classList.add('flex');
	} else {
		// 如果当前是显示状态，则隐藏模态框
		modal.classList.add('hidden');
		modal.classList.remove('flex');
	}
}
function selectAmount(amount) {
	const customAmountInput = document.getElementById('customAmount');
	customAmountInput.value = amount; // 设置输入框的值为选中的金额
}

function getPayStatus() {
	const orderId = $('#orderId').val();
	if (orderId == null) {
		return;
	}
	var index = layer.load(1, {
		shade: [0.5, '#fff']
	});
	$.ajax({
		url: domain + '/owl/getOrderPayStatus?orderId=' + orderId,
		type: 'GET',
		xhrFields: {
			withCredentials: true
		},
		dataType: 'json',
		success: function (response) {
			layer.close(index);
			if (response.code === 200) {
				const result = response.result;
				if (result == true) {
					togglePayCodeModal();
					layer.alert('充值成功', {
						closeBtn: 0,
						anim: 1
					}, function (index) {
						window.location.reload();
					});
				} else {
					layer.msg('未完成支付');
				}
			} else {
				layer.alert("获取支付状态失败:" + response.message);
			}
		},
		error: function (xhr, status, error) {
			layer.msg('获取支付状态失败' + error);
		}
	});
}



function pollingPayStatus(orderId) {
	if (orderId == null) {
		return;
	}
	$.ajax({
		url: domain + '/owl/getOrderPayStatus?orderId=' + orderId,
		type: 'GET',
		xhrFields: {
			withCredentials: true
		},
		dataType: 'json',
		success: function (response) {
			if (response.code === 200) {
				const result = response.result;
				if (result == true) {
					closeModal();
					clearInterval(countdownInterval);
					layer.alert('充值成功', {
						closeBtn: 0,
						anim: 1
					}, function (index) {
						window.location.reload();
					});
				}
			} else {
				log("获取支付状态失败:" + response.message);
			}
		},
		error: function (xhr, status, error) {
			log('获取支付状态失败' + error);
		}
	});
}
var countdownInterval;
function updateCountdownDisplay(remainingSeconds, displayElementId) {
	var minutes = Math.floor(remainingSeconds / 60);
	var seconds = 59;
	var displayText = minutes + ' 分钟 ' + seconds + ' 秒';
	$('#' + displayElementId).text(displayText);
}
function startCountdown(durationInMinutes, displayElementId, orderId) {
	var endTime = new Date().getTime() + (durationInMinutes * 60 * 1000);

	countdownInterval = setInterval(function () {
		var currentTime = new Date().getTime();
		var remainingTime = Math.floor((endTime - currentTime) / 1000);

		var minutes = Math.floor(remainingTime / 60);
		var seconds = remainingTime % 60;

		var displayText = minutes + ' 分钟 ' + seconds + ' 秒';
		$('#' + displayElementId).text(displayText);

		if (remainingTime <= 0) {
			clearInterval(countdownInterval);
			$('#' + displayElementId).text('倒计时结束');
			togglePayCodeModal();
		}

		// 每3秒调用一次 pollingPayStatus 函数
		if (remainingTime > 0 && remainingTime % 3 === 0) {
			pollingPayStatus(orderId);
		}
	}, 1000); // 每秒更新一次
}
function togglePayCodeModal() {
	var modal = $('#payCodeModal');
	if (modal.hasClass('hidden')) {
		modal.removeClass('hidden');
	} else {
		modal.addClass('hidden');
		$('#payTime').text('');
		$('#customAmount').val('');
		clearInterval(countdownInterval);
	}
}
function openPayModal(content, customAmount) {
	$('#payAmount').text('￥' + customAmount);
	const qrContainer = document.getElementById('pay_qrcode_modal');
	qrContainer.innerHTML = ''; // 清空容器

	// 设置容器尺寸
	qrContainer.style.width = '150px';
	qrContainer.style.height = '150px';

	// 创建图片元素
	const qrImg = document.createElement('img');
	qrImg.style.width = '100%';
	qrImg.style.height = '100%';

	// 生成二维码
	new QRCode(qrContainer, {
		text: content,
		width: 150,
		height: 150,
		colorDark: "#000000",
		colorLight: "#ffffff",
		correctLevel: QRCode.CorrectLevel.H
	});

	// 确保二维码图像适应容器
	setTimeout(() => {
		const qrImg = qrContainer.querySelector('img');
		if (qrImg) {
			qrImg.style.width = '100%';
			qrImg.style.height = '100%';
		}
	}, 0);
	// 设置图片源为Base64数据
	// qrImg.src = content.startsWith('data:image') ? content : 'data:image/png;base64,' + content;
	// 将图片添加到容器
	//  qrContainer.appendChild(qrImg);

	togglePayCodeModal();
}

// ---------------------------------------------------------------------邀请管理------------------------------------------------------------------------------------------------------

function showInvite() {

}

function toggleInviteQrModal() {
	var modal = $('#inviteQrModal');
	if (modal.hasClass('hidden')) {
		modal.removeClass('hidden');
	} else {
		modal.addClass('hidden');
	}
}
function getInviteUrl() {
	var protocol = window.location.protocol; // "http:" 或 "https:"
	var domain = window.location.hostname;  // 域名
	var port = window.location.port;        // 端口号（如 "8080"），如果没有则为空字符串
	var fullUrl = protocol + "//" + domain + (port ? ":" + port : "");
	console.log("完整的URL是: " + fullUrl);
	return fullUrl + "/register?code=" + $('#inviteCode').text();
}
function showInviteQrCode() {
	var url = getInviteUrl();
	$('#invite_qrcode_modal').text('')
	// 生成二维码
	const qrContainer = document.getElementById('invite_qrcode_modal');
	qrContainer.innerHTML = ''; // 清空容器

	// 设置容器尺寸
	qrContainer.style.width = '150px';
	qrContainer.style.height = '150px';

	// 生成二维码
	new QRCode(qrContainer, {
		text: url,
		width: 150,
		height: 150,
		colorDark: "#000000",
		colorLight: "#ffffff",
		correctLevel: QRCode.CorrectLevel.H
	});

	// 确保二维码图像适应容器
	setTimeout(() => {
		const qrImg = qrContainer.querySelector('img');
		if (qrImg) {
			qrImg.style.width = '100%';
			qrImg.style.height = '100%';
		}
	}, 0);
	toggleInviteQrModal();
}
function copyInviteCode() {
	var url = getInviteUrl();
	var copyText = url;
	var $temp = $('<input>');
	$('body').append($temp);
	$temp.val(copyText).select();
	document.execCommand('copy');
	$temp.remove();
	layer.msg('复制成功');
}
//-------------------------------------------------------佣金提现---------------------------------------------
function toggleInviteBalanceButtonModal() {
	var modal = $('#inviteBalanceModal');
	if (modal.hasClass('hidden')) {
		modal.removeClass('hidden');
	} else {
		modal.addClass('hidden');
	}
}
function toggleTransferModalModal() {
	toggleInviteBalanceButtonModal();
	var modal = $('#transferModal');
	if (modal.hasClass('hidden')) {
		modal.removeClass('hidden');
	} else {
		modal.addClass('hidden');
	}
}
function toggleWithdrawModalModal() {
	toggleInviteBalanceButtonModal();
	var modal = $('#withdrawModal');
	if (modal.hasClass('hidden')) {
		modal.removeClass('hidden');
	} else {
		modal.addClass('hidden');
	}
}
function transfer() {
	const transferAmount = $('#transferAmount').val();
	if (!transferAmount || transferAmount == null || transferAmount <= 0) {
		layer.msg('请输入正确的金额');
		return;
	}
	$("#transferButton").prop("disabled", true);
	// 构建请求数据
	var data = {
		transferAmount: transferAmount
	};
	var index = layer.load(1, {
		shade: [0.5, '#fff']
	});
	$.ajax({
		url: domain + '/user/inviteBalanceToBalance',
		type: 'POST',
		xhrFields: {
			withCredentials: true
		},
		contentType: 'application/json',
		data: JSON.stringify(data),
		success: function (response) {
			layer.close(index);
			if (response.code === 200) {
				layer.msg('划转成功');
				//延时一秒种刷新页面
				setTimeout(function () {
					window.location.reload();
				}, 1000);
			} else {
				layer.msg(response.message);
			}
		},
		error: function (xhr, status, error) {
			layer.msg('划转遇到错误：' + error);
		}, complete: function () {
			// $("#transferButton").prop("disabled", false);
		}
	});
}
function withdraw() {
	// const withdrawAmount = $('#withdrawAmount').val();
	// if (!withdrawAmount || withdrawAmount == null || withdrawAmount <= 0) {
	// 	layer.msg('请输入正确的金额');
	// 	return;
	// }
	var withdrawMethod = $('#withdrawMethod').val();
	if (!withdrawMethod || withdrawMethod == null) {
		layer.msg('请选择提现方式');
		return;
	}
	var withdrawAccount = $('#withdrawAccount').val();
	if (!withdrawAccount || withdrawAccount == null) {
		layer.msg('请输入提现账号');
		return;
	}
	$("#withdrawButton").prop("disabled", true);
	// 构建请求数据
	var data = {
		// withdrawAmount: withdrawAmount,
		withdrawMethod: withdrawMethod,
		withdrawAccount: withdrawAccount
	};
	var index = layer.load(1, {
		shade: [0.5, '#fff']
	});
	$.ajax({
		url: domain + '/user/withdraw',
		type: 'POST',
		xhrFields: {
			withCredentials: true
		},
		contentType: 'application/json',
		data: JSON.stringify(data),
		success: function (response) {
			layer.close(index);
			if (response.code === 200) {
				layer.msg('提现成功');
				//延时一秒种刷新页面
				setTimeout(function () {
					window.location.reload();
				}, 1000);
			} else {
				layer.msg(response.message);
			}
		},
		error: function (xhr, status, error) {
			layer.msg('提现遇到错误：' + error);
		}, complete: function () {
			// $("#withdrawButton").prop("disabled", false);
		}
	});
}

function toggleDropdown() {
	var modal = $('#dropdown');
	if (modal.hasClass('hidden')) {
		modal.removeClass('hidden');
	} else {
		modal.addClass('hidden');
	}
}

//-------------------------------------------------------申请推广---------------------------------------------
function toggleApplyPromotionModal() {
	var modal = $('#applyPromotionModal');
	if (modal.hasClass('hidden')) {
		modal.removeClass('hidden');
	} else {
		modal.addClass('hidden');
	}
}
function applyPromotion() {

	// var promotionName = $('#promotionName').val();
	// var promotionIdCard = $('#promotionIdCard').val();

	// var promotionPhone = $('#promotionPhone').val();
	var promotionWechat = $('#promotionWechat').val();
	var promotionCompany = $('#promotionCompany').val();

	if (!promotionWechat || !promotionCompany) {
		layer.msg('请填写完整信息');
		return;
	}
	// if (!/^1[3-9]\d{9}$/.test(promotionPhone)) {
	// 	layer.msg('请输入正确的手机号码格式');
	// 	return;
	// }
	// if (!/^[1-9]\d{5}(19|20)\d{2}(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01])\d{3}[\dX]$/.test(promotionIdCard)) {
	// 	layer.msg('请输入正确的身份证号格式');
	// 	return;
	// }
	var index = layer.load(1, {
		shade: [0.5, '#fff']
	});
	var data = {
		wechat: promotionWechat,
		companyName: promotionCompany
	};
	$.ajax({
		url: domain + '/owl/applyInvite',
		type: 'POST',
		data: JSON.stringify(data),
		xhrFields: {
			withCredentials: true
		},
		contentType: 'application/json',
		success: function (response) {
			layer.close(index);
			if (response.code === 200) {
				layer.msg('已提交申请,请等待审核...');
				toggleApplyPromotionModal();
				setTimeout(function () {
					window.location.reload();
				}, 1000);
			} else {
				layer.msg(response.message);
			}
		},
		error: function (xhr, status, error) {
			layer.msg('申请推广遇到错误：' + error);
		}
	});
}
function getApplyInviteInfo() {
	var index = layer.load(1, {
		shade: [0.5, '#fff']
	});
	$.ajax({
		url: domain + '/owl/getApplyInviteInfo',
		type: 'GET',
		xhrFields: {
			withCredentials: true
		},
		contentType: 'application/json',
		success: function (response) {
			layer.close(index);
			if (response.code === 200) {
				var result = response.result;
				if (result) {
					// $('#promotionName').val(result.memberName);
					// $('#promotionIdCard').val(result.idCard);
					// $('#promotionPhone').val(result.phoneNumber);
					$('#promotionWechat').val(result.wechat);
					$('#promotionCompany').val(result.companyName);
					var reason = result.rejectedReason;
					if (reason) {
						$('#promotionReason').text("原因：" + reason);
						$('#promotionReason').show();
					}
					const auditStatus = result.auditStatus;
					// 根据申请状态禁用或启用输入框
					var isDisabled = auditStatus === 'approved' || auditStatus === 'pending' || auditStatus === 'pause';
					// $('#promotionName, #promotionIdCard, #promotionPhone, #promotionCompany').prop('disabled', isDisabled);
					$('#promotionWechat, #promotionCompany').prop('disabled', isDisabled);
					$('#applyPromotionButton').prop('disabled', isDisabled);

					// 显示申请状态
					var statusText = '';
					switch (result.auditStatus) {
						case "pending":
							statusText = '审核中，请等待审核...';
							break;
						case "approved":
							statusText = '已通过';
							break;
						case "rejected":
							statusText = '申请被拒绝，重新申请';
							break;
						case "pause":
							statusText = '已暂停推广';
							break;
						default:
							statusText = '申请';
					}
					$('#applyPromotionButton').text(statusText);
				}
				toggleApplyPromotionModal();
			} else {
				layer.msg(response.message);
			}
		},
		error: function (xhr, status, error) {
			layer.close(index);
			layer.msg('获取申请信息遇到错误：' + error);
		}
	});
}

