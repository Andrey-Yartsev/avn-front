import Vue from "vue";
import Logo from "@/sep-components/avn/Logo";
import Footer from "@/sep-components/avn/Footer";
import AddCard from "@/sep-components/avn/securionpay/AddCard";
import SubscribeModal from "@/sep-components/avn/securionpay/SubscribeModal";
import ChatMessagePayConfirm from "@/sep-components/avn/securionpay/ChatMessagePayConfirm";

Vue.component("rl-logo", Logo);
Vue.component("rl-footer", Footer);

Vue.component("avn-settings-add-card", AddCard);
Vue.component("rl-subscribe-modal", SubscribeModal);
Vue.component("avn-chat-message-pay-confirm", ChatMessagePayConfirm);
