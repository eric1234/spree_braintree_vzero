//= require spree/frontend

SpreeBraintreeVzero = {
  updateSaveAndContinueVisibility: function() {
    if (this.isButtonHidden()) {
      $(this).trigger('hideSaveAndContinue')
    } else {
      $(this).trigger('showSaveAndContinue')
    }
  },
  isButtonHidden: function () {
    paymentMethod = this.checkedPaymentMethod();
    return (!$('#use_existing_card_yes:checked').length && SpreeBraintreeVzero.paymentMethodID && paymentMethod.val() == SpreeBraintreeVzero.paymentMethodID);
  },
  checkedPaymentMethod: function() {
    return $('div[data-hook="checkout_payment_step"] input[type="radio"][name="order[payments_attributes][][payment_method_id]"]:checked');
  },
  hideSaveAndContinue: function() {
    $("[data-hook=buttons]").hide();
    $(".new-braintree-payment-method").show();
  },
  showSaveAndContinue: function() {
    $("[data-hook=buttons]").show();
    $(".new-braintree-payment-method").hide();
  },
  setSaveAndContinueVisibility: function() {
    if(SpreeBraintreeVzero.paypal_express && (!SpreeBraintreeVzero.paymentMethodID || (SpreeBraintreeVzero.checkedPaymentMethod().val() == SpreeBraintreeVzero.paymentMethodID)))
      SpreeBraintreeVzero.hideSaveAndContinue();
    else if($('#show-new-payment').length)
      SpreeBraintreeVzero.showSaveAndContinue();
    else
      SpreeBraintreeVzero.updateSaveAndContinueVisibility();
  }
}

$(document).ready(function() {
  paymentMethodsSelect = $('#order_payments_attributes__braintree_token:not(.saved-paypal-methods)')
  paymentMethods = $('div[data-hook="checkout_payment_step"] input[type="radio"]').click(function (e) {
    SpreeBraintreeVzero.setSaveAndContinueVisibility();
  });
  paymentMethodsSelect.change(function (e) {
    SpreeBraintreeVzero.showSaveAndContinue();
  });
  $('#show-new-payment').click(function (e) {
    e.preventDefault();
    paymentMethodsSelect.val('')
    SpreeBraintreeVzero.updateSaveAndContinueVisibility();
  });
  $('[name="commit"]:not(.braintree-submit)').click(function (e) {
    if($('#checkout-step-payment').length) {
      e.preventDefault();
      $('.saved-paypal-methods').val('')
      if(!SpreeBraintreeVzero.paymentMethodID || (SpreeBraintreeVzero.checkedPaymentMethod().val() != SpreeBraintreeVzero.paymentMethodID))
        paymentMethodsSelect.val('')
      $('#checkout_form_payment').submit();
    }
  });
  $('#paypal-submit').click(function (e) {
    e.preventDefault();
    $("#paypal-submit").prop("disabled", true);
  });
  $('#cc-submit').click(function (e) {
    e.preventDefault();
    $('.saved-paypal-methods').val('')
  });
  SpreeBraintreeVzero.setSaveAndContinueVisibility();
})
