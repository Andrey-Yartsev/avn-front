<template>
  <div class="payouts-legal" v-if="!loading">
    <div class="PayoutsLegalView PayoutsLegalBankProofView">
      <h1 class="form-title settings-title">
        Additional Verification Document Required
      </h1>

      <form class="payouts-legal-form" v-on:submit.stop.prevent="save">
        <div class="border-top shadow-block">
          <div class="container">
            <div class="form-group form-group_with-label gender-options">
              <label class="form-group-inner">
                <span class="label">Document Type</span>
                <div class="form-group form-group_clear-gaps">
                  <div class="select-wrapper">
                    <select
                      name="type"
                      id="legal-type"
                      required
                      v-model="backsideDocRequired"
                      v-validate="'required'"
                      @change="handleChangeDocIdType"
                    >
                      <option value="" disabled>Select ID Document Type</option>
                      <option
                        v-for="doc of getAllowedDocsOptions"
                        :key="doc.type"
                        :data-name="doc.type"
                        :value="doc.backsideRequired"
                        >{{ doc.name }}</option
                      >
                    </select>
                  </div>
                </div>
              </label>
            </div>

            <template v-if="backsideDocRequired !== ''">
              <div class="form-group form-group_with-label photo-form-group">
                <div
                  class="form-group-inner photo-form-group-inner"
                  :class="{ 'success icn-item': !!personalIdImage }"
                >
                  <span class="label">Photo ID (front side)</span>

                  <div class="photo-label-wrapper">
                    <label
                      for="personalIdImage"
                      class="btn btn_fix-width btn_block border photo-btn"
                      >Upload</label
                    >
                  </div>

                  <input
                    type="file"
                    id="personalIdImage"
                    accept=".jpg,.jpeg,.png"
                    ref="personalIdImage"
                    name="personalIdImage"
                    @change="upload"
                  />
                </div>
              </div>
              <div
                v-if="backsideDocRequired === true"
                class="form-group form-group_with-label photo-form-group"
              >
                <div
                  class="form-group-inner photo-form-group-inner"
                  :class="{ 'success icn-item': !!personalIdImageBackside }"
                >
                  <span class="label">Photo ID (back side)</span>

                  <div class="photo-label-wrapper">
                    <label
                      for="personalIdImageBackside"
                      class="btn btn_fix-width btn_block border photo-btn"
                      >Upload</label
                    >
                  </div>

                  <input
                    type="file"
                    id="personalIdImageBackside"
                    accept=".jpg,.jpeg,.png"
                    ref="personalIdImageBackside"
                    name="personalIdImageBackside"
                    @change="upload"
                  />
                </div>
              </div>
              <div class="form-group form-group_with-label photo-form-group">
                <div
                  class="form-group-inner photo-form-group-inner"
                  :class="{ 'success icn-item': !!selfieImage }"
                >
                  <span class="label">Selfie</span>

                  <div class="photo-label-wrapper">
                    <label
                      for="selfieImage"
                      class="btn btn_fix-width btn_block border photo-btn"
                      >Upload</label
                    >
                  </div>

                  <input
                    type="file"
                    id="selfieImage"
                    accept=".jpg,.jpeg,.png"
                    ref="selfieImage"
                    name="selfieImage"
                    @change="upload"
                  />
                </div>
              </div>
            </template>

            <div class="form-group-btn">
              <button
                type="submit"
                class="btn lg btn_fix-width saveChanges"
                :disabled="
                  !canSave ||
                    saving ||
                    personalIdImageUploading ||
                    personalIdImageBacksideUploading ||
                    selfieImageUploading
                "
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import upload from "@/utils/upload";
import UserMixin from "@/mixins/user";
import States from "./states";

export default {
  name: "IdDocsFormLegal",
  mixins: [UserMixin, States],
  data() {
    return {
      personalIdImage: null,
      personalIdImageBackside: null,
      selfieImage: null,
      personalIdImageUploading: false,
      personalIdImageBacksideUploading: false,
      selfieImageUploading: false,
      backsideDocRequired: "",
      docIdType: ""
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
    },
    getAllowedDocsOptions() {
      return this.account.countryAllowedDocTypes.map(item => {
        let name = "";
        switch (item.type) {
          case "idCard":
            name = "ID Card";
            break;
          case "passport":
            name = "Passport";
            break;
          case "driverLicense":
            name = "Driver License";
            break;
          default:
            break;
        }
        item.name = name;
        return item;
      });
    },
    isRequiredImagesUploaded() {
      if (this.backsideDocRequired === "") {
        return false;
      }
      if (this.backsideDocRequired) {
        return (
          this.personalIdImage &&
          this.personalIdImageBackside &&
          this.selfieImage
        );
      }
      if (!this.backsideDocRequired) {
        return this.personalIdImage && this.selfieImage;
      }
    },
    canSave() {
      if (!this.isRequiredImagesUploaded && !this.legalExisted) {
        return false;
      }
      return true;
    }
  },
  methods: {
    async upload(e) {
      const refName = e.target.name;
      this[`${refName}Uploading`] = true;
      try {
        this[refName] = await upload(this.$refs[refName].files[0]);
        this[`${refName}Uploading`] = false;
      } catch (error) {
        this[`${refName}Uploading`] = false;
        this.$store.dispatch("global/setError", error);
      }
    },
    save() {
      const data = {
        ...this.legal,
        personalIdImage: this.personalIdImage,
        personalIdImageBackside: this.personalIdImageBackside,
        selfieImage: this.selfieImage,
        backsideRequired: this.backsideDocRequired,
        docIdType: this.docIdType
      };
      this.$store.dispatch("payouts/legal/save", data).then(r => {
        if (!r.type) {
          return;
        }
        this.$store.dispatch("payouts/legal", {
          key: "isNeedIdDocs",
          value: false
        });
      });
    },
    handleChangeDocIdType(e) {
      this.docIdType = e.target.selectedOptions[0].dataset.name;
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
