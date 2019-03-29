<template>
  <div>
    <table class="detailyuangong" style="border-collapse: collapse;width:100%">
      <tr>
        <td colspan="8">
          <span style="font-size:30px;color:#409eff;">员工报销模板</span>
          <div style="float:right">
            <el-button :disabled="!IsDisable" type="primary" @click="printDeal">打印</el-button>
          </div>
        </td>
      </tr>
      <tr>
        <td align="right">报销单号：</td>
        <td colspan="7">
          <el-input v-model="StaffReimbursement.Title" disabled placeholder="报销单号"></el-input>
        </td>
      </tr>
      <tr>
        <td align="right">员工：</td>
        <td>
          <el-input disabled v-model="StaffReimbursement.Applicant" placeholder="员工"></el-input>
        </td>
        <td align="right">账户号：</td>
        <td>
          <el-input v-model="StaffReimbursement.AccountNumber" disabled placeholder="账户号"></el-input>
        </td>
        <td align="right">成本中心：</td>
        <td>
          <el-input v-model="StaffReimbursement.CostCenter" disabled placeholder="成本中心"></el-input>
        </td>
        <td align="right">公司代码：</td>
        <td>
          <el-input v-model="StaffReimbursement.CompanyCode" disabled placeholder="公司代码"></el-input>
        </td>
      </tr>
      <tr>
        <td align="right">附件 ：</td>
        <td colspan="7" style="text-align:left;">
          <a :href="attrFileInfo.url" target="_blank">{{this.attrFileInfo.name}}</a>
        </td>
      </tr>
      <tr>
        <td align="right">备注：</td>
        <td colspan="7">
          <el-input disabled v-model="StaffReimbursement.Remark" placeholder="请输入内容"></el-input>
        </td>
      </tr>
      <tr>
        <td align="right">特殊审批人</td>
        <td colspan="7">
          <el-input disabled v-model="StaffReimbursement.SpecialApprover" placeholder="特殊审批人"></el-input>
        </td>
      </tr>
    </table>
    <el-table
      :summary-method="getSummaries"
      show-summary
      border
      :data="SubItems"
      style="width: 100%"
      max-height="600"
    >
      <el-table-column prop="ExpenseCategory" label="费用类型"></el-table-column>
      <el-table-column prop="CostAccount" label="费用科目"></el-table-column>
      <el-table-column prop="ExpenseDate" label="费用日期"></el-table-column>
      <el-table-column prop="Count" label="数量"></el-table-column>
      <el-table-column prop="Price" label="单位金额"></el-table-column>
      <el-table-column prop="Total" label="总金额"></el-table-column>
      <el-table-column prop="Currency" label="币种"></el-table-column>
      <el-table-column prop="Rate" label="汇率"></el-table-column>
      <el-table-column prop="ConvertMoney" label="转换金额"></el-table-column>
      <el-table-column prop="ConvertCurrency" label="转换后的币种"></el-table-column>
      <el-table-column prop="TaxCode" label="税码"></el-table-column>
      <el-table-column prop="TaxRate" label="税率"></el-table-column>
      <el-table-column prop="OriginalTaxMoney" label="原币税额"></el-table-column>
      <el-table-column prop="StartDate" label="出发日期"></el-table-column>
      <el-table-column prop="ArriveDate" label="抵达日期"></el-table-column>
      <el-table-column prop="Destination" label="目的地"></el-table-column>
      <el-table-column prop="Days" label="天数"></el-table-column>
      <el-table-column prop="CheckInDate" label="入住日期"></el-table-column>
      <el-table-column prop="LeaveDate" label="离店日期"></el-table-column>
      <el-table-column prop="Name" label="酒店名称"></el-table-column>
      <el-table-column prop="Number" label="参考号"></el-table-column>
    </el-table>
    <div style="display:none;" id="printBox">
      <table class="printTable">
        <tr class="printTableTh">
          <td align="center" colspan="6">
            <h2>{{this.CompanyName}}（{{this.StaffReimbursement.CompanyCode}}）</h2>
          </td>
        </tr>
        <!-- <tr>
          <td>费用报告编号：</td>
          <td colspan="5">{{this.StaffReimbursement.Title}}</td>
        </tr> -->
        <tr>
           <td>费用报告编号：</td>
          <td colspan="2">{{this.StaffReimbursement.Title}}</td>
          <td>报销金额：</td>
          <td colspan="2">{{this.TotalMoney}}CNY</td>
        </tr>
        <tr>
          <td colspan="2">员工信息</td>
          <td colspan="3">银行信息</td>
        </tr>
        <tr>
          <td>姓名：</td>
          <td>{{Email.split("@")[0]}}（{{this.StaffReimbursement.Applicant}}）</td>

          <td rowspan="2">户名：</td>
          <td rowspan="2" colspan="2">工资</td>
        </tr>
        <tr>
          <td>员工编号：</td>
          <td>{{EmployeeCode}}</td>
        </tr>
        <tr>
          <td>邮件地址：</td>
          <td>{{Email}}</td>
          <td rowspan="2">账号：</td>
          <td rowspan="2" colspan="2">{{this.StaffReimbursement.AccountNumber}}</td>
        </tr> 
        <tr>
          <td>手机：</td>
          <td></td>
        </tr>
      </table>

      <table class="printTable">
        <tr class="printTableTh">
          <td colspan="6">费用报告信息</td>
        </tr>
        <tr>
          <td>提交报告日期：</td>
          <td>{{this.StaffReimbursement.Created}}</td>
          <td>成本中心：</td>
          <td>{{this.StaffReimbursement.CostCenter}}</td>
        </tr>
        <!-- <tr>
          <td>完成审批日期：</td>
          <td colspan="3">{{this.StaffReimbursement.SettlingTime}}</td>
        </tr> -->
      </table>

      <table class="printTable">
        <tr class="printTableTh">
          <td colspan="11">费用报告明细行</td>
        </tr>
        <tr>
          <td>税码</td>
          <td>日期</td>
          <td>费用名称</td>
          <td>报销金额</td>
          <td>币种</td>
          <td>兑换后金额</td>
          <td>币种</td>
          <td>内部订单</td>
          <td>税码</td>
          <td>参考号</td>
          <td>备忘</td>
        </tr>
        <tr v-for="(subItems,index) in  PrintSubItems">
          <template v-for="(subItem,cindex) in subItems">
            <td>{{subItem}}</td>
          </template>
        </tr>
      </table>

      <table class="printTable">
        <tr class="printTableTh">
          <td colspan="5">审批记录</td>
        </tr>
        <tr class="printTableTh">
          <td>审批人</td>
          <td>审批人级别</td>
          <td>审批状态</td>
          <td>审批日期</td>
        </tr>
        <tr v-for="(subItems,index) in  ApprovalHistory">
          <template v-for="(subItem,cindex) in subItems">
            <td>{{subItem}}</td>
          </template>
        </tr>
      </table>
    </div>
  </div>
</template>
<script>
import $ from "jquery";
import common from "../js/common.js";
export default {
  data() {
    return {
      hostUrl: this.GLOBAL.URL, //已在Web Part中注册了此变量
      mainListName: "StaffReimbursement", //对公付款
      mainListType: "SP.Data.StaffReimbursementListItem", //税票清单列表类型，用于post请求
      userListName: "EmployeeList", //员工详细信息列表名称
      SpecApproId: 0, //特殊审批人ID
      LoginName: "", //登录名
      formLabelWidth: "150px",
      StartArriveDate: "",
      CheckInLeaveData: "",
      expenseCategoryListName: "ExpenseCategory", //费用类别
      costAccountListName: "CostAccount", //费用科目
      currentUserTitle: "", //当前用户名
      currentUserITCode: "", //邮箱@前的code

      //主表数据
      StaffReimbursement: {
        Title: "", //申请单号
        Applicant: "", //申请人
        AccountNumber: "", //账户号
        CostCenter: "", //成本中心
        CompanyCode: "", //公司代码
        OrderNo: "", //订单号
        SpecialApprover: "", //特殊审批人
        SettlingTime: "" //审批完成时间
      },
      FinanceITCode: "",
      //子表数据
      SubItems: [],
      PrintSubItems: [],
      SubItem: {
        ExpenseCategory: "", //费用类别
        CostAccount: "", //费用科目
        Count: "", //数量
        Price: "", //单位金额
        Total: "", //总金额
        Currency: "", //币种
        Rate: "", //汇率
        ConvertMoney: "", //转换金额
        ConvertCurrency: "", //转换后币种
        IsTax: false, //是否用税
        TaxCode: "", //税码
        TaxRate: "", //税率
        OriginalTaxMoney: "", //原币税额
        ExpenseDate: "", //费用日期
        StartDate: "", //出发日期
        ArriveDate: "", //到达日期
        Destination: "", //目的地
        Days: "", //天数
        CheckInDate: "", //入住日期
        LeaveDate: "", //离店日期
        Name: "", //酒店名称
        Number: "" //发票号
      },
      fileList: [], //附件列表数据
      fileToArr: [], //附件转换成文件流，然后保存文件属性至数组里
      attrFileInfo: {
        name: "",
        url: ""
      },
      actionUrl: "https://lenovonetapp.sharepoint.cn/", //绑定上传附件按钮的action
      currentStep: "",
      ApprovalHistory: "", //审批历史
      IsDisable: false,
      CompanyName: "", //公司名称
      TotalMoney: 0, //报销金额
      Email: "", //申请人邮箱
      EmployeeCode: "" //申请人编码
    };
  },
  methods: {
    printDeal() {
      var printBox = document.getElementById("printBox");
      //拿到打印的区域的html内容
      var newContent = printBox.innerHTML;
      //将旧的页面储存起来，当打印完成后返给给页面。
      var oldContent = document.body.innerHTML;
      //赋值给body
      document.body.innerHTML = newContent;
      //执行window.print打印功能
      window.print();
      // 重新加载页面，以刷新数据。以防打印完之后，页面不能操作的问题
      window.location.reload();
      document.body.innerHTML = oldContent;
      return false;
    },
    getCompanyName(code) {
      var that = this;
      //获取合同列表
      var parm = {
        action: "ListItems",
        type: "get",
        list: this.userListName,
        baseUrl: this.hostUrl,
        condition: "?$filter=CompanyCode eq '" + code + "'&$top=1"
      }; //Completed 已完成
      console.log(parm.condition);
      var option = common.queryOpt(parm);
      $.when($.ajax(option))
        .done(req => {
          var data = req.d.results;
          if (data.length > 0) {
            console.log("公司名称:" + data[0].CompanyName);
            console.log(data);
            that.CompanyName = data[0].CompanyName;
          }
        })
        .catch(err => {
          this.$message(common.message("error", "获取公司名称失败!"));
        });
    },
    getSummaries(param) {
      const { columns, data } = param;
      const sums = [];
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = "合计";
          return;
        }
        const values = data.map(item => Number(item[column.property]));
        if (!values.every(value => isNaN(value))) {
          if (index == 8) {
            sums[index] = values.reduce((prev, curr) => {
              const value = Number(curr).toFixed(2);
              if (!isNaN(value)) {
                return prev + curr;
              } else {
                return prev;
              }
            }, 0);
              //sums[index] += " 元";
              sums[index]=Number(sums[index]).toFixed(2)+" 元"
          }
        } else {
          //sums[index] = "N/A";
        }
      });

      return sums;
    },
    loadAttachment: function(attUrl) {
      var parm = {
        type: "get",
        action: "Attachments",
        attUrl: attUrl
      };
      var opt = common.queryOpt(parm);
      return common.service(opt);
    },
    //加载主表数据
    loadMainListData: function(guid) {
      var parm = {
        type: "get",
        action: "ListItems",
        list: this.mainListName,
        baseUrl: this.hostUrl,
        condition: "?$filter=Title eq '" + guid + "'"
      };
      var opt = common.queryOpt(parm);
      return common.service(opt);
    },
    getApplicantInfo(applicant) {
      var that = this;
      //获取合同列表
      var parm = {
        action: "ListItems",
        type: "get",
        list: this.userListName,
        baseUrl: this.hostUrl,
        condition: "?$filter=substringof('"+applicant+"',EmployeeID)&$top=1"
      }; //Completed 已完成
      console.log(parm.condition);
      var option = common.queryOpt(parm);
      $.when($.ajax(option))
        .done(req => {
          var data = req.d.results;
          if (data.length > 0) {
            that.Email = data[0].EmployeeID;
            console.log(data[0]);
            console.log(that.Email);
            that.EmployeeCode = data[0].EmployeeCode;
          }
        })
        .catch(err => {
          this.$message(common.message("error", "获取申请人信息失败!"));
        });
    }
  },
  mounted: function() {
    var applicantNumber = common.GetParameterValues("ApplicantNumber");
    var getMainListData = this.loadMainListData(applicantNumber);
    getMainListData
      .done(req => {
        var data = req.d.results;
        console.log(data);
        if (data.length > 0) {
          //加载主表
          this.IsDisable =
            data[0].StaffReimbursementApproval["Description"] == "Approver5" ||
            (data[0].StaffReimbursementApproval["Description"] == "End" &&
              data[0].Status == "Approved");
          this.ApprovalHistory = data[0].ApproverHistory;
          this.StaffReimbursement.Title = data[0].Title;
          this.StaffReimbursement.Applicant = data[0].Applicant;
          this.StaffReimbursement.AccountNumber = data[0].AccountNumber;
          this.StaffReimbursement.CostCenter = data[0].CostCenter;
          this.StaffReimbursement.CompanyCode = data[0].CompanyCode;
          this.StaffReimbursement.Remark = data[0].Remark;
          this.StaffReimbursement.SpecialApprover = data[0].SpecialApprover;
          this.currentItemId = data[0].Id;
          this.StaffReimbursement.Created = data[0].Created.substring(
            0,
            data[0].Created.indexOf("T")
          );
          this.StaffReimbursement.SettlingTime = data[0].SettlingTime;
          this.getCompanyName(this.StaffReimbursement.CompanyCode);
          this.getApplicantInfo(data[0].ApplicantEmail);
          if (this.ApprovalHistory != null && this.ApprovalHistory != "") {
            var approvalHistory = JSON.parse(this.ApprovalHistory);
            var keys = Object.keys(approvalHistory);
            var result = [];
            keys.forEach(key => {
              result.push({
                Approver: approvalHistory[key].split(",")[0],
                ApproverLevel: key,
                Status: "已批准",
                ApproverDate: approvalHistory[key].split(",")[1]
              });
            });
            this.ApprovalHistory = result;
          }

          if (data[0].Attachments) {
            var attUrl = data[0].AttachmentFiles.__deferred.uri;
            var getAtt = this.loadAttachment(attUrl);
            getAtt
              .done(f => {
                var data = f.d.results;
                if (data.length > 0) {
                  this.attrFileInfo.url =
                    window.location.origin +
                    data[0].ServerRelativeUrl +
                    "?Web=1";
                  this.attrFileInfo.name = data[0].FileName;
                  this.fileList.push({
                    name: data[0].FileName,
                    url: data[0].ServerRelativeUrl
                  });
                  console.log("aaaaaaaaaaaa");
                  console.log(this.fileList);
                }
              })
              .catch(errf => {
                console.log("获取附件失败");
              });
          }
          //加载子表
          console.log("加载子表");
          var subItems =
            data[0].DetailInvoiceJSON == null
              ? null
              : JSON.parse(data[0].DetailInvoiceJSON);
          console.log(subItems);
          if (subItems != null) {
            var totalMoney = 0;
            subItems.forEach(element => {
              totalMoney += Number(element.ConvertMoney);
              this.SubItems.push({
                ExpenseCategory: element.ExpenseCategory, //费用类别
                CostAccount: element.CostAccount, //费用科目
                Count: element.Count, //数量
                Price: element.Price, //单位金额
                Total: element.Total, //总金额
                Currency: element.Currency, //币种
                Rate: element.Rate, //汇率
                ConvertMoney: element.ConvertMoney, //转换金额
                ConvertCurrency: element.ConvertCurrency, //转换后币种
                TaxCode: element.TaxCode, //税码
                TaxRate: element.TaxRate, //税率
                OriginalTaxMoney: element.OriginalTaxMoney, //原币税额
                ExpenseDate: element.ExpenseDate, //费用日期
                StartDate: element.StartDate, //出发日期
                ArriveDate: element.ArriveDate, //到达日期
                Destination: element.Destination, //目的地
                Days: element.Days, //天数
                CheckInDate: element.CheckInDate, //入住日期
                LeaveDate: element.LeaveDate, //离店日期
                Name: element.Name, //酒店名称
                Number: element.Number //发票号
              });

              this.PrintSubItems.push({
                TaxCode: element.TaxCode, //税码
                ExpenseDate: element.ExpenseDate, //费用日期
                ExpenseCategory: element.ExpenseCategory, //费用类别
                Money: element.Total,
                Currency1: element.Currency,
                ConvertMoney: element.ConvertMoney, //转换金额
                Currency2: element.Currency,
                OrderNo: data[0].Title,
                TaxCode1: element.TaxCode, //税码
                Number: element.Number, //参考号
                Remark: element.Remark //备注
              });
            });
            this.TotalMoney = totalMoney.toFixed(2);
          }
        } else {
          this.$message(
            common.message("error", "员工报销列表中不存在该申请单号")
          );
        }
      })
      .catch(err => {
        this.$message(common.message("error", "加载员工报销列表数据失败"));
      });
  }
};
</script>

<style>
.detailyuangong {
  min-height: 25px;
  line-height: 25px;
  text-align: center;
  border-collapse: collapse;
  color: gray;
  padding: 2px;
}
.detailyuangong tr td {
  border: 1px solid #cfcfcf;
  padding: 5px;
}
.printTable {
  width: 100%;
  min-height: 25px;
  line-height: 25px;
  text-align: left;
  border-collapse: collapse;
  color: gray;
  padding: 2px;
  margin-top: 20px;
}
.printTableTh {
  background-color: #cfcfcf;
  color: black;
}
.printTable td {
  border: 1px solid black;
  padding: 5px;
  font-size: 12px;
}
</style>