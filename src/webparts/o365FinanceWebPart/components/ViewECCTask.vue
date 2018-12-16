<template>
  <el-table :data="eccItems" border style="width: 100%" v-loading="loading">
    <el-table-column fixed prop="Applicant" label="申请人" width="150"></el-table-column>
    <el-table-column prop="Title" label="申请单号" width="120"></el-table-column>
    <el-table-column prop="CostCenter" label="成本中心" width="120"></el-table-column>
    <el-table-column prop="CompanyCode" label="公司代码" width="120"></el-table-column>
    <el-table-column prop="ApplicationType" label="申请类别" width="300"></el-table-column>
    <el-table-column prop="ProductType" label="产品类型" width="120"></el-table-column>
    <el-table-column
      fixed="right"
      label="操作"
      width="100">
      <template slot-scope="scope">
        <el-button @click="handleClick(scope.$index)" type="text" size="medium">编辑</el-button>
      </template>
    </el-table-column>
  </el-table>
</template>
<script>
import $ from "jquery";
import common from "../js/common.js";
export default {
  data() {
    return {
      msg: "My ECC Tasks",
      hostUrl: this.GLOBAL.URL, //已在Web Part中注册了此变量
      eccTaskListName: "Workflow Tasks",//WorkflowTasks  ECCApproval 任务
      eccMainListName: "ECC", //ECC列表名
      userListName: "EmployeeList", //员工详细信息列表名称
      MyTask: [],
      eccItems: [],
      userId: 0,
      loading: true
    };
  },
  methods: {
    handleClick(row) {
      console.log(row);
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
          this.userId = c.d.Id;
          console.log(this.userId);
          this.search(loginName, this.userId);
        })
        .catch(err => {
          this.$message(common.message("error", "加载当前用户出错!"));
        });
    },
    getMyTask: function(userId) {
      var parm = {
        action: "ListItems",
        type: "get",
        list: this.eccTaskListName,
        baseUrl: this.hostUrl,
        condition:
          "?$filter=AssignedToId eq " + userId + " and Status ne 'Completed'"
      };//Completed 已完成
      var option = common.queryOpt(parm);
      $.when($.ajax(option))
        .done(req => {
          var data = req.d.results;
          if (data.length > 0) {
            data.forEach(d => {
              var mainInfo = JSON.parse(d.RelatedItems);
              var itemId = mainInfo[0].ItemId;
              this.getECCListData(itemId);
            });
          } else {
            this.$message(common.message("error", "当前用户无代办任务!"));
          }
        })
        .catch(err => {
          this.$message(common.message("error", "获取任务失败!"));
        });
    },
    search: function(userLoginName, userId) {
      var parm = {
        type: "get",
        action: "ListItems",
        list: this.userListName,
        condition: "?$filter=EmployeeID eq  '" + userLoginName + "'",
        baseUrl: this.hostUrl
      };
      var opt = common.queryOpt(parm);
      $.when($.ajax(opt))
        .done(req => {
          var data = req.d.results;
          if (data.length > 0) {
            console.log("Current user is in employee list!");
            this.getMyTask(userId);
          } else {
            this.$message(
              common.message(
                "error",
                "当前用户不在员工信息列表中,请及时与管理员联系!"
              )
            );
          }
        })
        .catch(err => {
          this.loading = false;
          this.$message(common.message("error", "检查当前用户出现错误!"));
        });
    }, //验证用户是否存在于员工表中
    getECCListData: function(itemId) {
      var parm = {
        action: "ListItem",
        type: "get",
        list: this.eccMainListName,
        baseUrl: this.hostUrl,
        itemID: itemId
      };
      var option = common.queryOpt(parm);
      $.when($.ajax(option))
        .done(req => {
          var data = req.d;
          this.eccItems.push({
            Applicant: data.Applicant,
            CostCenter: data.CostCenter,
            CompanyCode: data.CompanyCode,
            Title: data.Title,
            ApplicationType: data.ApplicationType,
            ProductType: data.ProductType
          });
        })
        .catch(err => {
          this.$message(common.message("error", "获取ECC数据失败!"));
        });
    }
  },
  mounted: function() {
    this.loading = true;
    this.getCurrentUser();
    this.loading = false;
  }
};
</script>