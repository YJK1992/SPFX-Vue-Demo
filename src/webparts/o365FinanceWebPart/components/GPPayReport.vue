<template>
  <div>
    <el-form :inline="true" :model="Condition" class="demo-form-inline">
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
      <el-form-item label="单据编号：">
        <el-input v-model="Condition.ApplicationNumber" placeholder="单据编号"></el-input>
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
      <el-form-item label="经办人ID：">
        <el-input v-model="Condition.TrusteesEmail" placeholder="经办人ID"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="Condition={}">重置</el-button>
        <el-button type="primary" @click="onSubmit">查询</el-button>
        <el-button @click="onExcel()" type="primary">导出Excel</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="TableData" style="width: 100%" max-height="600">
      <el-table-column fixed prop="ApplicationNumber" label="单据编号" width="300"></el-table-column>
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
    <!-- <table class="gpPayReport">
      <tr id="gpPayReportTable">
        <td>单据号</td>
        <td>结算方式</td>
        <td>经办人</td>
        <td>人员编号</td>
        <td>最高审批人编号</td>
        <td>金额</td>
        <td>成本中心编号</td>
        <td>所属事业部</td>
        <td>费用编号</td>
        <td>费用名称</td>
        <td>资产号</td>
        <td>税码</td>
        <td>发票号码</td>
        <td>借款单号</td>
        <td>借款金额</td>
        <td>借款人编号</td>
        <td>差额</td>
        <td>特别总账标志</td>
        <td>分配</td>
        <td>定/限额</td>
        <td>备注</td>
        <td>PO号</td>
        <td style="width: 100px;">操作</td>
      </tr>
      <tr v-for="(subItems,index) in TableData">
        <template v-for="(subItem,cindex) in subItems">
          <td>{{subItem}}</td>
        </template>
        <td>
          <el-button @click="viewItem(index)" size="small">查看</el-button>
        </td>
      </tr>
    </table>-->
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
      //列表名称
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
      filterVal: [],
      excelColumns: [
        "单据编号",
        "报销类型",
        "结算方式",
        "经办人",
        "金额",
        "费用类别",
        "状态",
        "申请日期",
        "签批/结算人"
      ], //excel字段名
      //筛选条件
      Condition: {
        ReimbursementType: "",
        SettlementType: "",
        Status: "",
        Date: "",
        ApplicationNumber: "",
        CompanyCode: "",
        TrusteesEmail: "" //经办人ID
      },
      CompanyCodeArr: [],
      //主表数据
      TableData: []
      //子表数据
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
      for (var item in this.TableData[0]) {
        this.filterVal.push(item);
      }
      var data = this.TableData.map(v => this.filterVal.map(k => v[k]));
      var excelInfo = {
        excelColumns: this.excelColumns,
        excelData: data,
        fileName: "对公付款总报表",
        fileType: "xlsx",
        sheetName: "对公付款总报表"
      };
      efn.toExcel(excelInfo);
    },
    loadMainList: function(condition) {
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
              ApplicationNumber: d.ApplicationNumber,
              ReimbursementType: d.ReimbursementType,
              SettlementType: d.SettlementType,
              Trustees: d.Trustees + "-" + d.TrusteesEmail,
              Money: d.Money,
              ExpenseCategory: d.ExpenseCategory,
              Status: d.Status,
              Created: d.Created,
              SettlementPerson: ""
            });
          });
        }
      });
    },
    viewItem: function(index) {
      var applicantNumber = this.TableData[index].ApplicationNumber;
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

<style>
.gpPayReport tr td {
  border: 1px solid #cfcfcf;
  padding: 5px;
  width: 140px;
}
#gpPayReportTable td {
  background-color: #409eff;
  font-weight: bold;
  color: white;
  border: 0px;
}
.gpPayReport {
  min-height: 25px;
  line-height: 25px;
  text-align: center;
  border-collapse: collapse;
  color: gray;
  padding: 2px;
}
</style>