$(function () {
	$(document).on('modalLoaded', function () {
		bindEvents();
	});
});

function bindEvents() {
	getUser();
	$('#sendCode').click(handleSendCode);
	$('#userMenuButton').click(function () {
		toggleDropdown();
	});
	$('#editProfileButton').click(function () {
		showEditProfileModal();
	});

	$('#changePasswordButton').click(function () {
		showChangePasswordDiv();
	});
	$('#logoutButton').click(function () {
		logout();
	});
	$('#redeemCodeButton').click(function () {
		showCodeModal();
	});
	$('#subscribeUrlButton').click(function () {
		subscribeUrl();
	});
	$('#copyButton').click(function () {
		copyToClipboard();
	});
	$('#updateProfileButton').click(function () {
		updateProfile();
	});
	$('#redeemCode').click(function () {
		redeemCode();
	});
	$('#updateNameDivButton').click(function () {
		updateSubscribeName();
	});

	$('#updateIdCodeButton').click(function () {
		updateIdCode();
	});

	$('#sendVerificationCodeButton').click(function () {
		sendVerificationCode();
	});

	$('#updatePasswordButton').click(function () {
		updatePassword();
	});
	$('#thali').click(function () {
		price();
	});
	$('#bill').click(function () {
		bill();
	});
	$('#invite').click(function () {
		showInvite();
	});
	$('#inviteButton').click(function () {
		showInviteQrCode();
	});
	$('#inviteBalanceButton').click(function () {
		toggleInviteBalanceButtonModal();
	});
	$('#transferButton').click(function () {
		transfer();
	});
	$('#withdrawButton').click(function () {
		withdraw();
	});
	$('#copyInviteCodeButton').click(function () {
		copyInviteCode();
	});
	$('#subscription').click(function () {
		initialize();
	});
	$('#account').click(function () {
		account();
	});
	$('#notice').click(function () {
		notice();
	});
	$('#rechargeButton').click(function () {
		toggleRechargeModal();
	});
	$('#selectAuthIdButton').click(function () {
		showSelectIdAuthModal();
	});
 
	

	$('#confirmRechargeButton').click(function () {
		recharge();
	});
	$('.paySuccessButton').click(function () {
		getPayStatus();
	});
	$('#applyInviteButton').click(function () {
		getApplyInviteInfo();
	});

	$('#applyPromotionButton').click(function () {
		applyPromotion();
	});

}



