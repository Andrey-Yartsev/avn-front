<template>
  <div class="chatCollectionView">
    <div class="chatCollectionContent">
      <div class="chatCollectionContent__col chatCollectionContent__col_narrow">
        <div class="chat-container">
          <slot name="col1"></slot>
        </div>
      </div>
      <div class="chatCollectionContent__col chatCollectionContent__col_wide">
        <slot name="col2"></slot>
      </div>
      <slot name="extra"></slot>
    </div>
  </div>
</template>
