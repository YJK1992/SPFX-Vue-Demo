<template>
  <div id="app">
    <div class="left">
      <v-nav></v-nav>
    </div>
    <div class="right">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
import LeftNav from "./LeftNav.vue";
export default {
  name: "app",
  data() {
    return {
      msg: "Welcome to SPFX-Vue"
    };
  },
  components: {
    'v-nav': LeftNav
  }
};
</script>
<style>
.left {
  width: 20%;
  float: left;
  margin-top: -4px;
}

.right {
  width: 78%;
  float: right;
}
</style>
