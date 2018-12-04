<template>
  <div id="app">
    <el-container>
      <el-aside width="200px">
        <v-nav></v-nav>
      </el-aside>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
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
    "v-nav": LeftNav
  }
};
</script>

