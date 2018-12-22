<template>
  <div id="LeftNav">
    <el-menu
      :default-active="$router.path"
      class="el-menu-vertical-demo"
      @open="handleOpen"
      @close="handleClose"
      @select="handleSelect"
    >
      <el-submenu index="1">
        <template slot="title">
          <i class="el-icon-location"></i>
          <span>固资申请</span>
        </template>
        <el-menu-item-group>
          <el-menu-item index="/viewecctask">我的待办</el-menu-item>
          <el-menu-item index="/myeccdraft">我的草稿</el-menu-item>
          <el-menu-item index="/createecctask">固资申请</el-menu-item>
          <el-menu-item index="/eccreport">固资报表</el-menu-item>
        </el-menu-item-group>
      </el-submenu>
      <el-submenu index="2">
        <template slot="title">
          <i class="el-icon-location"></i>
          <span>GP申请</span>
        </template>
        <el-menu-item-group>
          <el-menu-item index="/viewgppurtasks">我的GP待办</el-menu-item>
          <el-menu-item index="/viewgppurdraft">我的GP申请草稿</el-menu-item>
          <el-menu-item index="creategppurchasetask">创建GP申请</el-menu-item>
          <!-- <el-menu-item index="1-2">ECC报表</el-menu-item> -->
        </el-menu-item-group>
      </el-submenu>
      <el-submenu index="3">
        <template slot="title">
          <i class="el-icon-location"></i>
          <span>GP付款</span>
        </template>
        <el-menu-item-group>
          <el-menu-item index="/viewgppay">我的GP付款待办</el-menu-item>
          <el-menu-item index="/mygppaydraft">我的GP付款草稿</el-menu-item>
          <el-menu-item index="/creategppaytask">创建GP付款</el-menu-item>
          <!-- <el-menu-item index="1-2">ECC报表</el-menu-item> -->
        </el-menu-item-group>
      </el-submenu>
      <el-submenu index="4" disabled>
        <template slot="title">
          <i class="el-icon-location"></i>
          <span>员工报销</span>
        </template>
        <el-menu-item-group>
          <el-menu-item index="/viewgppay">ECC待办</el-menu-item>
          <el-menu-item index="/mygppaydraft">我的ECC草稿</el-menu-item>
          <el-menu-item index="/creategppaytask">ECC申请</el-menu-item>
          <!-- <el-menu-item index="1-2">ECC报表</el-menu-item> -->
        </el-menu-item-group>
      </el-submenu>
    </el-menu>
  </div>
</template>

<script>
import common from "../js/common.js";
export default {
  data() {
    return {
      msg: this.GLOBAL.URL
    };
  },
  methods: {
    handleOpen(key, keyPath) {
      console.log(key, keyPath);
    },
    handleClose(key, keyPath) {
      console.log(key, keyPath);
    },
    handleSelect(key, keyPath) {
      console.log(keyPath);
      this.$router.push(keyPath[1]);
    }
  },
  mounted: function() {
    this.$router.push("/createecctask");
  }
};
</script>

