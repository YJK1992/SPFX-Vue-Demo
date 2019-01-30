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
          <el-menu-item index="/gppayremittancereport" v-show="GPShow">汇款</el-menu-item>
          <el-menu-item index="/gppaytaxbillreport1" v-show="GPShow">税票清单数据导出F43</el-menu-item>
          <el-menu-item index="/gppaytaxbillreport2" v-show="GPShow">税票清单数据导出F53</el-menu-item>
          <el-menu-item index="/gppaybillreport" v-show="GPShow">Paybill</el-menu-item>
          <el-menu-item index="/gppayassetreport" v-show="GPShow">资产对公付款报表</el-menu-item>
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
          <el-menu-item index="/ptptemp1">费用明细表</el-menu-item>
          <el-menu-item index="/ptptemp2" v-show="PTPShow">入账表</el-menu-item>
          <el-menu-item index="/ptptemp3" v-show="PTPShow">付款表</el-menu-item>
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
      hostUrl: this.GLOBAL.URL,
      userId: 0,
      loginName: "",
      GPShow: false,
      PTPShow: false
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
    },
    getCurrentUser: function() {
      var parm = {
        action: "CurrentUser",
        type: "get",
        baseUrl: this.hostUrl
      };
      var option = common.queryOpt(parm);
      $.when($.ajax(option))
        .done(c => {
          var loginName = c.d.LoginName.split("|membership|")[1];
          this.loginName = loginName.split("@")[0];
          this.userId = c.d.Id;
          var parm2 = {
            action: "UserGroup",
            type: "get",
            userID: this.userId,
            baseUrl: this.hostUrl
          };
          var opt = common.queryOpt(parm2);
          $.when($.ajax(opt))
            .done(req => {
              var data = req.d.results;
              if (data.length > 0) {
                for (var i = 0; i < data.length; i++) {
                  if (
                    data[i].Title == "GPSettlement" ||
                    data[i].Title == "GPSignApprove"
                  ) {
                    this.GPShow = true;
                  }
                  if (data[i].Title == "PTPAccounting") {
                    this.PTPShow = true;
                  }
                }
              }
            })
            .catch(err => {
              this.$message(common.message("error", "加载当前用户组出错!"));
            });
        })
        .catch(err => {
          this.$message(common.message("error", "加载当前用户出错!"));
        });
    } //获取当前用户并验证员工表是否存在当前用户
  },
  mounted: function() {
    //this.$router.push("/createecctask");
    //:default-active="$router.path"
    this.getCurrentUser();
  }
};
</script>

