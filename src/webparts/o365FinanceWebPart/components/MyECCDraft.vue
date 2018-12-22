<template>
  <div id="ViewECCDraft">
    <table class="ViewECCDraftTop">
      <tr id="View_ECCDraftTable">
        <td>申请人</td>
        <td style="width: 300px;">申请单号</td>
        <td>成本中心</td>
        <td>公司代码</td>
        <td>申请类别</td>
        <td>产品类型</td>
        <td>操作</td>
      </tr>
      <tr v-for="(subItems,index) in eccItems">
        <template v-for="(subItem,cindex) in subItems">
          <td>{{subItem}}</td>
        </template>
        <td>
          <el-button @click="onEditItem(index)" size="small">编辑</el-button>
        </td>
      </tr>
    </table>
  </div>
</template>
<script>
import $ from "jquery";
import common from "../js/common.js";
export default {
  data() {
    return {
      msg: "My ECC Draft",
      hostUrl: this.GLOBAL.URL, //已在Web Part中注册了此变量
      eccMainListName: "ECC", //ECC列表名
      userListName: "EmployeeList", //员工详细信息列表名称
      MyTask: [],
      eccItems: [],
      userId: 0,
      loading: true
    };
  },
  methods: {
    onEditItem(index) {
      console.log(index);
      var item = this.eccItems[index];
      var ApplicantNumber = item.Title;
      this.$router.push({
        path: "/editecctask",
        query: {
          ApplicantNumber: ApplicantNumber,
          Step: "Application",
          TaskId: 0
        }
      });
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
    getMyDraft: function(userId) {
      var parm = {
        action: "ListItems",
        type: "get",
        list: this.eccMainListName,
        baseUrl: this.hostUrl,
        condition: "?$filter=AuthorId eq " + userId + " and Status eq 'Draft'&$orderby=ID desc&$top=2000"
      };
      var option = common.queryOpt(parm);
      $.when($.ajax(option))
        .done(req => {
          var data = req.d.results;
          if (data.length > 0) {
            data.forEach(d => {
              this.eccItems.push({
                Applicant: d.Applicant,
                Title: d.Title,
                CostCenter: d.CostCenter,
                CompanyCode: d.CompanyCode,
                ApplicationType: d.ApplicationType,
                ProductType: d.ProductType
              });
            });
          } else {
            this.$message(common.message("error", "当前用户无草稿数据!"));
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
            this.getMyDraft(userId);
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
    } //验证用户是否存在于员工表中
  },
  mounted: function() {
    this.loading = true;
    this.getCurrentUser();
    this.loading = false;
  }
};
</script>

<style>
.ViewECCDraftTop tr td {
  border: 1px solid #cfcfcf;
  padding: 5px;
  width: 140px;
}
#View_ECCDraftTable td {
  background-color: #409eff;
  font-weight: bold;
  color: white;
  border: 0px;
}
.ViewECCDraftTop {
  min-height: 25px;
  line-height: 25px;
  text-align: center;
  border-collapse: collapse;
  color: gray;
  padding: 2px;
}
</style>
