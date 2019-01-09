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
      <el-form-item label="币种：">
        <el-select allow-create="true" v-model="Condition.Currency" placeholder="请选择">
          <el-option
            v-for="item in CurrencyArr"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="结算人ID">
        <el-input v-model="Condition.SettlementPeopleITCode" placeholder="结算人ID"></el-input>
      </el-form-item>
      <el-form-item label="结算日期段：">
        <el-date-picker
          value-format="yyyy-MM-dd"
          v-model="Condition.SettlementDate"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="收款单位：">
        <el-input v-model="Condition.CollectionUnit" placeholder="收款单位"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="Condition={}">重置</el-button>
        <el-button type="primary" @click="onSubmit">查询</el-button>
        <el-button @click="onExcel()" type="primary">导出Excel</el-button>
      </el-form-item>
    </el-form>

    <el-table :data="TableData" style="width: 100%" max-height="500">
      <el-table-column fixed prop="CollectionUnit" label="收款单位" width="300"></el-table-column>
      <el-table-column prop="OpeningBank" label="银行名称"></el-table-column>
      <el-table-column prop="Account" label="银行帐号"></el-table-column>
      <el-table-column prop="City" label="省/直辖市"></el-table-column>
      <el-table-column prop="County" label="市"></el-table-column>
      <el-table-column prop="Xian" label="县"></el-table-column>
      <el-table-column prop="Money" label="金额"></el-table-column>
      <el-table-column prop="DetailsOfPayment" label="附言"></el-table-column>
      <el-table-column prop="isWrittenOff" label="是否冲销"></el-table-column>
      <el-table-column fixed="right" prop="poNumber" label="PO号"></el-table-column>
      <!-- <el-table-column fixed="right" label="操作" width="100">
        <template slot-scope="scope">
          <el-button @click="viewItem(scope.$index)" size="small">查看</el-button>
        </template>
      </el-table-column>-->
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
      //列表名称
      mainListName: "PublicPayment", //对公付款列表名
      userListName: "EmployeeList", //员工详细信息列表名称
      CurrencyArr: [
        {
          value: "RMB",
          label: "RMB"
        },
        {
          value: "USD",
          label: "USD"
        },
        {
          value: "HKD",
          label: "HKD"
        },
        {
          value: "EUR",
          label: "EUR"
        },
        {
          value: "JPY",
          label: "JPY"
        },
        {
          value: "GBP",
          label: "GBP"
        },
        {
          value: "UAH",
          label: "UAH"
        },
        {
          value: "Other",
          label: "Other"
        }
      ], //币种
      CompanyCodeArr: [], //公司代码
      Condition: {
        CollectionUnit: "", //结算单位
        SettlingTime: "", //结算日期
        Currency: "", //币种
        CompanyCode: "", //公司代码
        SettlementPeopleITCode: "" //结算人ID
      }, //筛选条件
      TableData: [], //主表数据
      filterVal: [],
      excelColumns: [
        "收款单位",
        "银行名称",
        "银行帐号",
        "省/直辖市",
        "市",
        "县",
        "金额",
        "附言",
        "是否冲销",
        "PO号"
      ]
    };
  },
  methods: {
    onSubmit() {
      this.TableData = [];
      console.log("筛选条件");
      console.log(this.Condition);
      var condition = "?$filter=SettlementType eq '汇款'";
      for (var item in this.Condition) {
        if (this.Condition[item] != null && this.Condition[item] != "") {
          //存在条件
          if (item == "ApplicantDate") {
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
            condition += " and " + item + " eq '" + this.Condition[item] + "'";
          }
        }
      }
      console.log(condition);
      this.getMainList(condition);
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
    getMainList: function(condition) {
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
            this.TableData.push({
              CollectionUnit: d.CollectionUnit,
              OpeningBank: d.OpeningBank,
              Account: d.Account,
              City: d.City,
              County: d.County,
              Xian: "",
              Money: d.InvoiceValue,
              DetailsOfPayment: d.DetailsOfPayment,
              isWrittenOff: "",
              poNumber: ""
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
        fileName: "对公付款汇款报表",
        fileType: "xls",
        sheetName: "对公付款汇款报表"
      };
      efn.toExcel(excelInfo);
    }
  },
  mounted() {
    this.getCompanyCodeAndCostCenter();
  }
};
</script>

<style>
.GPPayRemittanceReport tr td {
  border: 1px solid #cfcfcf;
  padding: 5px;
  width: 140px;
}

.GPPayRemittanceReport {
  min-height: 25px;
  line-height: 25px;
  text-align: center;
  border-collapse: collapse;
  color: gray;
  padding: 2px;
}

#report_GPPayRemittanceReport {
  background-color: #409eff;
  font-weight: bold;
  color: white;
  border: 0px;
}
</style>