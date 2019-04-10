<template>
  <div id="ViewPtp">
    <el-form :inline="true" :model="Condition" class="demo-form-inline">
      <el-form-item label="申请日期">
        <el-date-picker
          value-format="yyyyMMdd"
          v-model="ApplicationDate"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="申请单号">
        <el-input v-model="Condition.Title" placeholder="申请单号"></el-input>
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
        <el-button type="primary" @click="ClearCondition()">重置</el-button>
        <el-button type="primary" @click="SearchArr()">查询</el-button>
      </el-form-item>
    </el-form>

    <table class="ViewPtp">
      <tr id="View_Ptp">
        <td>经办人</td>
        <td style="width: 300px;">申请单号</td>
        <td>成本中心</td>
        <td>经办人ID</td>
        <td>公司代码</td>
        <td>流程节点</td>
        <td>任务ID</td>
        <td>操作</td>
      </tr>
      <tr v-for="(subItems,index) in newArr">
        <template v-for="(subItem,cindex) in subItems">
          <td v-if="cindex!='Created'">{{subItem}}</td>
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
      msg: "My PTP",
      hostUrl: this.GLOBAL.URL, //已在Web Part中注册了此变量
      GpTaskListName: "StaffReimbursementApproval Tasks",
      PtpMainListName: "StaffReimbursement",
      userListName: "EmployeeList", //员工详细信息列表名称
      MyTask: [],
      gpItems: [],
      //筛选条件
      Condition: {
        CompanyCode: "", //公司代码
        TrusteesEmail: "", //经办人Id
        ApplicationNumber: "" //申请单号
      },
      ApplicationDate: "", //申请日期
      CompanyCodeArr: [], //公司代码
      userId: 0,
      newArr: [],
      loading: true
    };
  },
  methods: {
    ClearCondition(){
        this.Condition={};
        this.ApplicationDate="";
    },
    SearchArr() {
      var newCond = Object.keys(this.Condition);
      console.log(newCond);

      newCond.forEach(item => {
        if (this.Condition[item] == "") {
          delete this.Condition[item];
        }
      });

      var keys = Object.keys(this.Condition);
      var result = this.gpItems.filter(item => {
        return keys.every(key => this.Condition[key].indexOf(item[key]) !== -1);
      });

      console.log(this.ApplicationDate);
      if (this.ApplicationDate != "" && this.ApplicationDate!=null) {
        //过滤时间
        var start = Number(this.ApplicationDate[0]);
        var end = Number(this.ApplicationDate[1]);
        var filterData = [];
        result.forEach(element => {
          if (element.Created >= start && element.Created <= end) {
            filterData.push(element);
          }
        });
        console.log("filterData");
        console.log(filterData);
        this.newArr = filterData;
      } else {
        console.log("result");
        console.log(result);
        this.newArr = result;
      }
      console.log("this.newArr");
      console.log(this.newArr);

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
      var item = this.newArr[index];
      var ApplicantNumber = item.Title;
      var TaskId = item.TaskId;
      console.log(ApplicantNumber);
      console.log(item.Step);
      this.$router.push({
        path: "/editptp",
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
              this.getPtpListData(itemId, step, taskId);
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
    getPtpListData: function(itemId, step, taskId) {
      var parm = {
        action: "ListItem",
        type: "get",
        list: this.PtpMainListName,
        baseUrl: this.hostUrl,
        itemID: itemId
      };

      var option = common.queryOpt(parm);
      $.when($.ajax(option))
        .done(req => {
          console.log("getPtpListData");
          var data = req.d;
          this.gpItems.push({
            Applicant: data.Applicant,
            Title: data.Title,
            // AccountNumber: data.AccountNumber,
            CostCenter: data.CostCenter,
            ID:"",
            CompanyCode: data.CompanyCode,
            Created: Number(data.Created.substring(0, data.Created.indexOf("T")).replace("-","").replace("-","")),
            Step: step,
            TaskId: taskId
          });
          console.log(this.gpItems.Created);
          console.log("gpItems");
          console.log(this.gpItems);
        })
        .catch(err => {
          this.$message(common.message("error", "获取PTP数据失败!"));
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
.ViewPtp tr td {
  border: 1px solid #cfcfcf;
  padding: 5px;
  width: 140px;
}
#View_Ptp td {
  background-color: #409eff;
  font-weight: bold;
  color: white;
  border: 0px;
}
.ViewPtp {
  min-height: 25px;
  line-height: 25px;
  text-align: center;
  border-collapse: collapse;
  color: gray;
  padding: 2px;
}
</style>
