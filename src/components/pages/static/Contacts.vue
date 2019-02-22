<template>
  <div class="staticPage">
    <div class="container contact-page" id="contact-container">
      <h1>Contact</h1>
      <template v-if="sendSuccess">
        Your request has been sent. Thank you for conversation.
      </template>
      <template v-else>
        <h2>
          If you have business inquiries or other questions, please fill out the
          following form to contact us. Thank you.
        </h2>
        <form v-on:submit.stop.prevent="send">
          <label class="form-group form-group_with-label">
            <div class="form-group-inner">
              <span class="label">Name</span>
              <div class="form-group form-group_clear-gaps">
                <div class="form-field">
                  <input
                    v-model="model.name"
                    type="text"
                    name="name"
                    required
                  />
                </div>
              </div>
            </div>
          </label>
          <label class="form-group form-group_with-label">
            <div class="form-group-inner">
              <span class="label">Email</span>
              <div class="form-group form-group_clear-gaps">
                <div class="form-field">
                  <input
                    v-model="model.email"
                    type="email"
                    name="email"
                    required
                  />
                </div>
              </div>
            </div>
          </label>
          <label class="form-group form-group_with-label">
            <div class="form-group-inner">
              <span class="label">Subject</span>
              <div class="form-group form-group_clear-gaps">
                <div class="form-field">
                  <input
                    v-model="model.subject"
                    type="text"
                    name="subject"
                    required
                  />
                </div>
              </div>
            </div>
          </label>
          <label class="form-group form-group_with-label">
            <div class="form-group-inner">
              <span class="label">Message</span>
              <div class="form-group form-group_clear-gaps">
                <div class="form-field">
                  <textarea
                    v-model="model.message"
                    name="message"
                    rows="6"
                    required
                  ></textarea>
                </div>
              </div>
            </div>
          </label>
          <label class="form-group form-group_with-label">
            <div class="form-group-inner">
              <span class="label"></span>
              <button type="submit" class="btn lg">Submit</button>
            </div>
          </label>
        </form>
      </template>
    </div>
    <Footer class="site-footer_main" />
  </div>
</template>

<script>
import Footer from "@/components/footer/Index.vue";

export default {
  name: "ContactsPage",

  components: {
    Footer
  },

  data() {
    return {
      model: {
        name: "",
        email: "",
        subject: "",
        message: ""
      }
    };
  },

  computed: {
    sendSuccess() {
      return this.$store.state.contacts.sendSuccess;
    }
  },

  methods: {
    send() {
      this.$store.dispatch("contacts/send", this.model);
    }
  },

  beforeDestroy() {
    this.$store.dispatch("contacts/sendReset");
  }
};
</script>
