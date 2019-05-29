<template>
  <div class="staticPage">
    <div
      class="container container_sm-width contact-page"
      id="contact-container"
    >
      <h1>Contact</h1>
      <template v-if="sendSuccess">
        Thank you for your inquiry! We will review your submission and an AVN
        Staff member will get back to you shortly.
      </template>
      <template v-else>
        <h2>
          If you have business inquiries or other questions, please fill out the
          following form to contact us. Thank you.
        </h2>
        <form v-on:submit.stop.prevent="send">
          <label
            class="form-group form-group_with-label"
            :class="{ 'field-invalid': fieldError('name') }"
          >
            <div class="form-group-inner">
              <span class="label">Name</span>
              <div class="form-group form-group_clear-gaps">
                <div class="form-field">
                  <input
                    v-model="model.name"
                    type="text"
                    name="name"
                    v-validate="'required'"
                  />
                </div>
                <div class="error-info" v-if="fieldError('name')">
                  {{ fieldError("name") }}
                </div>
              </div>
            </div>
          </label>
          <label
            class="form-group form-group_with-label"
            :class="{ 'field-invalid': fieldError('email') }"
          >
            <div class="form-group-inner">
              <span class="label">Email</span>
              <div class="form-group form-group_clear-gaps">
                <div class="form-field">
                  <input
                    v-model="model.email"
                    type="email"
                    name="email"
                    v-validate="'required|email'"
                    data-vv-validate-on="blur"
                  />
                </div>
                <div class="error-info" v-if="fieldError('email')">
                  {{ fieldError("email") }}
                </div>
              </div>
            </div>
          </label>
          <label
            class="form-group form-group_with-label"
            :class="{ 'field-invalid': fieldError('subject') }"
          >
            <div class="form-group-inner">
              <span class="label">Subject</span>
              <div class="form-group form-group_clear-gaps">
                <div class="form-field">
                  <input
                    v-model="model.subject"
                    type="text"
                    name="subject"
                    v-validate="'required'"
                  />
                </div>
                <div class="error-info" v-if="fieldError('subject')">
                  {{ fieldError("subject") }}
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
                <div class="error-info" v-if="fieldError('message')">
                  {{ fieldError("message") }}
                </div>
              </div>
            </div>
          </label>
          <div class="form-group form-group_with-label">
            <div class="form-group-inner">
              <span class="label" v-if="$mq === 'desktop'"></span>
              <button
                :disabled="!isFormValid || sending"
                type="submit"
                class="btn lg btn_fix-width-md"
                :class="{ 'block btn-center': $mq === 'mobile' }"
              >
                Submit
              </button>
            </div>
          </div>
        </form>
      </template>
    </div>
    <Footer class="site-footer_main" />
  </div>
</template>

<script>
import Footer from "@/components/footer/Index.vue";
import Form from "@/mixins/form";

export default {
  name: "ContactsPage",

  mixins: [Form],

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
    },
    sending() {
      return this.$store.state.contacts.sendLoading;
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
