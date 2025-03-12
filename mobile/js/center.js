$(document).ready(function () {
	initHome();
});

function initHome() {
	fetch('home.html')
		.then(response => response.text())
		.then(data => {
			document.getElementById('mobile-iframe-content').innerHTML = data;
			// 确保order.js在内容加载后执行
			$('#title').text('仪表盘');
			closeSideMenu();
			getUser();
			getUseTutorialLink();
			getIdShareUrl();
			listPublicNotice();
			getInviteStatus();
			fetchUserData();
			getMobileOrderList();
		})
		.catch(error => console.error('Error loading the content:', error));
}
function initPrice() {
	fetch('../../price.html')
		.then(response => response.text())
		.then(data => {
			document.getElementById('mobile-iframe-content').innerHTML = data;
			$('#title').text('购买线路');
			closeSideMenu();
			getProductList();
		})
		.catch(error => console.error('Error loading the content:', error));
}
function initorder() {
	fetch('order.html')
		.then(response => response.text())
		.then(data => {
			document.getElementById('mobile-iframe-content').innerHTML = data;
			$('#title').text('我的订单');
			toggleSideMenu();
			getMobileOldOrderList();
		})
		.catch(error => console.error('Error loading the content:', error));
}
function initBilling() {
	fetch('bill.html')
		.then(response => response.text())
		.then(data => {
			document.getElementById('mobile-iframe-content').innerHTML = data;
			$('#title').text('我的账单');
			toggleSideMenu();
			getMobileBillList();
		})
		.catch(error => console.error('Error loading the content:', error));
}

