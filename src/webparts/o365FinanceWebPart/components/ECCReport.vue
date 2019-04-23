<template>
  <div v-loading="loading">
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
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="物控人员：">
        <el-input v-model="Condition.OTCMember" placeholder="物控人员"></el-input>
      </el-form-item>
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
      <el-form-item>
        <el-button type="primary" @click="Condition={}">重置</el-button>
        <el-button type="primary" @click="onSubmit">查询</el-button>
        <el-button type="primary" @click="onExcel">导出Excel</el-button>
      </el-form-item>
    </el-form>

    <el-table :data="TableData" style="width: 100%" max-height="500">
      <el-table-column fixed prop="Title" label="申请单号" width="300"></el-table-column>
      <el-table-column prop="companyCode" label="公司代码"></el-table-column>
      <el-table-column prop="Status" label="状态"></el-table-column>
      <el-table-column prop="Applicant" label="申请人"></el-table-column>
      <el-table-column prop="CostCenter" label="成本中心"></el-table-column>
      <el-table-column prop="ApplicationType" label="申请类别"></el-table-column>
      <el-table-column prop="ProductType" label="产品类别"></el-table-column>
      <el-table-column prop="mailTo" label="收件人"></el-table-column>
      <el-table-column prop="Materiel" label="物料"></el-table-column>
      <el-table-column prop="Amount" label="数量"></el-table-column>
      <el-table-column prop="Price" label="单价"></el-table-column>
      <el-table-column prop="Total" label="总金额"></el-table-column>
      <el-table-column prop="FixedAssetsCode" label="固定资产编码"></el-table-column>
      <el-table-column prop="CostItems" label="费用条目"></el-table-column>
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
      loginName: "",
      userId: 0,
      defaultCondition: "",
      loading: false,
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
      DisplayName: {
        Draft: "草稿",
        Submitted: "审批中",
        Changed: "被驳回并提交",
        Dumped: "终止",
        Approved: "审批完成",
        Rejected: "已拒绝"
      },
      excelColumns: [
        "申请单号",
        "公司代码",
        "状态",
        "申请人",
        "成本中心",
        "申请类别",
        "产品类别",
        "收件人",
        "物料",
        "数量",
        "单价",
        "总金额",
        "固定资产编码",
        "费用条目"
      ],
      //filterVal: [],
      //筛选条件
      Condition: {
        CostCenter: "", //成本中心
        ApplicationDate: "", //申请日期
        ApplicationType: "", //申请类型
        Status: "", //状态
        OTCMember: "", //物控人员
        Title: "", //申请单号
        CompanyCode: ""
      },
      //主表数据
      TableData: []
    };
  },
  methods: {
    onSubmit() {
      this.loading = true;
      this.TableData = [];
      console.log("筛选条件");
      console.log(this.Condition);
      var condition = this.defaultCondition;
      //var conditionCount = 0;

      for (var item in this.Condition) {
        if (this.Condition[item] != null && this.Condition[item] != "") {
          //conditionCount++;
          //if (conditionCount == 1) {
          // if (item == "applicationDate") {
          //   condition +=
          //     "?$filter=Created gt datetime" +
          //     "'" +
          //     this.Condition[item][0] +
          //     "T00:00:00Z" +
          //     "'" +
          //     " and Created lt datetime" +
          //     "'" +
          //     this.Condition[item][1] +
          //     "T00:00:00Z" +
          //     "'";
          // } else {
          //   condition +=
          //     "?$filter=" + item + " eq '" + this.Condition[item] + "'";
          // }
          // } else {
          if (item == "applicationDate") {
            condition +=
              " and Created gt datetime" +
              "'" +
              this.Condition[item][0] +
              "T00:00:00" +
              "'" +
              " and Created lt datetime" +
              "'" +
              this.Condition[item][1] +
              "T00:00:00" +
              "'";
          } else {
            condition += " and " + item + " eq '" + this.Condition[item] + "'";
          }
          // }
        }
      }
      console.log(condition);
      this.getMainList(condition);
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
      $.when($.ajax(option))
        .done(req => {
          var data = req.d.results;
          if (data.length > 0) {
            data.forEach(d => {
              this.getSubList(d);
            });
          } else {
            this.loading = false;
          }
        })
        .catch(err => {
          console.log("未能加载出符合筛选要求的数据")
          //this.$message(common.message("error", "获取主表数据失败"));
          this.loading = false;
        });
    },
    getSubList(MainItem) {
      var applicationNumber = MainItem.Title;
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
              this.TableData.push({
                Title: MainItem.Title,
                companyCode: MainItem.CompanyCode,
                Status: this.DisplayName[MainItem.Status],
                Applicant: MainItem.Applicant,
                CostCenter: MainItem.CostCenter,
                ApplicationType: MainItem.ApplicationType,
                ProductType: MainItem.ProductType,
                mailTo: "",
                Materiel: d.Materiel,
                Amount: d.Amount,
                Price: d.Price,
                Total: Number(d.Total),
                FixedAssetsCode: d.FixedAssetsCode,
                CostItems: d.CostItems
              });
            });
          } else {
            this.TableData.push({
              Title: MainItem.Title,
              companyCode: MainItem.CompanyCode,
              Status: this.DisplayName[MainItem.Status],
              Applicant: MainItem.Applicant,
              CostCenter: MainItem.CostCenter,
              ApplicationType: MainItem.ApplicationType,
              ProductType: MainItem.ProductType,
              mailTo: "",
              Materiel: "",
              Amount: "",
              Price: "",
              Total: "",
              FixedAssetsCode: "",
              CostItems: ""
            });
          }
          this.loading = false;
        })
        .catch(err => {
          this.$message(common.message("error", "获取物料数据失败!"));
          this.loading = false;
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
    },
    onExcel: function() {
      var temp = [];
      var tempColumn = [];
      for (var item in this.TableData[0]) {
        tempColumn.push(item);
      }
      temp = this.TableData;
      var data = temp.map(v => tempColumn.map(k => v[k]));
      var excelInfo = {
        excelColumns: this.excelColumns,
        excelData: data,
        fileName: "固资申请报表",
        fileType: "xls",
        sheetName: "固资申请"
      };
      efn.toExcel(excelInfo);
    },
    viewItem: function(index) {
      var applicantNumber = this.TableData[index].Title;
      this.$router.push({
        path: "/vieweccdetails",
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
          this.loginName = loginName.split("@")[0];
          this.userId = c.d.Id;
          this.defaultCondition =
            "?$filter=(AuthorId eq " +
            this.userId +
            " or substringof('" +
            this.loginName +
            "',ApprovalHistory))";
        })
        .catch(err => {
          this.$message(common.message("error", "加载当前用户出错!"));
        });
    } //获取当前用户并验证员工表是否存在当前用户
  },
  mounted() {
    this.getCompanyCodeAndCostCenter();
    this.getApplicationType();
    this.getCurrentUser();
  }
};
</script>