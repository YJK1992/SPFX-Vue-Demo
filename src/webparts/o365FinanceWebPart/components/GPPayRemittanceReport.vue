<template>
  <div>
    <el-form :inline="true" :model="Condition" class="demo-form-inline">
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
      <!-- <el-form-item label="结算人：">
        <el-input v-model="Condition.SettlementPerson" placeholder="结算人" v-show="false"></el-input>
      </el-form-item>-->
      <!-- <el-form-item label="公司代码：">
        <el-select v-model="Condition.CompanyCode" placeholder="请选择">
          <el-option
            v-for="item in CompanyCodeArr"
            :key="item.CompanyCode"
            :label="item.CompanyCode"
            :value="item.CompanyCode"
          ></el-option>
        </el-select>
      </el-form-item> -->
      <el-form-item>
        <el-button type="primary" @click="onSubmit">查询</el-button>
      </el-form-item>
    </el-form>

    <table class="GPPayRemittanceReport">
      <tr id="report_GPPayRemittanceReport">
        <td>收款单位</td>
        <td style="width: 300px;">银行名称</td>
        <td style="width: 300px;">银行帐号</td>
        <td>省/直辖市</td>
        <td>市/县</td>
        <td>金额</td>
        <td>附言</td>
        <td>是否冲销</td>
        <td>PO号</td>
      </tr>
      <tr v-for="(subItems,index) in TableData">
        <template v-for="(subItem,cindex) in subItems">
          <td>{{subItem}}</td>
        </template>
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
      hostUrl: this.GLOBAL.URL, //已在Web Part中注册了此变量
      //列表名称
      mainListName: "PublicPayment", //对公付款列表名
      userListName: "EmployeeList", //员工详细信息列表名称
      CurrencyArr: [
        {
          value: "人民币",
          label: "人民币"
        },
        {
          value: "美元",
          label: "美元"
        },
        {
          value: "港币",
          label: "港币"
        },
        {
          value: "欧元",
          label: "欧元"
        },
        {
          value: "日元",
          label: "日元"
        },
        {
          value: "英镑",
          label: "英镑"
        },
        {
          value: "格里夫那",
          label: "格里夫那"
        },
        {
          value: "其他",
          label: "其他"
        }
      ], //币种
      CompanyCodeArr: [], //公司代码
      Condition: {
        CollectionUnit: "", //结算单位
        SettlementDate: "", //结算日期
        Currency: "", //币种
        CompanyCode: "" //公司代码
      },//筛选条件
      TableData: [],//主表数据
    };
  },
  methods: {
    onSubmit() {
      this.TableData = [];
      console.log("筛选条件");
      console.log(this.Condition);
      var condition = "?$filter=SettlementType eq '汇款'";
      var conditionCount = 0;

      for (var item in this.Condition) {
        if (this.Condition[item] != null && this.Condition[item] != "") {
          conditionCount++;
          if (conditionCount == 1) {
            if (item == "SettlementDate") {
              condition +=
                "?$filter=Modified gt datetime" +
                "'" +
                this.Condition[item][0] +
                "T00:00:00Z" +
                "'" +
                " and Modified lt datetime" +
                "'" +
                this.Condition[item][1] +
                "T00:00:00Z" +
                "'";
            } else {
              condition +=
                "?$filter=" + item + " eq '" + this.Condition[item] + "'";
            }
          } else {
            if (item == "SettlementDate") {
              condition +=
                " and Modified gt datetime" +
                "'" +
                this.Condition[item][0] +
                "T00:00:00Z" +
                "'" +
                " and Modified lt datetime" +
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
              collectionUnit: d.CollectionUnit,
              openingBank: d.OpeningBank,
              account: d.Account,
              city: d.City,
              county: d.County,
              money: d.Money,
              detailsOfPayment: d.DetailsOfPayment,
              isWrittenOff: "",
              poNumber:""
            });
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