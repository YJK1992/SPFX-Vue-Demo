<template>
  <div>
    <el-form :inline="true" :model="Condition" class="demo-form-inline">
      <el-form-item label="申请单号：">
        <el-input v-model="Condition.Title" placeholder="申请单号"></el-input>
      </el-form-item>
      <el-form-item label="申请时间段：">
        <el-date-picker
          value-format="yyyy-MM-dd"
          v-model="Condition.Date"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="经办人ID：">
        <el-input v-model="Condition.ApplicantEmail" placeholder="经办人ID"></el-input>
      </el-form-item>
      <el-form-item label="状态：">
        <el-select v-model="Condition.Status" placeholder="请选择">
          <el-option
            v-for="item in Status"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="费用条目：">
        <el-input v-model="CostAccount" placeholder="请选择"></el-input>
      </el-form-item>

      <el-form-item label="公司代码：">
        <el-select v-model="Condition.CompanyCode" placeholder="请选择">
          <el-option
            v-for="item in CompanyCodeArr"
            :key="item.CompanyCode"
            :label="item.CompanyCode"
            :value="item.CompanyCode"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="成本中心">
        <el-select v-model="Condition.CostCenter" placeholder="请选择"></el-select>
      </el-form-item>

      <el-form-item label="员工">
        <el-input v-model="Condition.Applicant" placeholder="员工"></el-input>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="clearCondition">重置</el-button>
        <el-button type="primary" @click="onSubmit">查询</el-button>
        <el-button @click="onExcel()" type="primary">导出Excel</el-button>
      </el-form-item>
    </el-form>

    <el-table border :data="TableData" style="width: 100%" max-height="600">
      <el-table-column width="200" prop="Title" label="报销单号"></el-table-column>
      <el-table-column width="200" prop="ExpenseDate" label="费用日期"></el-table-column>
      <el-table-column width="200" prop="CostAccount" label="费用科目"></el-table-column>
      <el-table-column width="200" prop="CostCenter" label="成本中心"></el-table-column>
      <el-table-column width="200" prop="Count" label="数量"></el-table-column>
      <el-table-column width="200" prop="Price" label="单位金额"></el-table-column>
      <el-table-column width="200" prop="Total" label="总金额"></el-table-column>
      <el-table-column width="200" prop="Currency" label="币种"></el-table-column>
      <el-table-column width="200" prop="Rate" label="汇率"></el-table-column>
      <el-table-column width="200" prop="ConvertMoney" label="转换金额"></el-table-column>
      <!-- <el-table-column width="200" prop label="附件"></el-table-column> -->
      <el-table-column width="200" prop="FinanceITCode" label="最后签批人"></el-table-column>
      <el-table-column width="200" prop="Modified" label="最后签批时间"></el-table-column>
      <el-table-column width="200" prop="Status" label="状态"></el-table-column>
      <el-table-column width="200" prop="CompanyCode" label="公司代码"></el-table-column>
      <el-table-column width="200" prop="Applicant" label="员工名"></el-table-column>
      <el-table-column width="200" prop="ApplicantEmail" label="员工ITCode"></el-table-column>
      <el-table-column width="200" prop="StartDate" label="出发日期"></el-table-column>
      <el-table-column width="200" prop="ArriveDate" label="抵达日期"></el-table-column>
      <el-table-column width="200" prop="Destination" label="目的地"></el-table-column>
      <el-table-column width="200" prop="CheckInDate" label="入住日期"></el-table-column>
      <el-table-column width="200" prop="LeaveDate" label="离店日期"></el-table-column>
      <el-table-column width="200" prop="Days" label="出差天数"></el-table-column>
      <el-table-column fixed="right" label="操作" width="100">
        <template slot-scope="scope">
          <el-button @click="viewItem(scope.$index)" size="small">查看</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import $ from "jquery";
import common from "../js/common.js";
import efn from "../js/json2excel.js";
export default {
  data() {
    return {
      hostUrl: this.GLOBAL.URL, //已在Web Part中注册了此变量
      userListName: "EmployeeList", //员工详细信息列表名称
      mainListName: "StaffReimbursement", //员工报销
      Status: [
        {
          value: "Draft",
          label: "草稿"
        },
        {
          value: "Submitted",
          label: "审批中"
        },
        {
          value: "Changed",
          label: "被驳回并提交"
        },
        {
          value: "Dumped",
          label: "终止"
        },
        {
          value: "Rejected",
          label: "已拒绝"
        },
        {
          value: "Approved",
          label: "审批完成"
        }
      ],
      //筛选条件
      Condition: {
        Title: "",
        Applicant: "",
        Status: "",
        ApplicantEmail: "",
        CompanyCode: "",
        CostCenter: "",
        Date: ""
      },
      DisplayName: {
        Draft: "草稿",
        Submitted: "审批中",
        Changed: "被驳回并提交",
        Dumped: "终止",
        Approved: "审批完成",
        Rejected: "已拒绝"
      },
      CostAccount: "",
      CompanyCodeArr: [], //公司代码
      CostCenterArr: [], //成本中心
      TableData: [], //主表数据
      excelColumns: [
        "报销单号",
        "费用日期",
        "费用科目",
        "成本中心",
        "数量",
        "单位金额",
        "总金额",
        "币种",
        "汇率",
        "转换金额",
        // "附件",
        "最后签批人",
        "最后签批时间",
        "状态",
        "公司代码",
        "员工名",
        "员工ITCode",
        "出发日期",
        "抵达日期",
        "目的地",
        "入住日期",
        "离店日期",
        "出差天数"
      ] //excel字段名
    };
  },
  methods: {
    viewItem: function(index) {
      var applicantNumber = this.TableData[index].Title;
      this.$router.push({
        path: "/detailptp",
        query: {
          ApplicantNumber: applicantNumber
        }
      });
    },
    onExcel: function() {
      var temp = [];
      var tempColumn = [];
      for (var item in this.TableData[0]) {
        console.log(item);
        tempColumn.push(item);
      }
      temp = this.TableData;
      var data = temp.map(v => tempColumn.map(k => v[k]));
      var excelInfo = {
        excelColumns: this.excelColumns,
        excelData: data,
        fileName: "PTP1",
        fileType: "xls",
        sheetName: "PTP1"
      };
      efn.toExcel(excelInfo);
    },
    clearCondition() {
      this.Condition = {};
      this.CostAccount = "";
    },
    onSubmit() {
      this.TableData = [];
      console.log("筛选条件");
      console.log(this.Condition);
      var condition = "";
      var conditionCount = 0;
      for (var item in this.Condition) {
        if (this.Condition[item] != null && this.Condition[item] != "") {
          conditionCount++;
          if (conditionCount == 1) {
            if (item == "Date") {
              condition +=
                "?$filter=Created gt datetime" +
                "'" +
                this.Condition[item][0] +
                "T00:00:00Z" +
                "'" +
                " and Created lt datetime" +
                "'" +
                this.Condition[item][1] +
                "T00:00:00Z" +
                "'";
            } else {
              condition +=
                "?$filter=" + item + " eq '" + this.Condition[item] + "'";
            }
          } else {
            if (item == "Date") {
              condition +=
                " and Created gt datetime" +
                "'" +
                this.Condition[item][0] +
                "T00:00:00Z" +
                "'" +
                " and Created lt datetime" +
                "'" +
                this.Condition[item][1] +
                "T00:00:00Z" +
                "'";
            } else {
              condition +=
                " and " + item + " eq '" + this.Condition[item] + "'";
            }
          }
        }
      }
      console.log(condition);
      this.getMainList(condition);
    },
    getMainList(condition) {
      var parm = {
        type: "get",
        action: "ListItems",
        list: this.mainListName,
        baseUrl: this.hostUrl,
        condition: condition
      };
      var option = common.queryOpt(parm);

      $.when($.ajax(option)).done(req => {
        var data = req.d.results;
        if (data.length > 0) {
          data.forEach(d => {
            //修改读取子表逻辑
            var subItems =
              d.DetailInvoiceJSON == null
                ? null
                : JSON.parse(d.DetailInvoiceJSON);
            console.log(subItems);
            console.log("this.CostAccount:" + this.CostAccount == "");
            if (subItems != null) {
              console.log("subItems" + subItems != null);
              subItems.forEach(sub => {
                if (this.CostAccount == "") {
                  this.TableData.push({
                    Title: d.Title,
                    ExpenseDate: sub.ExpenseDate,
                    CostAccount: sub.CostAccount,
                    CostCenter: d.CostCenter,
                    Count: sub.Count,
                    Price: sub.Price,
                    Total: sub.Total,
                    Currency: sub.Currency,
                    Rate: sub.Rate,
                    ConvertMoney: sub.ConvertMoney,
                    // File: "",
                    FinanceITCode: d.FinanceITCode,
                    Modified: d.Modified.substring(0, d.Modified.indexOf("T")),
                    Status: this.DisplayName[d.Status],
                    CompanyCode: d.CompanyCode,
                    Applicant: d.Applicant,
                    ApplicantEmail: d.ApplicantEmail,
                    StartDate: sub.StartDate,
                    ArriveDate: sub.ArriveDate,
                    Destination: sub.Destination,
                    CheckInDate: sub.CheckInDate,
                    LeaveDate: sub.LeaveDate,
                    Days: d.Days
                  });
                } else {
                  if (sub.CostAccount == this.CostAccount) {
                    this.TableData.push({
                      Title: d.Title,
                      ExpenseDate: sub.ExpenseDate,
                      CostAccount: sub.CostAccount,
                      CostCenter: d.CostCenter,
                      Count: sub.Count,
                      Price: sub.Price,
                      Total: sub.Total,
                      Currency: sub.Currency,
                      Rate: sub.Rate,
                      ConvertMoney: sub.ConvertMoney,
                      File: "",
                      FinanceITCode: d.FinanceITCode,
                      Modified: d.Modified.substring(
                        0,
                        d.Modified.indexOf("T")
                      ),
                      Status: this.DisplayName[d.Status],
                      CompanyCode: d.CompanyCode,
                      Applicant: d.Applicant,
                      ApplicantEmail: d.ApplicantEmail,
                      StartDate: sub.StartDate,
                      ArriveDate: sub.ArriveDate,
                      Destination: sub.Destination,
                      Days: d.Days,
                      CheckInDate: sub.CheckInDate,
                      LeaveDate: sub.LeaveDate
                    });
                  }
                }
              });
            } else {
              this.TableData.push({
                Title: d.Title,
                ExpenseDate: "",
                CostAccount: "",
                CostCenter: d.CostCenter,
                Count: "",
                Price: "",
                Total: "",
                Currency: "",
                Rate: "",
                ConvertMoney: "",
                File: "",
                FinanceITCode: d.FinanceITCode,
                Modified: d.Modified.substring(0, d.Modified.indexOf("T")),
                Status: this.DisplayName[d.Status],
                CompanyCode: d.CompanyCode,
                Applicant: d.Applicant,
                ApplicantEmail: d.ApplicantEmail,
                StartDate: "",
                ArriveDate: "",
                Destination: "",
                Days: d.Days,
                CheckInDate: "",
                LeaveDate: ""
              });
            }
          });
        }
      });
    },
    getCompanyCodeAndCostCenter() {
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
          var costCenter = []; //未去重成本追踪新
          //填充原始数据
          data.forEach(d => {
            companycode.push(d.CompanyCode);
            costCenter.push(d.CostCenter);
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

          //去重操作
          var costCenterUnique = costCenter.filter(function(
            element,
            index,
            array
          ) {
            return array.indexOf(element) === index;
          });

          costCenterUnique.forEach(element => {
            this.CostCenterArr.push({
              CostCenter: element
            });
          });
        }
      });
    }
  },
  mounted() {
    this.getCompanyCodeAndCostCenter();
  }
};
</script>

