// 处理排序的函数
window.handleSort = function(element, field) {
	console.log("排序被点击:", field);
	
	// 初始化sortState如果不存在
	window.sortState = window.sortState || { field: '', order: '' };
	
	// 确定排序方向
	let order = '';
	if (window.sortState.field === field) {
		// 切换排序方向
		order = window.sortState.order === 'asc' ? 'desc' : 'asc';
	} else {
		// 默认降序 - 最新的时间在前面
		order = 'desc';
	}
	
	console.log(`排序: 字段=${field} 顺序=${order}`);
	
	// 更新全局排序状态
	window.sortState.field = field;
	window.sortState.order = order;
	
	// 更新表头排序指示器
	document.querySelectorAll('.sortable').forEach(el => {
		el.classList.remove('asc', 'desc');
	});
	element.classList.add(order);
	
	// 确定当前是哪个表格
	const isCurrent = element.closest('#current_list') !== null;
	
	// 重新获取数据
	getOrderList(isCurrent, field, order);
};

$(document).ready(function () {
	$('#current').click(function () {
		updateSelectedState(true);
		current_order();
	});
	$('#old').click(function () {
		updateSelectedState(false);
		old_order();
	});
});

function updateSelectedState(isCurrent) {
	if (isCurrent) {
		$('#current').addClass('selected').siblings().removeClass('selected');
	} else {
		$('#old').addClass('selected').siblings().removeClass('selected');
	}
}

function current_order() {
	getOrderList(true, window.sortState?.field || '', window.sortState?.order || '');
}

function old_order() {
	getOrderList(false, window.sortState?.field || '', window.sortState?.order || '');
}

// fetchOrder 函数保持不变

// 计算剩余天数的函数
function calculateRemainingDays(expirationDateStr) {
	// 解析到期日期字符串为日期对象
	const dateParts = expirationDateStr.split('-');
	if (dateParts.length !== 3) return -1; // 格式无效
	
	const year = parseInt(dateParts[0]);
	const month = parseInt(dateParts[1]) - 1; // 月份从0开始计数
	const day = parseInt(dateParts[2]);
	
	const expirationDate = new Date(year, month, day);
	const today = new Date();
	
	// 重置时间部分以确保比较准确
	today.setHours(0, 0, 0, 0);
	expirationDate.setHours(0, 0, 0, 0);
	
	// 计算剩余毫秒数并转换为天数
	const diffTime = expirationDate - today;
	const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
	
	return diffDays;
}

function getOrderList(current, sortField, sortOrder) {
	var url = domain + (current ? "/owl/findCurrentSubscribe" : "/owl/findOldSubscribe");
	
	// 如果有排序参数，添加到URL
	if (sortField && sortOrder) {
		console.log("添加排序参数:", sortField, sortOrder);
		url += "?order=" + sortField + "&type=" + sortOrder;
	}
	
	// console.log("请求URL:", url);
	var index = layer.load(1, {
		shade: 0
	});
	$.ajax({
		url: url,
		type: 'GET',
		xhrFields: {
			withCredentials: true
		},
		dataType: 'json',
		success: function (data) {
			var rows = '';
			if (data.code === 200) {
				const result = data.result;
				if (result.length === 0) {
					rows += `<tr class="bg-white border-b">
					     <th colspan=10 scope="row" class="px-4 py-4 font-medium text-gray-900 whitespace-nowrap" style="text-align: center;">无数据</th>
					 </tr>`;
				} else {
					$.each(result, function (index, item) {
						// 构造表格行
						if (current) {
							// 计算剩余天数
							const remainingDays = calculateRemainingDays(item.expirationTime);
							const daysClass = remainingDays < 7 ? 'text-red-500 font-bold' : '';
							
							rows += `<tr class="bg-white border-b">
							<th scope="row" class="px-4 py-4 font-medium text-gray-900 whitespace-nowrap">
								<a href="#" class="subscribe-name" data-id="${item.subscribeId}" style="color: blue;">
										${item.subscribeName}
								</a>
							</th>`
							rows += `<th scope="row" class="px-4 py-4 font-medium text-gray-900 whitespace-nowrap">${item.productName}</th>
							<td class="px-4 py-4">${item.ip ? item.ip : '暂无IP'}</td> 
					         <td class="px-4 py-4">${item.beginTime}</td>
					         <td class="px-4 py-4"><span class="${daysClass}">${item.expirationTime}</span></td>
					         <td class="px-4 py-4">${item.totalTraffic}GB</td>`;
							rows += `  <td class="px-4 py-4">${item.remainingTraffic}GB</td> `
							const flag_str = item.flag === 1 ? '充值' : '续费';
							rows += `<td class="px-4 py-4 action-links">
							<a href="#" class="view-link" data-id="${item.subscribeId}"  style="color: blue;">二维码</a>
							<a href="#" class="quick-subscribe" data-id="${item.subscribeId}" style="color: blue;">订阅链接</a>
							<a href="#" class="updateIp" data-id="${item.subscribeId}" style="color: blue;">更换IP</a>
							<a href="#" class="action-link" data-id="${item.subscribeId}" data-name="${item.subscribeName}" data-button-flag="${item.flag}" data-flag="${flag_str}" style="color: blue;">${flag_str}</a>
						</td>`;

							rows += `</tr>`;
							$('#current-data-table').html(rows); // 使用 .html() 而不是 .append() 来替换内容，避免数据叠加
						} else {
							rows += `<tr class="bg-white border-b">
							<th scope="row" class="px-4 py-4 font-medium text-gray-900 whitespace-nowrap">
							${item.orderId}
							</th>
							<th scope="row" class="px-4 py-4">
							${item.subscribeName}
							</th>`
							rows += `<th scope="row" class="px-4 py-4 font-medium text-gray-900 whitespace-nowrap">${item.productName}</th>
					        
					         <td class="px-4 py-4">${item.beginTime}</td>
					         <td class="px-4 py-4">${item.expirationTime}</td>
					         <td class="px-4 py-4">${item.totalTraffic}</td>`;
							rows += `  <td class="px-4 py-4">${item.price}</td> `
							rows += `  <td class="px-4 py-4">${item.cycle}</td> `
							rows += `  <td class="px-4 py-4">${item.type}</td> `
							rows += `</tr>`;
							$('#old-data-table').html(rows); // 使用 .html() 而不是 .append() 来替换内容，避免数据叠加
						}


					});
				}
				if (current) {
					$('#current_list').show();
					$('#old_list').hide();
				} else {
					$('#current_list').hide();
					$('#old_list').show();
				}

				$('.updateIp').on('click', function (event) {
					event.preventDefault(); // 防止链接默认行为
					var subscribeId = $(this).data('id');
					fetchUpdateIpPrice(subscribeId);
				});
				// 添加点击事件
				$('.subscribe-name').on('click', function (event) {
					event.preventDefault();
					var subscribeId = $(this).data('id');
					showUpdateNameModal(subscribeId);
				});
				// $('.view-link').on('click', function (event) {
				// 	event.preventDefault();
				// 	var subscribeId = $(this).data('id');

				// 	viewLink(subscribeId);
				// });
				$('.view-link').on('click', function (event) {
					event.preventDefault();
					var subscribeId = $(this).data('id');
					fetchAndShowProtocols(subscribeId);
				});
				$('.quick-subscribe').on('click', async function (event) {
					event.preventDefault();
					var subscribeId = $(this).data('id');
					var index = layer.load(1, {
						shade: 0
					});
					
					try {
						const result = await getSubscribeUrl(subscribeId);
						$('#subscribeUrl').text(domain + "/owl/subscribe/v1/" + subscribeId + "/" + result);
						copyToClipboard(); //改为直接复制
					} catch (error) {
						layer.msg(error);
						console.error(error);
					} finally {
						layer.close(index);
					}
				});
				$('.action-link').on('click', function (event) {
					event.preventDefault(); // 防止链接默认行为
					var subscribeId = $(this).data('id');
					var subscribeName = $(this).data('name');
					var flag = $(this).data('flag');
					var button_flag = $(this).data('button-flag');
					//如果为1，则为充值
					if (button_flag == 1) {
						toggleSubScribeRechargeModal(subscribeId, flag, subscribeName);
					} else if (button_flag == 2) {
						//获取当前订阅产品进行续费
						getProductBySubscribeId(subscribeId);
					}

				});

				updateSelectedState(current);
			}
			// 在数据加载完成后重新设置排序
			setTimeout(window.setupSorting, 100);
		},
		error: function (xhr, status, error) {
			console.error("数据加载错误:", error);
		},
		complete: function () {
			// 关闭加载指示器
			layer.close(index);
		}
	});
}

function redeemCode() {
	var btn = $('#redeemCodeButton');
	// 检查按钮是否已禁用
	if (btn.hasClass('disabled')) {
		return;
	}
	var code = $('#redeemCodeInput').val();
	if (!code) {
		layer.msg('请输入兑换码');
		return;
	}
	var data = {
		code: code.trim()
	};
	// 禁用按钮
	btn.addClass('disabled');
	var index = layer.load(1, {
		shade: [0.5, '#fff']
	});
	// AJAX请求服务器进行兑换码验证
	$.ajax({
		url: domain + '/owl/exchangeCode', // 替换成你的服务端处理URL
		type: 'POST',
		xhrFields: {
			withCredentials: true
		},
		contentType: 'application/json',
		data: JSON.stringify(data),
		success: function (response) {
			// 根据服务器返回的结果处理，例如弹出成功或失败的消息
			if (response.code === 200) {
				layer.msg('兑换成功');
				closeCodeModal();
				$(document).ready(function () {
					setTimeout(function () {
						window.location.reload();
					}, 1000);
				});
			} else {
				layer.msg(response.message);
			}
		},
		error: function (xhr, status, error) {
			layer.msg('兑换过程中出现错误');
		},
		complete: function () {
			// 关闭加载指示器
			layer.close(index);
			btn.removeClass('disabled');
		}
	});

}

function showCodeModal() {
	// 显示模态框
	const modal = document.getElementById('redeemCodeDiv');
	modal.classList.remove('hidden');
	modal.classList.add('flex');
}

function closeCodeModal() {
	const modal = document.getElementById('redeemCodeDiv');
	modal.classList.add('hidden');
	modal.classList.remove('flex');
}

function getProductBySubscribeId(subscribeId) {
	var url = domain + '/owl/getProductBySubscribeId?subscribeId=' + subscribeId;
	var load = layer.load(1, {
		shade: 0
	});

	$.ajax({
		url: url,
		type: 'GET',
		xhrFields: {
			withCredentials: true
		},
		dataType: 'json',
		success: function (data) {
			console.log(data)
			if (data.code === 200) {
				const planData = data.result;
				handleBuyButtonClick(planData);
				//给confirmBuyButton添加data属性
				$('#confirmBuyButton').data('subscribeId', subscribeId);
				$('#confirmBuyButton').data('buyType', "renewal");
				$('#buy_title').text('续费线路');
			}
		},
		error: function (xhr, status, error) {
			console.error("Error: " + error);
		},
		complete: function () {
			// 关闭加载指示器
			layer.close(load);
		}
	});
}
function getProductList() {
	var url = domain + '/owl/listProduct';
	var load = layer.load(1, {
		shade: 0
	});

	$.ajax({
		url: url,
		type: 'GET',
		xhrFields: {
			withCredentials: true
		},
		dataType: 'json',
		success: function (data) {
			console.log(data)
			if (data.code === 200) {
				const result = data.result;
				// 获取HTML中的容器元素，假设容器的class为`pricing`
				var pricingContainer = document.querySelector('#pricing');

				// 清空原有的内容
				pricingContainer.innerHTML = '';

				// 遍历JSON数据，为每个线路创建HTML结构 onclick="toggleBuyModal('${plan.id}','${plan.title}'
				result.forEach(function (plan) {
					let decodedEmoji = decodeEmoji(plan.countryEmoji);
					var itemHTML = `
				       <div class="pricing__item">
				            <h3 class="pricing__title">
				                <span style="font-size: 1.5em; margin-right: 10px;">${decodedEmoji}</span>
				                ${plan.title}
				            </h3>
				            <p class="pricing__sentence">${plan.apply} - ${plan.traffic / 1073741824}G/月</p>
				            <div class="pricing__price"><span class="pricing__currency"></span>${plan.salePrice}<span class="pricing__period">/ month</span></div>
				            <ul class="pricing__feature-list">
				                ${plan.description.split('\n').map(feature => `<li class="pricing__feature">${feature}</li>`).join('')}
				            </ul>
				            <button  class="buy_button pricing__action" product-id="${plan.id}" data-plan='${JSON.stringify(plan)}')">购买</button>
				        </div> `;
					// 将生成的HTML添加到容器中
					pricingContainer.innerHTML += itemHTML;
					// 获取所有的.pricing__item元素
					var pricingItems = document.querySelectorAll('.pricing__item');

					// 检查是否有至少两个.pricing__item元素
					// if (pricingItems.length > 1) {
					// 	// 为第二个元素添加.pricing__item--featured类
					// 	pricingItems[1].classList.add('pricing__item--featured');
					// }
					// 为每个购买按钮添加点击事件
					$('.buy_button').on('click', function (event) {
						event.preventDefault();
						const planData = JSON.parse($(this).attr('data-plan'));
						handleBuyButtonClick(planData);
						//给confirmBuyButton添加data属性
						$('#confirmBuyButton').data('buyType', "buy");
						$('#buy_title').text('购买线路');
					});
				});

			}
		},
		error: function (xhr, status, error) {
			console.error("Error: " + error);
		},
		complete: function () {
			// 关闭加载指示器
			layer.close(load);
		}
	});
}
function decodeEmoji(text) {
	if (text) {
		return JSON.parse('"' + text.replace(/\"/g, '\\"') + '"');
	}
	return '';
}
function handleBuyButtonClick(planData) {
	// 更新模态框中的线路信息
	$('#buy_package_name').text(planData.title);
	$('#choose_id').val(planData.id);
	// 更新付款周期选项
	updatePaymentCycleOptions(planData);

	// 显示模态框
	$('#buyDiv').removeClass('hidden');

	// 更新总金额
	updateTotalAmount();

	// 定义更新付款周期选项的函数
	function updatePaymentCycleOptions(planData) {
		const paymentCycleSelect = $('#paymentCycle');
		paymentCycleSelect.empty();

		const cycles = [
			{ value: 'monthly', text: '月付', price: planData.salePrice },
			{ value: 'quarterly', text: '季付', price: planData.quarterlyPrice },
			{ value: 'semiannual', text: '半年付', price: planData.semiAnnualPrice },
			{ value: 'annual', text: '年付', price: planData.yearPrice }
		];

		cycles.forEach(cycle => {
			if (cycle.price > 0) {
				const option = $('<option></option>')
					.attr('value', cycle.value)
					.text(cycle.text)
					.data('price', cycle.price);
				paymentCycleSelect.append(option);
			}
		});

		// 添加周期变化事件监听器
		paymentCycleSelect.on('change', updateTotalAmount);
	}

	// 定义更新总金额的函数
	function updateTotalAmount() {
		const selectedOption = $('#paymentCycle option:selected');
		$('#choose_cycle').val(selectedOption.val());
		const price = selectedOption.data('price');
		$('#totalAmount').html(`￥${price.toFixed(2)}`);
	}
}

function toggleBuyModal() {
	var modal = $('#buyDiv');
	if (modal.hasClass('hidden')) {
		$('#buy_title').text('');
		modal.removeClass('hidden');
	} else {
		$('#choose_id').val('');
		$('#choose_cycle').val('');
		$('#confirmBuyButton').data('buyType', '');
		$('#confirmBuyButton').data('subscribeId', '');
		modal.addClass('hidden');
	}
}


function confirmBuy() {
	var buyType = $('#confirmBuyButton').data('buyType');
	if (!buyType) {
		layer.msg('请重新选择线路');
		return;
	}
	var subscribeId = $('#confirmBuyButton').data('subscribeId');
	var productId = $('#choose_id').val();
	if (buyType == "buy" && !productId) {
		layer.mag('请重新选择线路');
		return;
	}
	var cycle = $('#choose_cycle').val();
	if (!cycle) {
		layer.msg('请选择付款周期');
		return;
	}
	var data = {
		productId: productId,
		cycle: cycle,
		subscribeId: subscribeId,
		buyType: buyType
	};
	var index = layer.load(1, {
		shade: [0.5, '#fff']
	});
	$.ajax({
		url: domain + '/owl/buyProduct', // 替换成你的服务端处理URL
		type: 'POST',
		xhrFields: {
			withCredentials: true
		},
		contentType: 'application/json',
		data: JSON.stringify(data),
		success: function (response) {
			if (response.code === 200) {
				layer.msg('购买成功');
				toggleBuyModal();
				$(document).ready(function () {
					setTimeout(function () {
						window.location.reload();
					}, 1000);
				});
			} else {
				layer.msg(response.message);
			}
		},
		error: function (xhr, status, error) {
			layer.msg('购买过程中出现错误');
		},
		complete: function () {
			layer.close(index);
		}
	});
}
function showUpdateNameModal(subscribeId) {
	console.log("subscribeId:" + subscribeId)
	$('#subscribeId').val("");
	// 显示模态框
	const modal = document.getElementById('updateNameDiv');
	modal.classList.remove('hidden');
	modal.classList.add('flex');
	$('#subscribeId').val(subscribeId);
}
function updateSubscribeName() {
	var btn = $('#updateNameDivButton');
	// 检查按钮是否已禁用
	if (btn.hasClass('disabled')) {
		return;
	}
	var subscribeId = $('#subscribeId').val();
	if (!subscribeId) {
		layer.msg('请选择订阅线路');
		return;
	}
	var newName = $('#newSubscribeNameInput').val();
	if (!newName) {
		layer.msg('请输入名称');
		return;
	}
	var data = {
		"subscribeId": subscribeId,
		"newName": newName
	};
	// 禁用按钮
	btn.addClass('disabled');
	var index = layer.load(1, {
		shade: [0.5, '#fff']
	});
	// AJAX请求服务器进行兑换码验证
	$.ajax({
		url: domain + '/owl/updateSubscribeName', // 替换成你的服务端处理URL
		type: 'POST',
		xhrFields: {
			withCredentials: true
		},
		contentType: 'application/json',
		data: JSON.stringify(data),
		success: function (response) {
			// 根据服务器返回的结果处理，例如弹出成功或失败的消息
			if (response.code === 200) {
				layer.msg('修改成功');
				closeCodeModal();
				window.location.reload();
			} else {
				layer.msg(response.message);
			}
		},
		error: function (xhr, status, error) {
			layer.msg('修改过程中出现错误');
		},
		complete: function () {
			// 关闭加载指示器
			layer.close(index);
			btn.removeClass('disabled');
		}
	});

}


function closeUpdateNameModal() {
	const modal = document.getElementById('updateNameDiv');
	modal.classList.add('hidden');
	modal.classList.remove('flex');
}
function toggleSubScribeRechargeModal(subscribeId, flag, subscribeName) {
	var modal = $('#rechargeDiv');
	if (modal.hasClass('hidden')) {
		$('#recharge_buy_title').text(`是否${flag}【 ${subscribeName} 】?`);
		modal.removeClass('hidden');
		$('#recharge_choose_id').val(subscribeId);
		$('#recharge_choose_name').val(subscribeName);
	} else {
		modal.addClass('hidden');
		$('#recharge_choose_id').val('');
		$('#recharge_choose_name').val('');
	}
}
function toggleUpdateIpModal(subscribeId) {
	var modal = $('#updateIpModal');
	if (modal.hasClass('hidden')) {
		modal.removeClass('hidden');
		$('#update_ip_choose_id').val(subscribeId);
	} else {
		modal.addClass('hidden');
		$('#update_ip_choose_id').val('');
	}
}
function fetchUpdateIpPrice(subscribeId) {
	if (!subscribeId) {
		layer.msg('请重新选择节点');
		return;
	}
	var url = domain + '/owl/getProductBySubscribeId?subscribeId=' + subscribeId;
	$.ajax({
		url: url,
		type: 'GET',
		xhrFields: {
			withCredentials: true
		},
		dataType: 'json',
		success: function (data) {
			console.log(data);
			const result = data.result;
			const firstChangeIpPrice = result.firstChangeIpPrice;
			const changeIpPrice = result.changeIpPrice;
			if (firstChangeIpPrice != changeIpPrice) {
				$('#update_ip_title').text(`每个线路月周期首次${firstChangeIpPrice}元,之后每次${changeIpPrice}元,确定更换吗？`);
			} else {
				$('#update_ip_title').text(`更换IP需要${changeIpPrice}元,确定更换吗？`);
			}
			toggleUpdateIpModal(subscribeId);
		}
	});
}

function confirmUpdateIp() {
	var subscribeId = $('#update_ip_choose_id').val();
	if (!subscribeId) {
		layer.mag('请重新选择节点');
		return;
	}
	var data = {
		"subscribeId": subscribeId
	};
	var index = layer.load(1, {
		shade: [0.5, '#fff']
	});
	$.ajax({
		url: domain + '/owl/updateIp',
		type: 'POST',
		xhrFields: {
			withCredentials: true
		},
		contentType: 'application/json',
		data: JSON.stringify(data),
		success: function (response) {
			if (response.code === 200) {
				layer.msg('更换成功');
				$(document).ready(function () {
					setTimeout(function () {
						window.location.reload();
					}, 1000);
				});
			} else {
				layer.msg(response.message);
			}
		},
		error: function (xhr, status, error) {
			layer.msg('更换过程中出现错误');
		},
		complete: function () {
			layer.close(index);
		}
	});
}
function confirmRechargeSubscribe() {
	var subscribeId = $('#recharge_choose_id').val();
	if (!subscribeId) {
		layer.msg('请重新选择节点');
		return;
	}
	var data = {
		"subscribeId": subscribeId
	};
	var index = layer.load(1, {
		shade: [0.5, '#fff']
	});
	$.ajax({
		url: domain + '/owl/rechargeSubscribe',
		type: 'POST',
		xhrFields: {
			withCredentials: true
		},
		contentType: 'application/json',
		data: JSON.stringify(data),
		success: function (response) {
			if (response.code === 200) {
				layer.msg('充值成功');
				$(document).ready(function () {
					setTimeout(function () {
						window.location.reload();
					}, 1000);
				});
			} else {
				layer.msg(response.message);
			}
		},
		error: function (xhr, status, error) {
			layer.msg('充值过程中出现错误');
		},
		complete: function () {
			layer.close(index);
		}
	});
}

function viewLink(subscribeId) {
	var uuid = $('#uuid').val();
	const url = domain + "/owl/subscribe/v0/" + subscribeId + "/" + uuid;
	var index = layer.load(1, {
		shade: 0
	});

	fetch(url)
		.then(response => {
			if (response.ok) { // 检查响应码是否在200-299范围内
				return response.text();
			} else {
				return response.text().then(text => {
					layer.msg(text);
				});
			}
		})
		.then(data => {
			if (!data) {
				layer.msg("获取二维码异常");
				layer.close(index);
				return;
			}
			// 使用base64解码data
			data = window.atob(data);
			$('#subscribeUrl').text(data);
			$('#sub_title').text("节点二维码");
			subscribeUrl();
			layer.close(index);
		})
		.catch(error => {
			console.log(error);
			layer.close(index);
			layer.msg('获取二维码异常'); // 提示具体的错误信息
		});
}

function getBillList() {
	var index = layer.load(1, {
		shade: 0
	});

	$.ajax({
		url: domain + "/owl/listBill",
		type: 'GET',
		xhrFields: {
			withCredentials: true
		},
		dataType: 'json',
		success: function (data) {
			var rows = '';
			if (data.code === 200) {
				const result = data.result;
				if (result.length === 0) {
					rows += `<tr class="bg-white border-b">
                        <th colspan="8" scope="row" class="px-4 py-4 font-medium text-gray-900 whitespace-nowrap" style="text-align: center;">无数据</th>
                    </tr>`;
				} else {
					let serialNumber = 1; // 初始化序号变量
					$.each(result, function (index, item) {
						const operationType = item.operationType == 1 ? "收入" : "支出";
						rows += `<tr class="bg-white border-b">
						<td class="px-4 py-4">${serialNumber}</td>
						<td class="px-4 py-4">${item.channelOrderId ? item.channelOrderId : ''}</td>
						<td class="px-4 py-4">${item.billType}</td>
                           
                            <td class="px-4 py-4">${operationType}</td>
                            <td class="px-4 py-4">${item.amount}</td>
                            <td class="px-4 py-4">${item.after}</td>
                            <td class="px-4 py-4">${item.type}</td>
							<td class="px-4 py-4">${item.tradeStatus}</td>
							<td class="px-4 py-4">${item.createDateTime}</td>
                        </tr>`;
						serialNumber++; // 递增序号
					});
				}
				$('#bill-data-table').html(rows);
			}
		},
		error: function (xhr, status, error) {
			console.error("Error: " + error);
		},
		complete: function () {
			// 关闭加载指示器
			layer.close(index);
		}
	});
}

function switchProtocol(protocol) {
	currentProtocol = protocol;
	
	// 更新标签样式
	document.querySelectorAll('.protocol-tab').forEach(tab => {
		if (tab.textContent.toLowerCase() === protocol) {
			tab.classList.remove('bg-gray-200', 'text-gray-700');
			tab.classList.add('bg-blue-500', 'text-white');
		} else {
			tab.classList.remove('bg-blue-500', 'text-white');
			tab.classList.add('bg-gray-200', 'text-gray-700');
		}
	});
	
	// 显示对应协议代码
	const codeElement = document.getElementById('protocolCode');
	
	// 更新当前选中的clientId
	if (window.protocolData && window.protocolData[protocol]) {
		if (protocol === 'socks5') {
			// 对于 socks5，使用直连节点的 clientId
			currentClientId = window.protocolData.socks5.directClientId;
		} else {
			currentClientId = window.protocolData[protocol].clientId;
		}
	}
	
	// 控制各区域的显示
	const standardProtocolContainer = document.getElementById('standardProtocolContainer');
	const socks5Container = document.getElementById('socks5Container');
	
	if (protocol === 'socks5') {
		// Socks5 模式下隐藏标准协议区，显示专用区域
		standardProtocolContainer.style.display = 'none';
		socks5Container.style.display = 'flex';
		
		// 更新 socks5 显示内容
		updateSocks5Display();
	} else {
		// 其他协议模式下显示标准协议区
		standardProtocolContainer.style.display = 'flex';
		socks5Container.style.display = 'none';
		
		// 更新代码内容
		codeElement.textContent = window.protocolCodes[protocol] || '';
		
		// 更新二维码
		const qrcode = document.getElementById('protocolQrcode');
		qrcode.innerHTML = ''; // 清除旧的二维码
		
		// 尝试生成二维码，处理可能的错误
		try {
			new QRCode(qrcode, {
				text: window.protocolCodes[protocol] || '',
				width: 144,
				height: 144,
				correctLevel: QRCode.CorrectLevel.L  // 使用最低级别的纠错以允许存储更多数据
			});
		} catch (error) {
			console.error("QR code generation error:", error);
			qrcode.innerHTML = '<div class="flex items-center justify-center w-full h-full text-center text-red-500 text-xs">协议内容太长，<br>无法生成二维码</div>';
		}
	}
}

function fetchAndShowProtocols(subscribeId) {
	var index = layer.load(1, {
		shade: 0
	});
	
	$.ajax({
		url: domain + '/owl/listSubscribeProtocol?subscribeId=' + subscribeId,
		type: 'GET',
		xhrFields: {
			withCredentials: true
		},
		dataType: 'json',
		success: function(response) {
			if (response.code === 200) {
				const result = response.result;
				let vmessCode = '', shadowsocksCode = '';
				let socks5Direct = null, socks5Transit = null;
				
				// 存储协议数据，包括clientId
				window.protocolData = {
					vmess: {},
					shadowsocks: {},
					socks5: {}
				};

				// 处理 vmess 和 shadowsocks 协议
				result.list.forEach(item => {
					if (item.protocol === 'vmess') {
						vmessCode = item.code;
						window.protocolData.vmess = {
							code: item.code,
							clientId: item.clientId
						};
					} else if (item.protocol === 'shadowsocks') {
						shadowsocksCode = item.code;
						window.protocolData.shadowsocks = {
							code: item.code,
							clientId: item.clientId
						};
					}
				});

				// 处理 socks5 协议，保存 clientId
				result.s5List.forEach(item => {
					if (item.type === 0) {
						socks5Direct = item;
						window.protocolData.socks5.directClientId = item.clientId;
					} else if (item.type === 1) {
						socks5Transit = item;
						window.protocolData.socks5.transitClientId = item.clientId;
					}
				});

				// 构造 socks5 显示文本
				let socks5Text = '';
				if (socks5Direct) {
					socks5Text += `直连节点:\nIP: ${socks5Direct.ip}\n端口: ${socks5Direct.port}\n用户名: ${socks5Direct.user}\n密码: ${socks5Direct.pass}\n\n`;
				}
				if (socks5Transit) {
					socks5Text += `中转节点:\nIP: ${socks5Transit.ip}\n端口: ${socks5Transit.port}\n用户名: ${socks5Transit.user}\n密码: ${socks5Transit.pass}`;
				}

				// 显示协议弹窗并设置初始clientId
				showProtocolModal(vmessCode, shadowsocksCode, socks5Text,subscribeId);
				if (window.protocolData.vmess.clientId) {
					currentClientId = window.protocolData.vmess.clientId;
				}
			} else {
				layer.msg(response.message || '获取协议信息失败');
			}
		},
		error: function(xhr, status, error) {
			layer.msg('获取协议信息失败');
			console.error(error);
		},
		complete: function() {
			layer.close(index);
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
			correctLevel: QRCode.CorrectLevel.L  // 使用 L 级别以容纳更多数据
		});
	} catch (error) {
		console.error("生成二维码出错:", error);
		$(qrCodeElement).html('<div class="text-center text-red-500">二维码数据过长<br>请使用复制链接功能</div>');
		// 确保提供复制链接的选项
		$("#copyBtn").show();
	}
}

// 新增一个通用的获取订阅URL的函数
function getSubscribeUrl(subscribeId) {
	return new Promise((resolve, reject) => {
		$.ajax({
			url: domain + '/owl/getSubscribeUrl?subscribeId=' + subscribeId,
			type: 'GET',
			xhrFields: {
				withCredentials: true
			},
			dataType: 'json',
			success: function(response) {
				if (response.code === 200) {
					resolve(response.result);
				} else {
					reject(response.message || '获取订阅链接失败');
				}
			},
			error: function(xhr, status, error) {
				reject('获取订阅链接失败');
			}
		});
	});
}

// 添加更换密码功能
function updateClientPassword() {
	if (!currentClientId) {
		layer.msg('请先选择协议');
		return;
	}
	
	const subscribeId = $('#updateClientPasswordChoseSubscribeId').val();
	if (!subscribeId) {
		layer.msg('订阅ID无效');
		return;
	}

	layer.confirm('确定要更换该协议的密码吗？', {
		btn: ['确定', '取消']
	}, function() {
		var index = layer.load(1, {
			shade: 0
		});
		
		$.ajax({
			url: domain + '/owl/updateClientPassword',
			type: 'POST',
			xhrFields: {
				withCredentials: true
			},
			contentType: 'application/json',
			data: JSON.stringify({
				subscribeId: subscribeId,
				clientId: currentClientId
			}),
			success: function(response) {
				if (response.code === 200) {
					layer.msg('密码更换成功,请稍后重新查看');
				} else {
					layer.msg(response.message || '密码更换失败');
				}
			},
			error: function() {
				layer.msg('密码更换失败');
			},
			complete: function() {
				layer.close(index);
			}
		});
	});
}