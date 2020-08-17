<template>
  <div class="payouts-legal" v-if="!loading">
    <div class="PayoutsLegalView PayoutsLegalBankProofView">
      <h1 class="form-title settings-title">
        Additional Verification Document Required
      </h1>

      <form class="payouts-legal-form" v-on:submit.stop.prevent="save">
        <div class="border-top shadow-block">
          <div class="container">
            <div class="form-group form-group_with-label photo-form-group">
              <div
                class="form-group-inner photo-form-group-inner"
                :class="{ 'success icn-item': !!bankOwnershipProof }"
              >
                <span class="label"
                  >Proof of Bank Account Ownership (i.e. bank statement)</span
                >

                <div class="photo-label-wrapper">
                  <label
                    for="bankOwnershipProof"
                    class="btn btn_fix-width btn_block border photo-btn"
                    >Upload</label
                  >
                </div>

                <input
                  type="file"
                  id="bankOwnershipProof"
                  accept=".jpg,.jpeg,.png,.tiff,.pdf"
                  ref="bankOwnershipProof"
                  name="bankOwnershipProof"
                  @change="upload"
                />
              </div>
            </div>
          </div>

          <div class="form-group-btn">
            <button
              type="submit"
              class="btn lg btn_fix-width saveChanges"
              :disabled="
                saving || !bankOwnershipProof || bankOwnershipProofUploading
              "
            >
              Next
            </button>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import upload from "@/utils/upload";
import UserMixin from "@/mixins/user";

export default {
  name: "BankProofFormLegal",
  mixins: [UserMixin],
  data() {
    return {
      bankOwnershipProof: null,
      bankOwnershipProofUploading: false
    };
  },
  computed: {
    loading() {
      return (
        this.$store.state.payouts.countries.fetchLoading ||
        this.$store.state.states.fetchLoading
      );
    },
    saving() {
      return this.$store.state.payouts.legal.saveLoading;
    },
    legal() {
      return this.$store.state.payouts.legal.fetchResult;
    },
    legalExists() {
      return this.legal && this.legal.type;
    }
  },
  methods: {
    async upload(e) {
      const refName = e.target.name;
      this[`${refName}Uploading`] = true;
      try {
        this[refName] = await upload(this.$refs[refName].files[0], "doc");
        this[`${refName}Uploading`] = false;
      } catch (error) {
        this[`${refName}Uploading`] = false;
        this.$store.dispatch("global/setError", error);
      }
    },
    save() {
      const data = {
        ...this.legal,
        bankOwnershipProof: this.bankOwnershipProof
      };
      delete data.isNeedBankProof;
      delete data.isNeedIdDocs;
      delete data.isNeedW9;
      this.$store
        .dispatch("payouts/legal/save", { data, update: true })
        .then(r => {
          if (!r.type) {
            return;
          }
          this.$store.commit("payouts/legal/updateData", {
            key: "isNeedBankProof",
            value: false
          });
        });
    }
  },
  mounted() {
    this.$emit("titleChanged", "Additional Verification");
  }
};
</script>

<style lang="scss" scoped>
.PayoutsLegalBankProofView {
  .payouts-legal-form {
    .label {
      flex: 1 1;
    }
  }
}
</style>
