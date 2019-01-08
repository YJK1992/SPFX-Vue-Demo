<template>
  <div>
    <el-form :inline="true" :model="Condition" class="demo-form-inline">
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
      <el-form-item label="结算方式：">
        <el-select v-model="Condition.SettlementType" placeholder="请选择">
          <el-option
            v-for="item in SettlementType"
            :key="item.value"
            :label="item.value"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="申请单号：">
        <el-input v-model="Condition.ApplicationNumber" placeholder="申请单号"></el-input>
      </el-form-item>
      <el-form-item label="经办人ID：">
        <el-input v-model="Condition.TrusteesEmail" placeholder="经办人ID"></el-input>
      </el-form-item>
      <el-form-item label="总金额">
        <el-input v-model="Condition.InvoiceValue" placeholder="总金额"></el-input>
      </el-form-item>
      <el-form-item label="报销类型：">
        <el-select v-model="Condition.ReimbursementType" placeholder="请选择">
          <el-option
            v-for="item in ReimbursementType"
            :key="item.value"
            :label="item.value"
            :value="item.value"
          ></el-option>
        </el-select>
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

      <el-form-item label>
        <el-checkbox v-model="IsPrint">可打印</el-checkbox>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="Condition={}">重置</el-button>
        <el-button type="primary" @click="onSubmit">查询</el-button>
        <el-button @click="onExcel()" type="primary">导出Excel</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="PrintData" style="width: 100%" max-height="600">
      <el-table-column fixed prop="ApplicationNumber" label="申请单号" width="300"></el-table-column>
      <el-table-column prop="ReimbursementType" label="报销类型"></el-table-column>
      <el-table-column prop="SettlementType" label="结算方式"></el-table-column>
      <el-table-column prop="Trustees" label="经办人"></el-table-column>
      <el-table-column prop="Money" label="金额"></el-table-column>
      <el-table-column prop="ExpenseCategory" label="费用类别"></el-table-column>
      <el-table-column prop="Status" label="状态"></el-table-column>
      <el-table-column prop="Created" label="申请日期"></el-table-column>
      <el-table-column prop="SettlementPerson" label="签批/结算人"></el-table-column>
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
      mainListName: "PublicPayment", //ECC列表名
      userListName: "EmployeeList",
      ReimbursementType: [
        //报销类型
        {
          value: "费用借款",
          label: "费用借款"
        },
        {
          value: "对公付款",
          label: "对公付款"
        },
        {
          value: "资产对公付款",
          label: "资产对公付款"
        },
        {
          value: "其他",
          label: "其他"
        }
      ],
      DisplayName: {
        Draft: "草稿",
        Submitted: "审批中",
        Changed: "被驳回并提交",
        Dumped: "终止",
        Approved: "审批完成",
        Rejected: "已拒绝"
      },
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
      SettlementType: [
        //结算方式
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
      excelColumns: [
        "申请单号",
        "报销类型",
        "结算方式",
        "经办人",
        "金额",
        "费用类别",
        "状态",
        "申请日期",
        "签批/结算人"
      ], //excel字段名
      Condition: {
        ReimbursementType: "",
        SettlementType: "",
        Status: "",
        Date: "",
        ApplicationNumber: "",
        CompanyCode: "",
        TrusteesEmail: "", //经办人ID
        InvoiceValue: ""
      }, //筛选条件
      IsPrint: false, //是否可以打印
      CompanyCodeArr: [],
      TableData: [], //主表数据
      PrintData: [] //可以打印
    };
  },
  methods: {
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
            } else if (item == "TrusteesEmail") {
              condition +=
                "?$filter=TrusteesEmail eq '" + this.Condition[item] + "'";
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
      this.loadMainList(condition);
    },
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
    onExcel: function() {
      var temp = [];
      var tempColumn = [];
      for (var item in this.PrintData[0]) {
        if (item != "IsPrint") {
          console.log(item);
          tempColumn.push(item);
        }
      }
      temp = this.PrintData;
      var data = temp.map(v => tempColumn.map(k => v[k]));
      var excelInfo = {
        excelColumns: this.excelColumns,
        excelData: data,
        fileName: "对公付款总报表",
        fileType: "xls",
        sheetName: "对公付款总报表"
      };
      efn.toExcel(excelInfo);
    },
    loadMainList: function(condition) {
      this.PrintData = [];
      var that = this;
      var parm = {
        type: "get",
        action: "ListItems",
        list: this.mainListName,
        baseUrl: this.hostUrl,
        condition: condition
      };
      var option = common.queryOpt(parm);
      console.log("1111111111");
      console.log(option);
      $.when($.ajax(option)).done(req => {
        var data = req.d.results;
        if (data.length > 0) {
          data.forEach(d => {
            this.TableData.push({
              IsPrint:
                d.PaymentApproval["Description"] == "Approver5" ||
                d.PaymentApproval["Description"] == "Approver6" ||
                (d.PaymentApproval["Description"] == "End" &&
                  d.Status == "Approved"),
              ApplicationNumber: d.ApplicationNumber,
              ReimbursementType: d.ReimbursementType,
              SettlementType: d.SettlementType,
              Trustees: d.Trustees + "-" + d.TrusteesEmail,
              Money: d.InvoiceValue,
              ExpenseCategory: d.ExpenseCategory,
              Status: this.DisplayName[d.Status],
              Created: d.Created.substring(0, d.Created.indexOf("T")),
              SettlementPerson:
                d.AuthorizedPersonITCode == null
                  ? d.SettlementPeopleITCode
                  : d.AuthorizedPersonITCode
            });
          });

          if (that.IsPrint === true) {
            console.log("勾选了打印");
            console.log(that.x);
            that.TableData.forEach(item => {
              console.log(item);
              console.log(item.IsPrint == true);
              console.log(item.IsPrint.toString() == "true");
              //已可以打印的数据
              if (item.IsPrint === true) {
                console.log("pushPrintDataTrue");
                console.log(item);
                that.PrintData.push(item);
              }
            });
          } else {
            console.log("没有勾选打印");
            console.log(that.TableData);
            that.TableData.forEach(item => {
              that.PrintData.push(item);
            });
          }
          // } else {
          //   console.log("没有勾选打印");
          //   console.log(that.TableData);
          //   that.TableData.forEach(item => {
          //     console.log(item);
          //     console.log(item.IsPrint == true);
          //     console.log(item.IsPrint.toString() == "true");
          //     //已可以打印的数据
          //     if (item.IsPrint === false) {
          //       console.log("pushPrintDataFalse");
          //       console.log(item);
          //       that.PrintData.push(item);
          //     }
          //   });
          // }
        }
      });
      console.log(that.PrintData);
    },
    viewItem: function(index) {
      var applicantNumber = this.PrintData[index].ApplicationNumber;
      this.$router.push({
        path: "/detailgppay",
        query: {
          ApplicantNumber: applicantNumber
        }
      });
    }
  },
  mounted() {
    this.getCompanyCode();
  }
};
</script>