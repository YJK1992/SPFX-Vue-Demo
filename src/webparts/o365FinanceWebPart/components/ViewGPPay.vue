<template>
  <div id="ViewGpPurchase">
    <el-form :inline="true" :model="Condition" class="demo-form-inline">
      <el-form-item label="申请日期">
        <el-date-picker
          value-format="yyyy-MM-dd"
          v-model="Condition.ApplicationDate"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="结算方式">
        <el-select v-model="Condition.SettlementType" placeholder="请选择">
          <el-option
            v-for="item in SettlementType"
            :key="item.value"
            :label="item.value"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="申请单号">
        <el-input v-model="Condition.ApplicationNumber" placeholder="申请单号"></el-input>
      </el-form-item>
      <el-form-item label="经办人ID">
        <el-input v-model="Condition.TrusteesEmail" placeholder="经办人"></el-input>
      </el-form-item>
      <el-form-item label="公司代码">
        <el-select v-model="Condition.CompanyCode" placeholder="请选择">
          <el-option
            v-for="item in CompanyCodeArr"
            :key="item.CompanyCode"
            :label="item.CompanyCode"
            :value="item.CompanyCode"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="Condition={}">重置</el-button>
        <el-button type="primary" @click="SearchArr()">查询</el-button>
      </el-form-item>
    </el-form>

    <table class="ViewGpPurchase">
      <tr id="View_GpPurchase">
        <td>经办人</td>
        <td style="width: 300px;">申请单号</td>
        <td>报销类型</td>
        <td>费用科目</td>
        <td>结算方式</td>
        <td>成本中心</td>
        <td>发票金额</td>
        <td>币种</td>
        <td>经办人ID</td>
        <td>公司代码</td>
        <td>流程节点</td>
        <td>任务ID</td>
        <td>操作</td>
      </tr>
      <tr v-for="(subItems,index) in newArr">
        <template v-for="(subItem,cindex) in subItems">
          <td>{{subItem}}</td>
        </template>
        <td>
          <el-button @click="onViewItem(index)" size="small">查看</el-button>
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
      msg: "My Gp PP",
      hostUrl: this.GLOBAL.URL, //已在Web Part中注册了此变量
      GpTaskListName: "PaymentApproval 任务",
      GpMainListName: "PublicPayment",
      userListName: "EmployeeList", //员工详细信息列表名称
      MyTask: [],
      gpItems: [],
      //筛选条件
      Condition: {
        SettlementType: "", //结算方式
        ApplicationDate: "", //申请日期
        CompanyCode: "", //公司代码
        TrusteesEmail: "", //经办人Id
        ApplicationNumber: "" //申请单号
      },
      CompanyCodeArr: [], //公司代码
      //结算方式
      SettlementType: [
        {
          value: "清帐",
          label: "清帐"
        },
        {
          value: "支票",
          label: "支票"
        },
        {
          value: "汇款",
          label: "汇款"
        },
        {
          value: "信用证",
          label: "信用证"
        },
        {
          value: "汇票",
          label: "汇票"
        }
      ],
      userId: 0,
      newArr: [],
      loading: true
    };
  },
  methods: {
    SearchArr() {
      var newCond = Object.keys(this.Condition);
      console.log(newCond);

      newCond.forEach(item => {
        if (this.Condition[item] == "") {
          delete this.Condition[item];
        }
      });
      console.log(this.Condition);

      var keys = Object.keys(this.Condition);
      var result = this.gpItems.filter(item => {
        return keys.every(key => this.Condition[key].indexOf(item[key]) !== -1);
      });
      this.newArr = result;
      console.log(result);
    },
    //获取公司代码
    getCompanyCode: function() {
      //获取公司代码和成本中心
      var parm = {
        type: "get",
        action: "ListItems",
        list: this.userListName,
        condition: "",
        baseUrl: this.hostUrl
      };
      var opt = common.queryOpt(parm);
      $.when($.ajax(opt)).done(req => {
        var data = req.d.results;
        if (data.length > 0) {
          var companycode = []; //未去重公司代码
          //填充原始数据
          data.forEach(d => {
            companycode.push(d.CompanyCode);
          });
          //去重操作
          var comopanyCodeUnique = companycode.filter(function(
            element,
            index,
            array
          ) {
            return array.indexOf(element) === index;
          });

          comopanyCodeUnique.forEach(element => {
            this.CompanyCodeArr.push({
              CompanyCode: element
            });
          });
        }
      });
    },
    onViewItem(index) {
      console.log(index);
      var item = this.gpItems[index];
      var ApplicantNumber = item.ApplicationNumber;
      var TaskId = item.TaskId;
      console.log(ApplicantNumber);
      console.log(item.Step);
      this.$router.push({
        path: "/editgppay",
        query: {
          ApplicantNumber: ApplicantNumber,
          Step: item.Step,
          TaskId: TaskId
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
    getMyTask: function(userId) {
      var condition =
        "?$filter=PercentComplete eq 0 and AssignedToId eq " +
        userId +
        "&$orderby=ID desc&$top=2000";
      var parm = {
        action: "ListItems",
        type: "get",
        list: this.GpTaskListName,
        baseUrl: this.hostUrl,
        condition: condition
      }; //Completed 已完成
      var option = common.queryOpt(parm);
      $.when($.ajax(option))
        .done(req => {
          console.log("Task success");
          var data = req.d.results;
          if (data.length > 0) {
            data.forEach(d => {
              var mainInfo = JSON.parse(d.RelatedItems);
              var step = d.Title;
              var taskId = d.Id;
              var itemId = mainInfo[0].ItemId;
              this.getGpPRListData(itemId, step, taskId);
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
    getGpPRListData: function(itemId, step, taskId) {
      var parm = {
        action: "ListItem",
        type: "get",
        list: this.GpMainListName,
        baseUrl: this.hostUrl,
        itemID: itemId
      };

      var option = common.queryOpt(parm);
      $.when($.ajax(option))
        .done(req => {
          console.log("getGpPRListData");
          var data = req.d;
          this.gpItems.push({
            Trustees: data.Trustees,
            ApplicationNumber: data.ApplicationNumber,
            ReimbursementType: data.ReimbursementType,
            CostAccount: data.CostAccount,
            SettlementType: data.SettlementType,
            CostCenter: data.CostCenter,
            InvoiceValue: data.InvoiceValue,
            Currency: data.Currency,
            TrusteesEmail: data.TrusteesEmail,
            CompanyCode: data.CompanyCode,
            Step: step,
            TaskId: taskId
          });
          console.log(this.gpItems);
        })
        .catch(err => {
          this.$message(common.message("error", "获取GpPP数据失败!"));
        });
    }
  },
  mounted: function() {
    this.loading = true;
    this.getCurrentUser();
    this.getCompanyCode();
    this.loading = false;
  }
};
</script>

<style>
.ViewGpPurchase tr td {
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
.ViewGpPurchase {
  min-height: 25px;
  line-height: 25px;
  text-align: center;
  border-collapse: collapse;
  color: gray;
  padding: 2px;
}
</style>
