import Vue from "vue";
import Logo from "@/sep-components/avn/Logo";
import Footer from "@/sep-components/avn/Footer";
import AddCard from "@/sep-components/avn/securionpay/AddCard";
import SubscribeModal from "@/sep-components/avn/securionpay/SubscribeModal";
import ChatMessagePayConfirm from "@/sep-components/avn/securionpay/ChatMessagePayConfirm";
import BuySnapchatConfirm from "@/sep-components/avn/securionpay/BuySnapchatConfirm";
import TipPayConfirm from "@/sep-components/avn/securionpay/TipPayConfirm";
import SupportIconUsing from "@/sep-components/avn/icons/Using";
import { Validator } from "vee-validate";

Vue.component("rl-logo", Logo);
Vue.component("rl-footer", Footer);

Vue.component("avn-settings-add-card", AddCard);
Vue.component("rl-subscribe-modal", SubscribeModal);
Vue.component("avn-chat-message-pay-confirm", ChatMessagePayConfirm);
Vue.component("avn-buy-snapchat-pay-confirm", BuySnapchatConfirm);
Vue.component("avn-tip-pay-confirm", TipPayConfirm);

Vue.component("rl-support-icon-using", SupportIconUsing);

// --

Validator.extend("subscription-price", {
  getMessage: () => "Required two numbers past the decimal",
  validate: value => {
    const m = value.toString().match(/^\d+\.(\d+)?$/);
    if (!m) {
      return true;
    }
    return m[1].length === 2;
  }
});
