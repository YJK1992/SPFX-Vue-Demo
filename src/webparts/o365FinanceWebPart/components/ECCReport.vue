<template>
  <div>
    <el-form :inline="true" :model="Condition" class="demo-form-inline">
      <el-form-item label="成本中心：">
        <el-select v-model="Condition.CostCenter" placeholder="请选择">
          <el-option
            v-for="item in CostCenterArr"
            :key="item.CostCenter"
            :label="item.CostCenter"
            :value="item.CostCenter"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="日期时间段：">
        <el-date-picker
          value-format="yyyy-MM-dd"
          v-model="Condition.applicationDate"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="申请类别：">
        <el-select allow-create="true" v-model="Condition.ApplicationType" placeholder="请选择">
          <el-option
            v-for="item in ApplicationTypeArr"
            :key="item.Title"
            :label="item.Title"
            :value="item.Title"
          ></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="状态：">
        <el-select v-model="Condition.Status" placeholder="请选择">
          <el-option
            v-for="item in Status"
            :key="item.value"
            :label="item.value"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>

      <!-- <el-form-item label="物控人员：">
        <el-input v-model="Condition.MaterialControl" placeholder="审批人" v-show="false"></el-input>
      </el-form-item> -->

      <el-form-item label="申请单号：">
        <el-input v-model="Condition.Title" placeholder="申请单号"></el-input>
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

      <el-form-item>
        <el-button type="primary" @click="onSubmit">查询</el-button>
      </el-form-item>
    </el-form>

    <table class="ECCReport">
      <tr id="report_ECCReport">
        <td>公司代码</td>
        <td style="width: 300px;">申请单号</td>
        <td>申请人</td>
        <td>成本中心</td>
        <td>申请类别</td>
        <td>产品类别</td>
        <td>收件人</td>
        <td>操作</td>
      </tr>
      <tr v-for="(subItems,index) in TableData">
        <template v-for="(subItem,cindex) in subItems">
          <td>{{subItem}}</td>
        </template>
        <td>
          <el-button @click="getSubList(index)" size="small">查看</el-button>
        </td>
      </tr>
    </table>
    <el-dialog title="物料信息" :visible.sync="dialogTableVisible">
      <el-table :data="SubTableData">
        <el-table-column property="Materiel" label="物料" width="150"></el-table-column>
        <el-table-column property="Amount" label="数量" width="150"></el-table-column>
        <el-table-column property="Price" label="单价" width="150"></el-table-column>
        <el-table-column property="Total" label="总金额" width="150"></el-table-column>
        <el-table-column property="FixedAssetsCode" label="固定资产编码" width="150"></el-table-column>
        <el-table-column property="RequestType" label="费用类别" width="150"></el-table-column>
      </el-table>
    </el-dialog>
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
      mainListName: "ECC", //ECC列表名
      subListName: "ECCSubInfo", //ECC物料信息列表名称
      userListName: "EmployeeList", //员工详细信息列表名称
      appliantTypeListName: "ApplicantType", //申请类型列表名称
      //初始化筛选数据
      CostCenterArr: [], //成本中心
      ApplicationTypeArr: [], //申请类别
      CompanyCodeArr: [], //公司代码
      Status: [
        {
          value: "Draft"
        },
        {
          value: "Submitted"
        },
        {
          value: "Changed"
        },
        {
          value: "Dumped"
        },
        {
          value: "Approved"
        }
      ],
      //筛选条件
      Condition: {
        CostCenter: "", //成本中心
        ApplicationDate: "", //申请日期
        ApplicationType: "", //申请类型
        Status: "", //状态
        MaterialControl: "", //物控人员
        Title: "", //申请单号
        CompanyCode: ""
      },
      //主表数据
      TableData: [],
      //子表数据
      SubTableData: [],
      //其他
      dialogTableVisible: false
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
            if (item == "applicationDate") {
              condition +=
                "?$filter=Created gt datetime" +
                "'" +
                this.Condition[item][0]+"T00:00:00Z" +
                "'" +
                " and Created lt datetime" +
                "'" +
                this.Condition[item][1]+"T00:00:00Z" +
                "'";
            } else {
              condition +=
                "?$filter=" + item + " eq '" + this.Condition[item] + "'";
            }
          } else {
            if (item == "applicationDate") {
              condition +=
                " and Created gt datetime" +
                "'" +
                this.Condition[item][0] +"T00:00:00Z"+
                "'" +
                " and Created lt datetime" +
                "'" +
                this.Condition[item][1] +"T00:00:00Z"+
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
              companyCode: d.CompanyCode,
              Title: d.Title,
              Applicant: d.Applicant,
              CostCenter: d.CostCenter,
              Applicant: d.Applicant,
              ApplicationType: d.ApplicationType,
              ProductType: d.ProductType,
              MailTo: ""
            });
          });
        }
      });
    },
    getSubList(index) {
      this.dialogTableVisible = true;
      this.SubTableData = [];
      var applicationNumber = this.TableData[index].Title;
      var parm = {
        type: "get",
        action: "ListItems",
        list: this.subListName,
        baseUrl: this.hostUrl,
        condition: "?$filter=Title eq '" + applicationNumber + "'"
      };
      var opt = common.queryOpt(parm);
      $.when($.ajax(opt))
        .done(req => {
          var data = req.d.results;
          if (data.length > 0) {
            data.forEach(d => {
              this.SubTableData.push({
                Materiel: d.Materiel,
                Amount: d.Amount,
                Price: d.Price,
                Total: d.Total,
                FixedAssetsCode: d.FixedAssetsCode,
                RequestType: d.FixedAssetsCode
              });
            });
          } else {
            this.$message(common.message("waring", "没有无聊数据!"));
          }
        })
        .catch(err => {
          this.$message(common.message("error", "获取物料数据失败!"));
        });
    },
    getApplicationType() {
      //获取申请类别
      var parm = {
        action: "ListItems",
        type: "get",
        list: this.appliantTypeListName,
        baseUrl: this.hostUrl,
        condition: ""
      };

      var option = common.queryOpt(parm);
      $.when($.ajax(option)).done(req => {
        var data = req.d.results;
        if (data.length > 0) {
          data.forEach(d => {
            this.ApplicationTypeArr.push({
              Title: d.Title
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
          var costcenter = []; //未去重成本中心
          var companycode = []; //未去重公司代码
          //填充原始数据
          data.forEach(d => {
            costcenter.push(d.CostCenter);
            companycode.push(d.CompanyCode);
          });
          //去重操作
          var costCenterUnique = costcenter.filter(function(
            element,
            index,
            array
          ) {
            return array.indexOf(element) === index;
          });

          var comopanyCodeUnique = companycode.filter(function(
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
    this.getApplicationType();
  }
};
</script>

<style>
.ECCReport tr td {
  border: 1px solid #cfcfcf;
  padding: 5px;
  width: 140px;
}

.ECCReport {
  min-height: 25px;
  line-height: 25px;
  text-align: center;
  border-collapse: collapse;
  color: gray;
  padding: 2px;
}

.ECCReport tr:nth-child(1) {
  background-color: #409eff;
  font-weight: bold;
  color: white;
  border: 0px;
}
</style>