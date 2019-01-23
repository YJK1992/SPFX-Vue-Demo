<template>
  <div>
    <table class="caigouDetail" style="table-layout：fixed">
      <tr>
        <td colspan="8">
          <span style="font-size:30px;color:#409eff;">采购申请</span>
        </td>
      </tr>
      <tr>
        <td align="right">申请单号：</td>
        <td colspan="7">
          <el-input disabled v-model="purchaseRequestData.ApplicationNumber" placeholder="申请单号"></el-input>
        </td>
      </tr>
      <tr>
        <td align="right">标题：</td>
        <td colspan="7">
          <el-input disabled v-model="purchaseRequestData.Title" placeholder="标题"></el-input>
        </td>
      </tr>
      <tr>
        <td align="right">委托/经办人：</td>
        <td colspan="2">
          <el-input disabled v-model="purchaseRequestData.Consignor " placeholder="委托/经办人"></el-input>
        </td>
        <td align="right">成本中心：</td>
        <td>
          <el-input disabled v-model="purchaseRequestData.CostCenter " placeholder="成本中心"></el-input>
        </td>
        <td align="right">公司代码：</td>
        <td colspan="2">
          <el-input disabled v-model="purchaseRequestData.CompanyCode " placeholder="公司代码"></el-input>
        </td>
      </tr>

      <tr>
        <td align="right">交货地址：</td>
        <td colspan="7">
          <el-input v-model="purchaseRequestData.DeliveryAddress" placeholder="交货地址"></el-input>
        </td>
      </tr>
      <tr id="caigouDetail_Purchase">
        <td width="170px">供应商</td>
        <td>供应商部件</td>
        <td width="100px">数量</td>
        <td>单价</td>
        <td width="140px">净额</td>
        <td width="140px">税款</td>
        <td width="140px">金额</td>
        <td width="200px">操作</td>
      </tr>
      <tr v-for="(items,index) in subListData">
        <template v-for="(item,cindex) in items">
          <td
            v-if="cindex=='Supplier'"
            width="170px"
            style="word-wrap:break-word;word-break:break-all"
          >{{item}}</td>
          <td v-else>{{item}}</td>
        </template>
      </tr>
      <tr>
        <td align="right">是否有合同：</td>
        <td colspan="7" align="left">
          <el-checkbox disabled v-model="purchaseRequestData.IsContract"></el-checkbox>
        </td>
      </tr>
      <tr>
        <td align="right">合同号：</td>
        <td align="left">
          <el-input disabled v-model="purchaseRequestData.ContractNumber " placeholder="委托/经办人"></el-input>
        </td>
        <td align="right">金额：</td>
        <td colspan="5">
          <el-input disabled v-model="purchaseRequestData.Money" placeholder="金额"></el-input>
        </td>
      </tr>
      <tr id="caigouDetail_Purchase">
        <td style="width:200px">合同名称</td>
        <td style="width:270px">供应商</td>
        <td style="width:200px">内容</td>
        <td>法人代表</td>
        <td colspan="2" style="width:170px">总金额</td>
        <td colspan="2" style="width:170px">已付款</td>
      </tr>
      <tr v-for="(subItems,index) in  ContractHistory">
        <template v-for="(subItem,cindex) in subItems">
          <td colspan="2" v-if="cindex=='Money'">{{subItem}}</td>
          <td colspan="2" v-else-if="cindex=='AccountPaid'">{{subItem}}</td>
          <td v-else>{{subItem}}</td>
        </template>
      </tr>
      <tr>
        <td align="right">已付款：</td>
        <td align="left" colspan="3">{{AccountPaid}}</td>
        <td align="right">未付款：</td>
        <td align="left" colspan="3">{{UnPaid}}</td>
      </tr>
      <tr>
        <td align="right">申请类型：</td>
        <td align="left">
          <el-input disabled v-model="purchaseRequestData.ApplicationType " placeholder="申请类型"></el-input>
        </td>
        <td align="right">费用类别：</td>
        <td>
          <el-input disabled v-model="purchaseRequestData.ExpenseCategory " placeholder="费用类别"></el-input>
        </td>
        <td align="right">费用科目：</td>
        <td colspan="3" align="left">
          <el-input disabled v-model="purchaseRequestData.CostAccount " placeholder="费用科目"></el-input>
        </td>
      </tr>
      <tr>
        <td align="right">固定资产编码：</td>
        <td colspan="7">
          <el-input disabled v-model="purchaseRequestData.CodeOfFixedAssets" placeholder="固定资产编码"></el-input>
        </td>
      </tr>
      <tr>
        <td align="right">特殊审批人：</td>
        <td colspan="7">
          <el-input v-model="purchaseRequestData.SpecialApprover" placeholder="特殊审批人" disabled></el-input>
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
      hostUrl: this.GLOBAL.URL, //已在Web Part中注册了此变量
      mainListName: "PurchaseRequest", //采购申请列表名
      payMainListName: "PublicPayment", //付款申请
      subListName: "PurchaseRequestSubInfo", //采购申请供应商列表
      mainListType: "SP.Data.PurchaseRequestListItem", //采购申请列表类型，用于post请求
      SubInfoListType: "SP.Data.PurchaseRequestSubInfoListItem", //采购申请供应商列表类型，用于post请求
      userListName: "EmployeeList", //员工详细信息列表名称
      contractListName: "ContractList", //合同列表
      applicantNumberListName: "ApplicantNumber",
      applicantNumberListType: "SP.Data.ApplicantNumberListItem",
      userArr: [], //用户信息数据数组
      costCenterArr: [], //成本中心数组
      companyCodeArr: [], //公司代码数组
      expenseCategoryListName: "ExpenseCategory", //费用类别
      costAccountListName: "CostAccount", //费用科目
      requestDigest: "", //post请求需要此参数
      purchaseRequestData: {
        Title: "", //标题
        Consignor: "", //委托人/经办人
        CostCenter: "", //成本中心
        CompanyCode: "", //公司代码
        DeliveryAddress: "", //交货地址
        IsContract: false, //是否是合同
        ContractNumber: "", //合同号
        Money: "", //金额
        ApplicationType: "", //申请类型
        ExpenseCategory: "", //费用类别
        CostAccount: "", //费用科目
        CodeOfFixedAssets: "", //固定资产编码
        ApplicationNumber: "", //申请单号
        SpecialApprover: "" //特殊审批人
      },
      item: {
        Supplier: "",
        SupplierParts: "",
        Number: "",
        Price: "",
        Money: "",
        Taxation: "",
        Amount: ""
      },
      ContractHistory: [], //合同历史信息
      AccountPaid: "", //已付款
      UnPaid: "", //未付款
      subListData: [],
      loading: true
    };
  },
  methods: {
    //加载主表数据
    loadMainListData: function(guid) {
      var parm = {
        type: "get",
        action: "ListItems",
        list: this.mainListName,
        baseUrl: this.hostUrl,
        condition: "?$filter=ApplicationNumber eq '" + guid + "'"
      };
      var opt = common.queryOpt(parm);
      return common.service(opt);
    },
    getContractHistory() {
      var that = this;
      that.ContractHistory = []; //还原
      //获取合同列表
      var parm = {
        action: "ListItems",
        type: "get",
        list: this.contractListName,
        baseUrl: this.hostUrl,
        condition:
          "?$filter=Number eq '" +
          this.purchaseRequestData.ContractNumber +
          "' "
      }; //Completed 已完成
      var option = common.queryOpt(parm);
      $.when($.ajax(option))
        .done(req => {
          var data = req.d.results;
          if (data.length > 0) {
            //这里肯定会找到合同的
            this.GetPublicPaymentHistory(data);
          }
        })
        .catch(err => {
          this.$message(common.message("error", "获取合同信息失败!"));
        });
    },
    GetPublicPaymentHistory(mainItem) {
      console.log("GetPublicPaymentHistory");
      console.log(mainItem);
      var that = this;
      that.purchaseRequestData.Money = mainItem[0].Money;
      var parm = {
        action: "ListItems",
        type: "get",
        list: this.payMainListName,
        baseUrl: this.hostUrl,
        condition:
          "?$filter=ContractNumber eq '" +
          this.purchaseRequestData.ContractNumber +
          "' and Status eq 'Approved'  and  SettlementType ne '清账' "
      };
      var option = common.queryOpt(parm);
      console.log(option);
      $.when($.ajax(option))
        .done(req => {
          var data = req.d.results;
          if (data.length > 0) {
            var accountPaid = 0;
            data.forEach(item => {
              //push 合同列表
              that.ContractHistory.push({
                Name: mainItem[0].Name,
                Supplier: mainItem[0].Suppler,
                Contents: mainItem[0].Contents,
                LegalPerson: mainItem[0].LegalPerson,
                Money: mainItem[0].Money,
                AccountPaid: item.InvoiceValue
              });
              //累加
              accountPaid += parseFloat(item.InvoiceValue);
            });
            //合计
            that.AccountPaid = accountPaid;
            that.UnPaid =
              parseFloat(mainItem[0].Money == "" ? 0 : mainItem[0].Money) -
              accountPaid;
          } else {
            that.AccountPaid = 0;
            that.UnPaid = mainItem[0].Money;
          }
        })
        .catch(err => {
          this.$message(common.message("error", "获取合同失败!"));
        });
    },
    loadSubListData: function(guid) {
      var parm = {
        type: "get",
        action: "ListItems",
        list: this.subListName,
        baseUrl: this.hostUrl,
        condition: "?$filter=PurchaseRequestGUID eq '" + guid + "'"
      };
      var opt = common.queryOpt(parm);
      return common.service(opt);
    }
  },
  mounted: function() {
    var applicantNumber = common.GetParameterValues("ApplicantNumber");
    var getMainListData = this.loadMainListData(applicantNumber);
    var getSubListData = this.loadSubListData(applicantNumber);
    getMainListData
      .done(req => {
        var data = req.d.results;
        console.log(data);
        if (data.length > 0) {
          this.purchaseRequestData.Title = data[0].Title;
          this.purchaseRequestData.CostCenter = data[0].CostCenter;
          this.purchaseRequestData.CompanyCode = data[0].CompanyCode;
          this.purchaseRequestData.DeliveryAddress = data[0].DeliveryAddress;
          this.purchaseRequestData.IsContract =
            data[0].IsContract == "true" ? true : false;
          this.purchaseRequestData.ApplicationNumber =
            data[0].ApplicationNumber;
          this.purchaseRequestData.ContractNumber = data[0].ContractNumber;
          this.purchaseRequestData.Money = data[0].Money;
          this.purchaseRequestData.ApplicationType = data[0].ApplicationType;
          this.purchaseRequestData.ExpenseCategory = data[0].ExpenseCategory;
          this.purchaseRequestData.CostAccount = data[0].CostAccount;
          this.purchaseRequestData.CodeOfFixedAssets =
            data[0].CodeOfFixedAssets;
          this.purchaseRequestData.Consignor = data[0].Consignor;
          this.purchaseRequestData.SpecialApproverTitle =
            data[0].SpecialApproverTitle;
          this.currentItemId = data[0].Id;
          if (this.purchaseRequestData.IsContract) {
            //如果存在合同需要拉去一下数据
            this.getContractHistory();
          }
        } else {
          this.$message(
            common.message("error", "采购申请列表中不存在该申请单号")
          );
        }
      })
      .catch(err => {
        this.$message(common.message("error", "采购申请列表数据失败"));
      });

    getSubListData
      .done(req2 => {
        console.log(req2);
        var data = req2.d.results;
        if (data.length > 0) {
          data.forEach(d => {
            this.subListData.push({
              Supplier: d.Supplier, //供应商
              SupplierParts: d.SupplierParts, //供应商部件
              Number: d.Number, //数量
              Price: d.Price, //单价
              Money: d.Money, //净额
              Taxation: d.Taxation, //税款
              Amount: d.Amount //总金额
            });
          });
        } else {
          // this.$message(
          //   common.message("warning", "采购申请供应商列表中不存在该申请单号")
          // );
        }
      })
      .catch(error => {
        this.$message(common.message("error", "加载采购申请供应商失败"));
      });
  }
};
</script>

<style>
.caigouDetail {
  min-height: 25px;
  line-height: 25px;
  text-align: center;
  border-collapse: collapse;
  color: gray;
  padding: 2px;
}
.caigouDetail tr td {
  border: 1px solid #cfcfcf;
  padding: 5px;
}
.caigouDetail td:nth-child(1) {
  word-wrap: break-word;
  word-break: break-all;
}
#caigouDetail_Purchase {
  background-color: #409eff;
  font-weight: bold;
  color: white;
  border: 0px;
}
</style>
