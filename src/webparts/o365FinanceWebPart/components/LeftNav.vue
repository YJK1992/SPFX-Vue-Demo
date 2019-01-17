<template>
  <div id="LeftNav">
    <el-menu
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
          <el-menu-item index="/createecctask">固资申请</el-menu-item>
          <el-menu-item index="/viewecctask">我的待办</el-menu-item>
          <el-menu-item index="/myeccdraft">我的草稿</el-menu-item>
          <el-menu-item index="/eccreport">固资报表</el-menu-item>
        </el-menu-item-group>
      </el-submenu>
      <el-submenu index="2">
        <template slot="title">
          <i class="el-icon-location"></i>
          <span>GP申请</span>
        </template>
        <el-menu-item-group>
          <el-menu-item index="/creategppurchasetask">采购申请</el-menu-item>
          <el-menu-item index="/viewgppurtasks">我的待办</el-menu-item>
          <el-menu-item index="/viewgppurdraft">我的草稿</el-menu-item>
          <el-menu-item index="/gppurchasereport">采购申请报表</el-menu-item>
        </el-menu-item-group>
      </el-submenu>
      <el-submenu index="3">
        <template slot="title">
          <i class="el-icon-location"></i>
          <span>GP付款</span>
        </template>
        <el-menu-item-group>
          <el-menu-item index="/creategppaytask">对公付款</el-menu-item>
          <el-menu-item index="/viewgppay">我的待办</el-menu-item>
          <el-menu-item index="/mygppaydraft">我的草稿</el-menu-item>
          <el-menu-item index="/gppayreport">GP付款总表</el-menu-item>
          <el-menu-item index="/gppayremittancereport">汇款</el-menu-item>
          <el-menu-item index="/gppaytaxbillreport1">税票清单数据导出F43</el-menu-item>
          <el-menu-item index="/gppaytaxbillreport2">税票清单数据导出F53</el-menu-item>
          <el-menu-item index="/gppaybillreport">Paybill</el-menu-item>
          <el-menu-item index="/gppayassetreport">资产对公付款报表</el-menu-item>
          <!-- <el-menu-item index="/myapplication">我的申请</el-menu-item> -->
        </el-menu-item-group>
      </el-submenu>
      <el-submenu index="4">
        <template slot="title">
          <i class="el-icon-location"></i>
          <span>员工报销</span>
        </template>
        <el-menu-item-group>
          <el-menu-item index="/createptptask">员工报销申请</el-menu-item>
          <el-menu-item index="/viewptptasks">我的待办</el-menu-item>
          <el-menu-item index="/myptpdraft">我的草稿</el-menu-item>
          <el-menu-item index="/ptptemp1">员工报销报表1</el-menu-item>
          <el-menu-item index="/ptptemp2">员工报销报表2</el-menu-item>
          <el-menu-item index="/ptptemp3">员工报销报表3</el-menu-item>
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
    //this.$router.push("/createecctask");
    //:default-active="$router.path"
  }
};
</script>

