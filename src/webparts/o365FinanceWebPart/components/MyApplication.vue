<template>
  <div id="MyApplication">
    <table class="ViewGpPay">
      <tr id="View_GpPurchase">
        <td style="width: 300px;">申请单号</td>
        <td>报销类型</td>
        <td>结算方式</td>
        <td>发票金额</td>
        <td>币种</td>
        <td>操作</td>
      </tr>
      <tr v-for="(subItems,index) in MainList">
        <template v-for="(subItem,cindex) in subItems">
          <td v-if="cindex!='Created'">{{subItem}}</td>
        </template>
        <td>
          <el-button @click="viewItem(index)" size="small">查看</el-button>
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
      msg: "MyApplication",
      hostUrl: this.GLOBAL.URL, //已在Web Part中注册了此变量,
      MainList: [], //主表数据
      mainListName: "PublicPayment", //对公付款主表
      userListName: "EmployeeList" //员工表
    };
  },
  methods: {
    viewItem: function(index) {
      var applicantNumber = this.MainList[index].ApplicationNumber;
      this.$router.push({
        path: "/detailgppay",
        query: {
          ApplicantNumber: applicantNumber
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
            this.getMyApplication(userLoginName);
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
    },
    getMyApplication(userLoginName) {
      var loginName=userLoginName.substring(0,userLoginName.indexOf('@'));
      var parm = {
        type: "get",
        action: "ListItems",
        list: this.mainListName,
        baseUrl: this.hostUrl,
        condition: "?$filter=TrusteesEmail eq '" + loginName + "'"
      };
      var option = common.queryOpt(parm);
      $.when($.ajax(option)).done(req => {
        var data = req.d.results;
        if (data.length > 0) {
          data.forEach(d => {
            this.MainList.push({
              ApplicationNumber: d.ApplicationNumber, //申请单号
              ReimbursementType: d.ReimbursementType, //报销类型
              SettlementType: d.SettlementType, //结算方式
              InvoiceValue: d.InvoiceValue, //发票金额
              Currency: d.Currency //币种
            });
          });
        }
      });
    }
  },
  mounted: function() {
    this.getCurrentUser();
  }
};
</script>

<style>
.ViewGpPay tr td {
  border: 1px solid #cfcfcf;
  padding: 5px;
  width: 140px;
}
#View_GpPurchase td {
  background-color: #409eff;
  font-weight: bold;
  color: white;
  border: 0px;
}
.ViewGpPay {
  min-height: 25px;
  line-height: 25px;
  text-align: center;
  border-collapse: collapse;
  color: gray;
  padding: 2px;
}
</style>
