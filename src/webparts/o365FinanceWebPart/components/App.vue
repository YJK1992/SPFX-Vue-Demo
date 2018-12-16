<template>
  <div id="app">
    <el-container>
      <el-aside width="200px">
        <v-nav></v-nav>
      </el-aside>
      <el-main style="width: 1000px;margin-top: -20px;">
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
      msg: "Welcome to SPFX-Vue",
      list: [
        {
          Name: "Home",
          Path: "/home"
        },
        {
          Name: "Create ECC Task",
          Path: "/createecctask"
        },
        {
          Name: "Create GP Purchase Task",
          Path: "/creategppurchasetask"
        },
        {
          Name: "Create GP Pay Task",
          Path: "/creategppaytask"
        },
        {
          Name: "Create PTP Task",
          Path: "/createptptask"
        },
        {
          Name: "My Agent",
          Path: "/myagent"
        },
        {
          Name: "Create By Me",
          Path: "/createbyme"
        }
      ],
    };
  },
  components: {
    "v-nav": LeftNav
  }
};
</script>


