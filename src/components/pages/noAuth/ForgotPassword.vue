<template>
  <div class="forgot staticPage">
    <div class="container">
      <h1>Reset Password</h1>
      <h2>Please fill out your email. A link to reset password will be sent there.</h2>
      <form class="forgot-password-form">
        <input class="lg rounded" type="text" name="email" placeholder="Your Email">
        <div class="g-recaptcha" id="captcha"></div>
        <div class="hidden error">There is some error</div>
        <div class="hidden info">Please check your mailbox for further instructions to recover your password.</div>
        <button type="submit" class="btn lg alt">Reset password</button>
      </form>
    </div>
  </div>
</template>
