<template>
  <div>
    <table class="caigouEdit" style="table-layout：fixed">
      <tr>
        <td colspan="8">
          <span style="font-size:30px;color:#409eff;">采购审批</span>
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
          <el-input
            v-model="purchaseRequestData.Title"
            placeholder="标题"
            :disabled="showApprover==true"
          ></el-input>
        </td>
      </tr>
      <tr>
        <td align="right">委托/经办人：</td>
        <td colspan="2">
          <el-input disabled v-model="purchaseRequestData.Consignor " placeholder="委托/经办人"></el-input>
        </td>
        <td align="right">成本中心：</td>
        <td>
          <el-select
            v-model="purchaseRequestData.CostCenter"
            placeholder="请选择"
            size="medium"
            :disabled="showApprover==true"
          >
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
          <el-select
            v-model="purchaseRequestData.CompanyCode"
            placeholder="请选择"
            size="medium"
            :disabled="showApprover==true"
          >
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
        <td align="right">特殊审批人：</td>
        <td colspan="7">
          <el-input
            v-model="purchaseRequestData.SpecialApprover"
            placeholder="特殊审批人"
            @change="speApprChange"
            :disabled="showApprover==true"
          ></el-input>
        </td>
      </tr>
      <tr>
        <td align="right">交货地址：</td>
        <td colspan="7">
          <el-input
            v-model="purchaseRequestData.DeliveryAddress"
            placeholder="交货地址"
            :disabled="showApprover==true"
          ></el-input>
        </td>
      </tr>
      <tr>
        <td colspan="10" style="text-align:right;">
          <el-button
            type="primary"
            icon="el-icon-plus"
            @click="dialogFormVisible = true"
            :disabled="showApprover==true"
          >添加项目行</el-button>
        </td>
      </tr>
      <tr id="edit_GPPurchase">
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
          <el-checkbox
            @change="clearContract"
            v-model="purchaseRequestData.IsContract"
            :disabled="showApprover==true"
          ></el-checkbox>
        </td>
      </tr>
      <tr>
        <td align="right">合同号：</td>
        <td>
          <el-select
            @change="changeMoney()"
            v-model="purchaseRequestData.ContractNumber"
            filterable
            placeholder="请选择"
            :disabled="showApprover==true?true:purchaseRequestData.IsContract==false"
          >
            <el-option
              v-for="item in ContractNumbers"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </td>
        <td align="right">金额：</td>
        <td colspan="5">
          <el-input v-model="purchaseRequestData.Money" placeholder="金额" disabled></el-input>
        </td>
      </tr>
      <tr id="create_GPPurchase">
        <td>合同名称</td>
        <td>供应商</td>
        <td>内容</td>
        <td>法人代表</td>
        <td>总金额</td>
        <td>已付款</td>
        <td colspan="2">未付款</td>
      </tr>
      <tr v-for="(subItems,index) in  ContractHistory">
        <template v-for="(subItem,cindex) in subItems">
          <td colspan="2" v-if="cindex=='UnPaid'">{{subItem}}</td>
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
          <el-select
            @change="clearCodeOrSelect"
            v-model="purchaseRequestData.ApplicationType"
            placeholder="请选择"
            :disabled="showApprover==true"
          >
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
            :disabled="showApprover==true?true:purchaseRequestData.ApplicationType=='固定资产'"
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
          <el-select
            v-model="purchaseRequestData.CostAccount"
            placeholder="请选择"
            :disabled="showApprover==true?true:purchaseRequestData.ApplicationType=='固定资产'"
          >
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
          <el-input
            :disabled="showApprover==true?true:purchaseRequestData.ApplicationType!='固定资产'"
            v-model="purchaseRequestData.CodeOfFixedAssets"
            placeholder="固定资产编码"
          ></el-input>
        </td>
      </tr>

      <tr>
        <td colspan="8" align="right">
          <el-button
            type="primary"
            @click="onSaveOrSubmmit(buttonType.Submit)"
            v-show="showEditor"
          >提交</el-button>
          <el-button
            @click="onSaveOrSubmmit(buttonType.Save)"
            v-show="showEditor"
            type="primary"
            plain
          >保存</el-button>
          <el-button type="primary" @click="onApproval(buttonType.Approve)" v-show="showApprover">批准</el-button>
          <el-button
            @click="onApproval(buttonType.Reject)"
            v-show="showApprover"
            type="danger"
            plain
          >拒绝</el-button>
          <el-button @click="onEnd()" v-show="requestIsReject" type="danger" plain>终止</el-button>
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
import $ from "jquery";
import common from "../js/common.js";
export default {
  data() {
    return {
      hostUrl: this.GLOBAL.URL, //已在Web Part中注册了此变量
      mainListName: "PurchaseRequest", //采购申请列表名
      subListName: "PurchaseRequestSubInfo", //采购申请供应商列表
      mainListType: "SP.Data.PurchaseRequestListItem", //采购申请列表类型，用于post请求
      SubInfoListType: "SP.Data.PurchaseRequestSubInfoListItem", //采购申请供应商列表类型，用于post请求
      GPPRTaskListType: "SP.Data.PurchaseApproval_x0020_任务ListItem", //SP.Data.PurchaseApproval_x0020_任务ListItem  SP.Data.WorkflowTasksItem
      GpPRTaskListName: "PurchaseApproval 任务",
      userListName: "EmployeeList", //员工详细信息列表名称
      contractListName: "ContractList", //合同列表
      userArr: [], //用户信息数据数组
      costCenterArr: [], //成本中心数组
      companyCodeArr: [], //公司代码数组
      expenseCategoryListName: "ExpenseCategory", //费用类别
      costAccountListName: "CostAccount", //费用科目
      requestDigest: "", //post请求需要此参数
      approverList: "ApproveNode", //审批节点列表名
      SpecApproId: 0, //特殊审批人ID
      buttonType: {
        Submit: "submit",
        Save: "save",
        Approve: "approve",
        Reject: "reject"
      },
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
      ContractNumbers: [], //合同号
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
      loading: true,
      showEditor: true,
      showApprover: false,
      requestIsReject: false,
      currentStep: "",
      currentItemId: 0,
      taskId: 0,
      isChangeSubList: false,
      AccountPaid: "", //已付款
      UnPaid: "", //未付款
      ContractHistory: [] //合同历史信息
    };
  },
  methods: {
    clearContract() {
      if (!this.purchaseRequestData.IsContract) {
        this.purchaseRequestData.ContractNumber = ""; //合同号
        this.purchaseRequestData.Money = ""; //金额
        this.ContractHistory = []; //还原
        this.AccountPaid = ""; //已付款
        this.UnPaid = ""; //未付款
      }
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
            var accountPaid = 0;
            data.forEach(item => {
              //push 合同列表
              that.ContractHistory.push({
                Name: item.Name,
                Supplier: item.Suppler,
                Contents: item.Contents,
                LegalPerson: item.LegalPerson,
                Money: item.Money,
                AccountPaid: item.AccountPaid,
                UnPaid: item.UnPaid
              });
              //累加
              accountPaid += parseFloat(
                item.AccountPaid == "" ? 0 : item.AccountPaid
              );
            });
            //合计
            that.AccountPaid = accountPaid;
            that.UnPaid =
              parseFloat(
                that.purchaseRequestData.Money == ""
                  ? 0
                  : that.purchaseRequestData.Money
              ) - accountPaid;
          }
        })
        .catch(err => {
          this.$message(common.message("error", "获取合同信息失败!"));
        });
    },
    clearCodeOrSelect() {
      if (this.purchaseRequestData.ApplicationType == "费用") {
        this.purchaseRequestData.CodeOfFixedAssets = "";
      } else {
        this.purchaseRequestData.CostAccount = "";
        this.purchaseRequestData.ExpenseCategory = "";
      }
    },
    getCostCenter() {
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
          //去重成本中心
          var costCenter = [];
          data.forEach(d => {
            costCenter.push(d.CostCenter);
          });
          console.log("未去重");
          console.log(costCenter);
          var costCenterUnique = costCenter.filter(function(
            element,
            index,
            array
          ) {
            return array.indexOf(element) === index;
          });
          costCenterUnique.forEach(element => {
            this.costCenterArr.push({
              CostCenter: element
            });
          });
          console.log("去重后");
          console.log(this.costCenterArr);
        }
      });
    },
    onEnd: function() {
      var itemInfo = {
        __metadata: {
          type: this.mainListType
        },
        Status: "Dumped"
      };
      var parm = {
        type: "post",
        action: "EditListItem",
        baseUrl: this.hostUrl,
        list: this.mainListName,
        itemID: this.currentItemId,
        item: itemInfo,
        digest: this.requestDigest
      };
      var opt = common.queryOpt(parm);
      $.when($.ajax(opt))
        .done(req => {
          this.$message(common.message("success", "终止流程成功!"));
          this.$router.push("/home");
        })
        .catch(err => {
          this.$message(common.message("error", "终止流程失败!"));
          this.$router.push("/home");
        });
    },
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
      //获取费用科目
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
        this.isChangeSubList = true;
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
      this.isChangeSubList = true;
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
    onSaveOrSubmmit(type) {
      if (!this.formVerification()) {
        //校验不通过
        // this.$message({
        //   message: this.message,
        //   type: "error"
        // });
        this.$message(common.message("error", this.message));
      } else {
        this.loading = true;
        this.createPurchaseRequestData(type);
      }
    },
    createPurchaseRequestData(type) {
      //创建主表数据
      var total = Number(this.purchaseRequestData.Money);
      var costcenter = this.purchaseRequestData.CostCenter;
      var parm = {
        action: "ListItems",
        type: "get",
        list: this.approverList,
        baseUrl: this.hostUrl,
        condition:
          "?$filter=CostCenter eq  '" + costcenter + "' and Type eq 'GP'"
      };
      var option = common.queryOpt(parm); //获取审批节点请求
      $.when($.ajax(option)).done(r => {
        console.log(r);
        if (r.d.results.length > 0) {
          var data1 = r.d.results[0];
          var itemInfo = {
            __metadata: {
              type: this.mainListType
            },
            Title: this.purchaseRequestData.Title,
            CostCenter: this.purchaseRequestData.CostCenter,
            CompanyCode: this.purchaseRequestData.CompanyCode,
            DeliveryAddress: this.purchaseRequestData.DeliveryAddress,
            IsContract: this.purchaseRequestData.IsContract.toString(),
            ContractNumber: this.purchaseRequestData.IsContract
              ? this.purchaseRequestData.ContractNumber
              : "",
            Money: this.purchaseRequestData.IsContract
              ? this.purchaseRequestData.Money
              : "",
            ApplicationType: this.purchaseRequestData.ApplicationType,
            ExpenseCategory: this.purchaseRequestData.ExpenseCategory,
            CostAccount: this.purchaseRequestData.CostAccount,
            CodeOfFixedAssets: this.purchaseRequestData.CodeOfFixedAssets,
            ApplicationNumber: this.purchaseRequestData.ApplicationNumber,
            SpecialApproverTitle: this.purchaseRequestData.SpecialApprover
          };
          console.log(itemInfo);
          if (total > 0 && total < 1000) {
            itemInfo.Approver1Id = data1.Approver1Id;
          } else if (total >= 1000 && total < 20000) {
            itemInfo.Approver1Id = data1.Approver1Id;
            itemInfo.Approver2Id = data1.Approver2Id;
          } else if (total >= 20000 && total < 50000) {
            itemInfo.Approver1Id = data1.Approver1Id;
            itemInfo.Approver2Id = data1.Approver2Id;
            itemInfo.Approver3Id = data1.Approver3Id;
          } else {
            itemInfo.Approver1Id = data1.Approver1Id;
            itemInfo.Approver2Id = data1.Approver2Id;
            itemInfo.Approver3Id = data1.Approver3Id;
            itemInfo.Approver4Id = data1.Approver4Id;
          }
          if (this.SpecApproId != 0 && this.checkIsSpecAppro) {
            itemInfo.SpecialApproverId = this.SpecApproId;
          }
          if (type == "submit") {
            if (this.currentStep == "Application" && this.taskId != 0) {
              itemInfo.Status = "Changed";
            } else {
              itemInfo.Status = "Submitted";
            }
          } else {
            itemInfo.Status = "Draft";
          }
          var parm = {
            type: "post",
            action: "EditListItem",
            baseUrl: this.hostUrl,
            list: this.mainListName,
            itemID: this.currentItemId,
            item: itemInfo,
            digest: this.requestDigest
          };
          console.log(parm);
          var options = common.queryOpt(parm);
          console.log(options);
          $.when($.ajax(options))
            .done(req => {
              if (type == "submit") {
                if (this.currentStep == "Application" && this.taskId != 0) {
                  this.onApproval("approve");
                }
              }
              this.$message(common.message("success", "采购申请添加成功!"));
              this.createSubInfoItem();
              this.loading = false;
              this.$router.push("/home");
            })
            .catch(err => {
              this.$message(common.message("error", "提交数据时出现了错误!"));
            });
        }
      });
    },
    createSubInfoItem() {
      if (this.isChangeSubList) {
        var getDeleteItems = this.loadSubListData(
          this.purchaseRequestData.ApplicationNumber
        );

        getDeleteItems
          .done(req2 => {
            console.log(req2);
            var data = req2.d.results;
            if (data.length > 0) {
              data.forEach(d => {
                var parm = {
                  type: "delete",
                  action: "DeleteListItem",
                  baseUrl: this.hostUrl,
                  list: this.subListName,
                  digest: this.requestDigest,
                  itemID: d.Id
                };
                var options = common.queryOpt(parm);
                $.when($.ajax(options))
                  .done(req => {
                    this.$message(common.message("success", "税票更新中!"));
                  })
                  .catch(err => {
                    this.$message(common.message("error", "税票清空时失败!"));
                  });
              });
            } else {
              // this.$message(
              //   common.message("error", "税票清单列表中不存在该申请单号")
              // );
            }
          })
          .catch(error => {
            this.$message(common.message("error", "加载税票清单失败"));
          });
      }

      //添加附表数据
      this.subListData.forEach(item => {
        console.log(item);
        var itemInfo = {
          __metadata: {
            type: this.SubInfoListType
          },
          PurchaseRequestGUID: this.purchaseRequestData.ApplicationNumber,
          Supplier: item.Supplier,
          SupplierParts: item.SupplierParts,
          Number: item.Number.toString(),
          Price: item.Price,
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
            //this.$message(common.message("success", "供应商已添加成功!"));
          })
          .catch(err => {
            this.$message(common.message("error", "供应商添加失败!"));
          });
      });
    },
    search(userLoginName) {
      var parm = {
        type: "get",
        action: "ListItems",
        list: this.userListName,
        condition: "?$filter=EmployeeID eq  '" + userLoginName + "'",
        baseUrl: this.hostUrl
      };
      var opt = common.queryOpt(parm);
      $.when($.ajax(opt))
        .done(req => {
          var data = req.d.results;
          if (data.length > 0) {
            data.forEach(d => {
              this.companyCodeArr.push({
                CompanyCode: d.CompanyCode
              });
            });
          } else {
            this.$message(
              common.message(
                "error",
                "当前用户不在员工信息列表中,请及时与管理员联系!"
              )
            );
          }
        })
        .catch(err => {
          this.loading = false;
          this.$message(common.message("error", "检查当前用户出现错误!"));
        });
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
        this.message = "请选择合同号;";
      } else if (
        this.purchaseRequestData.IsContract &&
        this.purchaseRequestData.Money == ""
      ) {
        this.message = "请输入金额;";
      } else if (this.purchaseRequestData.ApplicationType == "") {
        this.message = "请选择申请类型;";
      } else if (
        this.purchaseRequestData.ApplicationType == "费用" &&
        this.purchaseRequestData.ExpenseCategory == ""
      ) {
        this.message = "请选择费用类别;";
      } else if (
        this.purchaseRequestData.ApplicationType == "费用" &&
        this.purchaseRequestData.CostAccount == ""
      ) {
        this.message = "请选择费用科目;";
      } else if (
        this.purchaseRequestData.ApplicationType == "固定资产" &&
        this.purchaseRequestData.CodeOfFixedAssets == ""
      ) {
        this.message = "请填写固定资产编码;";
      } else if (this.subListData.length == 0) {
        this.message = "请添加项目行;";
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
        !isNaN(this.item.Taxation)
      ) {
        //计算 净额 税款 金额
        this.item.Money =
          parseFloat(this.item.Number) * parseFloat(this.item.Price);
        this.item.Amount =
          parseFloat(this.item.Money) + parseFloat(this.item.Taxation);
      }
    },
    getCurrentUser() {
      var parm = {
        action: "CurrentUser",
        type: "get",
        baseUrl: this.hostUrl
      };
      var option = common.queryOpt(parm);
      $.when($.ajax(option))
        .done(c => {
          var loginName = c.d.LoginName.split("|membership|")[1];
          this.purchaseRequestData.Consignor = c.d.Title;
          this.search(loginName);
        })
        .catch(err => {
          this.$message(common.message("error", "加载当前用户出错!"));
        });
    },
    speApprChange() {
      this.loading = true;
      this.SpecApproId = 0;
      this.checkIsSpecAppro = false;
      var speApproverName = this.purchaseRequestData.SpecialApprover;
      var loginName;
      if (speApproverName != "") {
        var parm = {
          type: "get",
          action: "ListItems",
          list: this.userListName,
          condition:
            "?$filter=EmployeeID eq  '" +
            speApproverName.toLowerCase() +
            "' and IsSpecial eq '1'",
          baseUrl: this.hostUrl
        };
        var opt = common.queryOpt(parm);
        $.when($.ajax(opt))
          .done(req => {
            var data = req.d.results;
            console.log(data);
            if (data.length > 0) {
              // data.forEach(d => {
              //   loginName = d.EmployeeID;
              // });
              loginName = "i:0#.f|membership|" + speApproverName;
              var parm2 = {
                type: "get",
                action: "UserByName",
                accountName: loginName,
                baseUrl: this.hostUrl
              };
              console.log(parm2);
              var opt2 = common.queryOpt(parm2);
              $.when($.ajax(opt2))
                .done(re => {
                  console.log(re);
                  this.SpecApproId = re.d.Id;
                  // alert(this.SpecApproId);
                  this.checkIsSpecAppro = true;
                  // alert(this.checkIsSpecAppro);
                  this.loading = false;
                })
                .catch(err => {
                  this.loading = false;
                  this.purchaseRequestData.SpecialApprover = "";
                  this.$message(
                    common.message(
                      "error",
                      "通过员工列表EmployeeID加载特殊审批用户出错!"
                    )
                  );
                });
            } else {
              this.loading = false;
              this.purchaseRequestData.SpecialApprover = "";
              this.$message(
                common.message(
                  "error",
                  "特殊审批人不在员工表中，请及时与管理员联系!"
                )
              );
            }
          })
          .catch(err => {
            this.loading = false;
            this.purchaseRequestData.SpecialApprover = "";
            this.$message(common.message("error", "加载特殊审批用户出错!"));
          });
      } else {
        this.loading = false;
      }
    },
    //获取合同号
    getContractNumber() {
      //获取费用类别
      var that = this;
      var parm = {
        action: "ListItems",
        type: "get",
        list: this.contractListName,
        baseUrl: this.hostUrl,
        condition: ""
      };
      var option = common.queryOpt(parm);
      $.when($.ajax(option))
        .done(function(req) {
          var data = req.d.results;
          var contractNumberList = [];

          if (data.length > 0) {
            data.forEach(item => {
              contractNumberList.push({
                number: item.Number,
                money: item.Money
              });
            });
            console.log(contractNumberList);
            var obj = {};
            contractNumberList = contractNumberList.reduce(function(
              item,
              next
            ) {
              obj[next.number]
                ? ""
                : (obj[next.number] = true && item.push(next));
              return item;
            },
            []);
            console.log(contractNumberList);
            contractNumberList.forEach(item => {
              that.ContractNumbers.push({
                label: item.number,
                value: item.number,
                money: item.money
              });
            });
          }
        })
        .catch(err => {
          this.loading = false;
          this.$message(common.message("error", "加载合同列表时出错!"));
        });
    },
    changeMoney() {
      this.ContractNumbers.forEach(item => {
        if (this.purchaseRequestData.ContractNumber == item.value) {
          this.purchaseRequestData.Money = item.money;
        }
      });
      this.getContractHistory();
    },
    onApproval: function(type) {
      this.loading = true;
      var taskOutcome;
      if (type == "approve") {
        taskOutcome = "已批准"; //Approved 已批准
      } else {
        taskOutcome = "已拒绝"; //已拒绝 Rejected
      }
      var taskItemInfo = {
        __metadata: {
          type: this.GPPRTaskListType
        },
        TaskOutcome: taskOutcome,
        PercentComplete: 1,
        Status: "已完成" //Completed 已完成
      };
      var parm = {
        type: "post",
        action: "EditListItem",
        baseUrl: this.hostUrl,
        list: this.GpPRTaskListName,
        itemID: this.taskId,
        item: taskItemInfo,
        digest: this.requestDigest
      };
      var opt = common.queryOpt(parm);
      console.log(opt);
      $.when($.ajax(opt))
        .done(req => {
          console.log(req);
          this.loading = false;
          this.$message(common.message("success", "审批成功!"));
          this.$router.push("/home");
        })
        .catch(err => {
          console.log(err);
          this.loading = false;
          this.$message(common.message("error", "审批失败!"));
          this.$router.push("/home");
        });
    },
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
    //onload
    this.loading = true;
    this.requestDigest = common.getRequestDigest();
    this.getCostCenter();
    this.getExpenseCategory();
    this.getCostAccount();
    this.getCurrentUser();
    this.getContractNumber();

    var applicantNumber = common.GetParameterValues("ApplicantNumber");
    var step = common.GetParameterValues("Step");
    this.currentStep = step;
    var tId = common.GetParameterValues("TaskId");
    if (typeof Number(tId) == "number") {
      this.taskId = tId;
      if (tId > 0 && step != "Application") {
        this.showEditor = false;
        this.showApprover = true;
      } else if (tId == 0) {
        console.log("用户点击的是保存");
      } else if (tId > 0 && step == "Application") {
        console.log("该请求已被拒绝");
        this.requestIsReject = true;
        this.showEditor = true;
        this.showApprover = false;
      }
      var getMainListData = this.loadMainListData(applicantNumber);
      var getSubListData = this.loadSubListData(applicantNumber);
      getMainListData
        .done(req => {
          var data = req.d.results;
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
          this.$message(common.message("error", "加载采购申请列表数据失败"));
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
      this.loading = false;
    } else {
      this.loading = false;
      common.message(common.message("error", "当前链接错误"));
    }
    this.loading = false;
  }
};
</script>

<style>
.caigouEdit {
  min-height: 25px;
  line-height: 25px;
  text-align: center;
  border-collapse: collapse;
  color: gray;
  padding: 2px;
}
.caigouEdit tr td {
  border: 1px solid #cfcfcf;
  padding: 5px;
}
.caigouEdit td:nth-child(1) {
  word-wrap: break-word;
  word-break: break-all;
}
#edit_GPPurchase {
  background-color: #409eff;
  font-weight: bold;
  color: white;
  border: 0px;
}
</style>