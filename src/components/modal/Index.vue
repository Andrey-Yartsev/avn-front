<template>
    <div class="popup">
        <div class="overlay"></div>
        <div class="popup-container">
            <slot name="content"></slot>
        </div>
    </div>
</template>

<script>
export default {
  name: "Modal"
};
</script>
