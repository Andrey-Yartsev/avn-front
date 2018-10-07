<template>
  <div
    slot="extra"
    class="msg-no-chat visible"
  >
    <div class="msg-no-chat__msg">You have no active conversations</div>
    <router-link
      tag="div"
      to="/chat/new"
      class="btn-start newMessageEvent"
    >New message</router-link>
  </div>
</template>
