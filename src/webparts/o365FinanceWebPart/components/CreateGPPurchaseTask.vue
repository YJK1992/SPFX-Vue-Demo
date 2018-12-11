<template>
  <div>
    <table class="caigou" style="table-layout：fixed">
      <tr>
        <td colspan="8">
          <span style="font-size:30px;color:#409eff;">采购申请模板</span>
        </td>
      </tr>
      <tr>
        <td align="right">标题：</td>
        <td colspan="7">
          <el-input v-model="purchaseRequestData.Title" placeholder="标题"></el-input>
        </td>
      </tr>
      <tr>
        <td align="right">委托/经办人：</td>
        <td colspan="2">
          <el-input v-model="purchaseRequestData.Consignor " placeholder="委托/经办人">
            <el-button @click="serach()" slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </td>
        <td align="right">成本中心：</td>
        <td>
          <el-select v-model="purchaseRequestData.CostCenter" placeholder="请选择" size="medium">
            <el-option
              v-for="item in costCenterArr"
              :key="item.CostCenter"
              :label="item.CostCenter"
              :value="item.CostCenter"
            ></el-option>
          </el-select>
        </td>
        <td align="right">公司代码：</td>
        <td colspan="2">
          <el-select v-model="purchaseRequestData.CompanyCode" placeholder="请选择" size="medium">
            <el-option
              v-for="item in companyCodeArr"
              :key="item.CompanyCode"
              :label="item.CompanyCode"
              :value="item.CompanyCode"
            ></el-option>
          </el-select>
        </td>
      </tr>
      <tr>
        <td align="right">交货地址：</td>
        <td colspan="7">
          <el-input v-model="purchaseRequestData.DeliveryAddress" placeholder="交货地址"></el-input>
        </td>
      </tr>
      <tr>
        <td colspan="10" style="text-align:right;">
          <el-button type="primary" icon="el-icon-plus" @click="dialogFormVisible = true">添加项目行</el-button>
        </td>
      </tr>
      <tr>
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
        <td>
          <el-button @click="onEditItem(index)" size="small">编辑</el-button>
          <el-button @click="del(index)" type="danger" size="small">删除</el-button>
        </td>
      </tr>
      <tr>
        <td align="right">是否有合同：</td>
        <td colspan="7" align="left">
          <el-checkbox v-model="purchaseRequestData.IsContract"></el-checkbox>
        </td>
      </tr>
      <tr>
        <td align="right">合同号：</td>
        <td>
          <el-input v-model="purchaseRequestData.ContractNumber" placeholder="合同号"></el-input>
        </td>
        <td align="right">金额：</td>
        <td colspan="5">
          <el-input v-model="purchaseRequestData.Money" placeholder="金额"></el-input>
        </td>
      </tr>
      <tr>
        <td align="right">申请类型：</td>
        <td align="left">
          <el-select v-model="purchaseRequestData.ApplicationType" placeholder="请选择">
            <el-option
              v-for="item in applicationTypeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </td>
        <td align="right">费用类别：</td>
        <td>
          <el-select
            @change="purchaseRequestData.CostAccount=''"
            v-model="purchaseRequestData.ExpenseCategory"
            placeholder="请选择"
          >
            <el-option
              v-for="item in expenseCategoryOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </td>
        <td align="right">费用科目：</td>
        <td colspan="3" align="left">
          <el-select v-model="purchaseRequestData.CostAccount" placeholder="请选择">
            <template v-for="item in costAccountOptions">
              <el-option
                v-if="purchaseRequestData.ExpenseCategory==item.Type"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </template>
          </el-select>
        </td>
      </tr>
      <tr>
        <td align="right">固定资产编码：</td>
        <td colspan="7">
          <el-input disabled v-model="purchaseRequestData.CodeOfFixedAssets" placeholder="固定资产编码"></el-input>
        </td>
      </tr>
      <tr>
        <td align="right">申请单号：</td>
        <td colspan="7">
          <el-input disabled v-model="purchaseRequestData.ApplicationNumber" placeholder="申请单号"></el-input>
        </td>
      </tr>
      <tr>
        <td colspan="8" align="right">
          <el-button type="primary" @click="onSubmit()">保存</el-button>
        </td>
      </tr>
    </table>

    <el-dialog title="新增项目" :visible.sync="dialogFormVisible">
      <el-form :model="item">
        <el-form-item label="供应商：" :label-width="formLabelWidth" prop="wl">
          <el-input v-model="item.Supplier" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="供应商部件：" :label-width="formLabelWidth" prop="wl">
          <el-input v-model="item.SupplierParts" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="数量：" :label-width="formLabelWidth" prop="wl">
          <el-input-Number
            @change="itemCalculate"
            v-model="item.Number"
            :min="1"
            :max="10"
            label="描述文字"
          ></el-input-Number>
        </el-form-item>
        <el-form-item label="单价：" :label-width="formLabelWidth" prop="wl">
          <el-input @blur="itemCalculate" v-model="item.Price" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="净额：" :label-width="formLabelWidth" prop="wl">
          <el-input disabled v-model="item.Money" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="税款：" :label-width="formLabelWidth" prop="wl">
          <el-input @blur="itemCalculate" v-model="item.Taxation" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="金额：" :label-width="formLabelWidth" prop="wl">
          <el-input disabled v-model="item.Amount" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div align="right" numberot="footer" class="dialog-footer">
        <el-button @click="onCancel('item')">取 消</el-button>
        <el-button type="primary" @click="onAddItem()">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>


<script>
import * as $ from "jquery";
import common from "../js/common.js";
export default {
  data() {
    return {
      hostUrl: this.GLOBAL.URL, //已在Web Part中注册了此变量
      mainListName: "PurchaseRequest", //采购申请列表名
      subListName: "PurchaseRequestSubInfo", //采购申请供应商列表
      mainListType: "SP.Data.PurchaseRequestListItem", //采购申请列表类型，用于post请求
      SubInfoListType: "SP.Data.PurchaseRequestSubInfoListItem", //采购申请供应商列表类型，用于post请求
      userListName: "EmployeeList", //员工详细信息列表名称
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
        ApplicationNumber: "" //申请单号
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
      applicationTypeOptions: [
        {
          value: "费用",
          label: "费用"
        },
        {
          value: "固定资产",
          label: "固定资产"
        }
      ], //申请类型
      expenseCategoryOptions: [], //费用类别
      costAccountOptions: [], //费用科目
      subListData: [],
      dialogFormVisible: false, //dialog
      editIndex: -1, //是否编辑
      formLabelWidth: "150px", //dialog lable
      message: "",
      loading: true
    };
  },
  methods: {
    getExpenseCategory() {
      //获取费用类别
      var that = this;
      var parm = {
        action: "ListItems",
        type: "get",
        list: this.expenseCategoryListName,
        baseUrl: this.hostUrl,
        condition: ""
      };
      var option = common.queryOpt(parm);
      $.when($.ajax(option))
        .done(function(req) {
          var data = req.d.results;
          if (data.length > 0) {
            data.forEach(item => {
              that.expenseCategoryOptions.push({
                label: item.Title,
                value: item.Title
              });
            });
          }
        })
        .catch(err => {
          this.loading = false;
          this.$message(common.message("error", "加载费用类别时候出错!"));
        });
    },

    getCostAccount() {
      var that = this;
      var parm = {
        action: "ListItems",
        type: "get",
        list: this.costAccountListName,
        baseUrl: this.hostUrl,
        condition: ""
      };
      var option = common.queryOpt(parm);
      $.when($.ajax(option))
        .done(function(req) {
          var data = req.d.results;
          if (data.length > 0) {
            data.forEach(item => {
              that.costAccountOptions.push({
                Type: item.ExpenseCategoryTitle,
                label: item.Title,
                value: item.Title
              });
            });
          }
        })
        .catch(err => {
          this.loading = false;
          this.$message(common.message("error", "加载费用科目时候出错!"));
        });
    },
    onAddItem() {
      if (!this.itemVerification()) {
        //校验不通过
        this.$message({
          message: this.message,
          type: "error"
        });
      } else {
        if (this.editIndex != -1) {
          //编辑
          this.subListData[this.editIndex] = this.item;
        } else {
          //新增
          this.subListData.push(this.item);
        }
        this.item = {
          Supplier: "", //供应商
          SupplierParts: "", //供应商部件
          Number: "", //数量
          Price: "", //单价
          Money: "", //净额
          Taxation: "", //税款
          Amount: "" //总金额
        };
        this.dialogFormVisible = false;
      }
    },
    del(index) {
      this.subListData.splice(index, 1);
    },
    onEditItem(index) {
      this.item = this.subListData[index];
      this.editIndex = index;
      this.dialogFormVisible = true;
    },
    onCancel: function() {
      this.editIndex = -1;
      this.item = {
        Supplier: "",
        SupplierParts: "",
        Number: "",
        Price: "",
        Money: "",
        Taxation: "",
        Amount: ""
      };
      this.dialogFormVisible = false;
    },
    onSubmit() {
      if (!this.formVerification()) {
        //校验不通过
        // this.$message({
        //   message: this.message,
        //   type: "error"
        // });
        this.$message(common.message("error", this.message));
      } else {
        this.loading = true;
        var accountName = "i:0#.f|membership|" + this.userArr[0].EmployeeID;
        var parm = {
          action: "UserByName",
          type: "get",
          accountName: accountName,
          baseUrl: this.hostUrl,
          condition: ""
        };
        var opt = common.queryOpt(parm);
        $.when($.ajax(opt))
          .done(req => {
            this.createPurchaseRequestData(req.d.Id);
            this.loading = false;
            this.$router.push("/home");
            this.$message(common.message("success", "数据提交成功!"));
          })
          .catch(err => {
            this.$message(common.message("error", "提交数据时出现了错误!"));
          });
        // console.log(this.purchaseRequestData);
        // console.log(this.subListData);
      }
    },
    createPurchaseRequestData(userId) {
      var itemInfo = {
        __metadata: {
          type: this.mainListType
        },
        Title: this.purchaseRequestData.Title,
        ConsignorId: userId,
        CostCenter: this.purchaseRequestData.CostAccount,
        CompanyCode: this.purchaseRequestData.CompanyCode,
        DeliveryAddress: this.purchaseRequestData.DeliveryAddress,
        IsContract: this.purchaseRequestData.IsContract.toString(),
        ContractNumber: this.purchaseRequestData.ContractNumber,
        Money: this.purchaseRequestData.Money,
        ApplicationType: this.purchaseRequestData.ApplicationType,
        ExpenseCategory: this.purchaseRequestData.ExpenseCategory,
        CostAccount: this.purchaseRequestData.CostAccount,
        CodeOfFixedAssets: this.purchaseRequestData.CodeOfFixedAssets,
        ApplicationNumber: this.purchaseRequestData.ApplicationNumber
      };
      var parm = {
        type: "post",
        action: "AddInList",
        baseUrl: this.hostUrl,
        list: this.mainListName,
        item: itemInfo,
        digest: this.requestDigest
      };
      var options = common.queryOpt(parm);
      $.when($.ajax(options))
        .done(req => {
          this.createSubInfoItem(this.subListData);
          this.$message(common.message("success", "采购申请添加成功!"));
        })
        .catch(err => {
          this.$message(common.message("error", "提交数据时出现了错误!"));
        });
    },
    createSubInfoItem(subInfoArr) {
      //添加附表数据
      subInfoArr.forEach(item => {
        console.log(item);
        var itemInfo = {
          __metadata: {
            type: this.SubInfoListType
          },
          PurchaseRequestGUID: this.purchaseRequestData.ApplicationNumber,
          Supplier: item.Supplier,
          SupplierParts: item.SupplierParts,
          Number: item.Number.toString(),
          Price: item.price.toString(),
          Money: item.Money.toString(),
          Taxation: item.Taxation.toString(),
          Amount: item.Amount.toString()
        };
        var parm = {
          type: "post",
          action: "AddInList",
          baseUrl: this.hostUrl,
          list: this.subListName,
          item: itemInfo,
          digest: this.requestDigest
        };
        var options = common.queryOpt(parm);
        $.when($.ajax(options))
          .done(req => {
            this.$message(common.message("success", "供应商已添加成功!"));
          })
          .catch(err => {
            this.$message(common.message("error", "供应商添加失败!"));
          });
      });
    },
    serach() {
      this.loading = true;
      var consignor = this.purchaseRequestData.Consignor;
      if (consignor != "" || consignor != null) {
        var parm = {
          type: "get",
          action: "ListItems",
          list: this.userListName,
          condition:
            "?$filter=EmployeeName eq  '" + consignor + "' and IsAgent eq '1' ",
          baseUrl: this.hostUrl
        };
        var opt = common.queryOpt(parm);
        $.when($.ajax(opt))
          .done(req => {
            var data = req.d.results;
            if (data.length > 0) {
              data.forEach(d => {
                this.userArr.push({
                  EmployeeID: d.EmployeeID,
                  EmployeeName: d.EmployeeName
                });
                this.costCenterArr.push({
                  CostCenter: d.CostCenter,
                  CostCenterName: d.CostCenterName
                });
                this.companyCodeArr.push({
                  CompanyCode: d.CompanyCode
                });
              });
              if (this.costCenterArr.length > 0) {
                this.purchaseRequestData.CostCenter = this.costCenterArr[0].CostCenter;
              }
              if (this.companyCodeArr.length > 0) {
                this.purchaseRequestData.CompanyCode = this.companyCodeArr[0].CompanyCode;
              }
              this.loading = false;
              this.$message(common.message("success", "搜索成功!"));
            } else {
              this.loading = false;
              this.$message(
                common.message(
                  "error",
                  "搜索的用户不在员工信息列表中,请及时与管理员联系!"
                )
              );
            }
          })
          .catch(err => {
            this.loading = false;
            this.$message(
              common.message(
                "error",
                "搜索的用户不在员工信息列表中,请及时与管理员联系!"
              )
            );
          });
      }
    },
    formVerification() {
      //主表校验
      var isSuccess = false;
      if (this.purchaseRequestData.Title == "") {
        this.message = "请输入标题;";
      } else if (this.purchaseRequestData.Consignor == "") {
        this.message = "请选择委托人/经办人;";
      } else if (this.purchaseRequestData.DeliveryAddress == "") {
        this.message = "请输入交货地址;";
      } else if (
        this.purchaseRequestData.IsContract &&
        this.purchaseRequestData.ContractNumber == ""
      ) {
        this.message = "请输入合同号;";
      } else if (
        this.purchaseRequestData.IsContract &&
        this.purchaseRequestData.Money == ""
      ) {
        this.message = "请输入金额;";
      } else if (this.purchaseRequestData.ApplicationType == "") {
        this.message = "请选择申请类型;";
      } else if (this.purchaseRequestData.ExpenseCategory == "") {
        this.message = "请选择费用类别;";
      } else if (this.purchaseRequestData.CostAccount == "") {
        this.message = "请选择费用科目;";
      } else {
        isSuccess = true;
      }
      return isSuccess;
    },
    itemVerification() {
      //附表校验
      var isSuccess = false;
      if (this.item.Supplier == "") {
        this.message = "请输入供应商;";
      } else if (this.item.SupplierParts == "") {
        this.message = "请输入供应商部件;";
      } else if (this.item.Number == "") {
        this.message = "请输入数量;";
      } else if (this.item.Price == "") {
        this.message = "请输入单价;";
      } else if (isNaN(this.item.Price)) {
        this.message = "请输入合法单价;";
      } else if (isNaN(this.item.Taxation)) {
        this.message = "请输入合法税款;";
      } else {
        isSuccess = true;
      }
      return isSuccess;
    },
    itemCalculate() {
      //计算附表金额
      if (
        !isNaN(this.item.Price) &&
        this.item.Price != "" &&
        !isNaN(this.item.Taxation)&&
        this.item.Taxation!=""
      ) {
        //计算 净额 税款 金额
        this.item.Money =
          parseFloat(this.item.Number) * parseFloat(this.item.Price);
        this.item.Amount =
          parseFloat(this.item.Money) + parseFloat(this.item.Taxation);
      }
    }
  },
  mounted: function() {
    //onload
    this.loading = true;
    this.purchaseRequestData.ApplicationNumber = common.generateUUID();
    this.requestDigest = common.getRequestDigest();
    this.getExpenseCategory();
    this.getCostAccount();
    this.loading = false;
  }
};
</script>

<style>
.caigou {
  min-height: 25px;
  line-height: 25px;
  text-align: center;
  border-collapse: collapse;
  color: gray;
  padding: 2px;
}
.caigou tr td {
  border: 1px solid #cfcfcf;
  padding: 5px;
}
.caigou td:nth-child(1) {
  word-wrap: break-word;
  word-break: break-all;
}
.caigou tr:nth-child(6) {
  background-color: #409eff;
  font-weight: bold;
  color: white;
  border: 0px;
}
</style>