function getMobileOrderList() {
    var url = domain + "/owl/findCurrentSubscribe";
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
            if (data.code === 200) {
                const result = data.result;
                if (result.length === 0) {
                    $('#subscribeList').append('<p class="text-center text-gray-500">暂无线路</p>');
                } else {
                    $.each(result, function (index, item) {
                        const flag_str = item.flag === 1 ? '充值' : '续费';

                        const remainingDays = item.remainingDays;
                        let days_text = `距离到期还有 ${remainingDays} 天`;
                        //如果remainingDays小于0，则显示已到期
                        if (remainingDays <= 0) {
                            days_text = '当前已到期，请及时续费';
                        }
                        var div = `<div class="bg-white rounded-lg shadow-md p-4 w-full mb-4">
                            <h4 class="subscribe-header font-semibold mb-2 flex items-center">
                                <span class="subscribe-info truncate">${item.subscribeName} - ${item.ip ? item.ip : '暂无IP'} (${item.productName})</span>
                                <i class="subscribe-name fas fa-edit text-green-500 ml-2 text-sm cursor-pointer hover:text-green-700 transition duration-300" data-id="${item.subscribeId}"></i>
                            </h4>
                          
                            <p class="text-gray-600 mb-4">于 ${item.expirationTime} 到期，${days_text}。</p>
                           
                            <div class="bg-gray-200 rounded-full h-3 mb-4">
                                <div class="bg-teal-500 h-3 rounded-full" style="width: ${calculateUsagePercentage(item.totalTraffic, item.usedTraffic)}%;"></div>
                            </div>
                            <p class="text-gray-600 mb-4">已用 ${formatTraffic(item.usedTrafficBytes)} / 总计 ${item.totalTraffic}GB</p>  
                            <div class="flex justify-between">
                                <button class="view-link bg-blue-500 text-white text-sm px-3 py-2 rounded" data-id="${item.subscribeId}">二维码</button>
                                <button class="quick-subscribe bg-green-500 text-white text-sm px-3 py-2 rounded" data-id="${item.subscribeId}">订阅链接</button>
                                <button class="updateIp bg-yellow-500 text-white text-sm px-3 py-2 rounded" data-id="${item.subscribeId}">更换IP</button>
                                <button class="action-link bg-red-500 text-white text-sm px-3 py-2 rounded" data-id="${item.subscribeId}" data-name="${item.subscribeName}" data-button-flag="${item.flag}"  data-flag="${flag_str}">${flag_str}</button>
                            </div>
                        </div>`;
                        $('#subscribeList').append(div);
                    });
                }

                $('.updateIp').on('click', function () {
                    var subscribeId = $(this).data('id');
                    fetchUpdateIpPrice(subscribeId);
                });
                // 添加点击事件
                $('.subscribe-name').on('click', function () {
                    var subscribeId = $(this).data('id');
                    showUpdateNameModal(subscribeId);
                });
                $('.view-link').on('click', function () {
                    var subscribeId = $(this).data('id');
                    fetchAndShowProtocols(subscribeId);
                });
                $('.quick-subscribe').on('click', async function () {
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


function getMobileOldOrderList() {
    var url = domain + "/owl/findOldSubscribe";
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
            if (data.code === 200) {
                const orders = data.result;
                displayHistoryOrders(orders);
            } else {
                layer.msg('获取历史订单失败: ' + data.message);
            }
        },
        error: function (xhr, status, error) {
            console.error("获取历史订单出错: " + error);
            layer.msg('获取历史订单失败，请稍后重试');
        },
        complete: function () {
            layer.close(load);
        }
    });
}

function displayHistoryOrders(orders) {
    const orderList = $('#mobile-order-list');
    orderList.empty();

    if (orders.length === 0) {
        orderList.append('<p class="text-center text-gray-500">暂无历史订单</p>');
        return;
    }

    orders.forEach(order => {
        const orderItem = `<div class="order-item" data-json='${JSON.stringify(order)}'>
        <div class="order-header">
            <span class="package-name">${order.productName}</span>
            <span class="status active">${order.subscribeName}</span>
        </div>
        <div class="order-details">
            <div class="detail-row">
                <span class="label">购买时间:</span>
                <span class="value">${order.createDate}</span>
            </div>
            <div class="detail-row">
                <span class="label">类型:</span>
                <span class="value">${order.type}</span>
            </div>
            <div class="detail-row">
                <span class="label">价格:</span>
                <span class="value price">${order.price}</span>
            </div>
        </div>
    </div>`;

        orderList.append(orderItem);
    });

    // 为每个订单项添加点击事件
    $('.order-item').off('click').on('click', function () {
        const orderData = JSON.parse($(this).attr('data-json'));
        showOrderDetails(orderData);
    });

    function showOrderDetails(orderData) {
        // 填充模态框内容
        $('#orderNumber').text(orderData.orderId);
        $('#orderName').text(orderData.subscribeName);
        $('#packageName').text(orderData.productName);
        $('#startTime').text(orderData.beginTime);
        $('#endTime').text(orderData.expirationTime);
        $('#totalData').text(orderData.totalTraffic);
        $('#price').text(orderData.price);
        $('#cycle').text(orderData.cycle);
        $('#type').text(orderData.type);

        // 显示模态框
        $('#orderModal').css('display', 'block');

        // 关闭模态框的点击事件
        $('.close').on('click', function () {
            $('#orderModal').css('display', 'none');
        });

        // 点击模态框外部关闭
        $(window).on('click', function (event) {
            if (event.target == $('#orderModal')[0]) {
                $('#orderModal').css('display', 'none');
            }
        });
    }
}

function getMobileBillList() {
    var url = domain + "/owl/listBill";
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
            if (data.code === 200) {
                const orders = data.result;
                displayBills(orders);
            } else {
                layer.msg('获取账单失败: ' + data.message);
            }
        },
        error: function (xhr, status, error) {
            console.error("获取账单出错: " + error);
            layer.msg('获取账单失败，请稍后重试');
        },
        complete: function () {
            layer.close(load);
        }
    });
}


function displayBills(orders) {
    const orderList = $('#mobile-bill-list');
    orderList.empty();

    if (orders.length === 0) {
        orderList.append('<p class="text-center text-gray-500">暂无历史账单</p>');
        return;
    }

    orders.forEach(order => {
        const operationType = order.operationType == 1 ? "收入" : "支出";
        const orderItem = `<div class="order-item" data-json='${JSON.stringify(order)}'>
        <div class="order-header">
            <span class="package-name">${order.type}</span>
             
              <span class="status active">${order.tradeStatus}</span>
        </div>
        <div class="order-details">
         <div class="detail-row">
                <span class="label">收支类型:</span>
                <span class="value">${operationType}</span>
            </div>
            <div class="detail-row">
                <span class="label">交易时间:</span>
                <span class="value">${order.createDate}</span>
            </div>
            <div class="detail-row">
                <span class="label">操作账户:</span>
                <span class="value">${order.billType}</span>
            </div>
            <div class="detail-row">
                <span class="label">交易金额:</span>
                <span class="value price">￥${order.amount}</span>
            </div>
        </div>
    </div>`;

        orderList.append(orderItem);
    });

    // 为每个订单项添加点击事件
    $('.order-item').off('click').on('click', function () {
        const orderData = JSON.parse($(this).attr('data-json'));
        showOrderDetails(orderData);
    });

    function showOrderDetails(orderData) {
        // 填充模态框内容
        $('#channelOrderId').text(orderData.channelOrderId || '');
        $('#billType').text(orderData.billType);
        $('#operationType').text(orderData.operationType == 1 ? "收入" : "支出");
        $('#amount').text('￥' + orderData.amount);
        $('#balance').text('￥' + orderData.after);
        $('#transactionType').text(orderData.type);
        $('#tradeStatus').text(orderData.tradeStatus);
        $('#createDateTime').text(orderData.createDateTime);

        // 显示模态框
        $('#billModal').css('display', 'block');

        // 关闭模态框的点击事件
        $('.close').on('click', function () {
            $('#billModal').css('display', 'none');
        });

        // 点击模态框外部关闭
        $(window).on('click', function (event) {
            if (event.target == $('#billModal')[0]) {
                $('#billModal').css('display', 'none');
            }
        });
    }
}




function calculateUsagePercentage(totalTraffic, usedTraffic) {
    if (!usedTraffic || usedTraffic === 0 || usedTraffic === '0.00') {
        return 0;
    }
    return (usedTraffic / totalTraffic) * 100;
}
function formatTraffic(traffic) {
    if (isNaN(traffic) || traffic === null || traffic === undefined) {
        return '0 B';
    }

    const units = ['B', 'KB', 'MB', 'GB', 'TB'];
    let index = 0;
    let size = parseFloat(traffic);

    while (size >= 1024 && index < units.length - 1) {
        size /= 1024;
        index++;
    }

    return `${size.toFixed(2)}${units[index]}`;
}
function toFixed(num, fixed) {
    var re = new RegExp('^-?\\d+(?:\\.\\d{0,' + (fixed || -1) + '})?');
    return num.toString().match(re)[0];
}
