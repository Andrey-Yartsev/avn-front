<template>
  <div class="payouts-bank">
    <div class="PayoutsBankView">
      <h1 class="form-title">
        Add Bank
      </h1>
      <form class="payouts-bank-form" action="">
        <div class="border-top shadow-block">
          <div class="container">
            <div class="form-title">
              <div class="inner">
                <div class="semi-transparent">
                  Add Bank
                </div>
              </div>
            </div>
            <div class="form-group">
              <label class="form-group-inner">
                <span class="label">Routing Number</span>
                <input name="routingNumber" value="">
              </label>
            </div>

            <div class="form-group">
              <label class="form-group-inner">
                <span class="label">Account Number</span>
                <input name="accountNumber" value="">
              </label>
            </div>
          </div>

          <div class="form-group hidden" id="payouts-bank-form-error">
            <label class="form-group-inner">
              <span class="label"></span>
              <div class="error"></div>
            </label>
          </div>

          <div class="form-group-btn hidden-mobile">
            <button type="submit" class="btn lg saveChanges">Next</button>
          </div>

        </div>
      </form>
    </div>
  </div>
</template>
