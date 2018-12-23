<template>
  <div>
    <table class="duigong" style="  border-collapse: collapse;">
      <tr>
        <td colspan="8">
          <span style="font-size:30px;color:#409eff;">对公付款</span>
        </td>
      </tr>
      <tr>
        <td align="right">申请单号：</td>
        <td colspan="7">
          <el-input disabled v-model="PublicPayment.ApplicationNumber" placeholder="申请单号"></el-input>
        </td>
      </tr>

      <tr>
        <td align="right">单据编号：</td>
        <td align="left">
          <el-select
            @change="isHaveContract"
            v-model="PublicPayment.ReceiptNumber"
            filterable
            placeholder="请选择"
          >
            <el-option
              v-for="item in ReceiptNumbers"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </td>
        <td align="right">报销类型：</td>
        <td align="left">
          <el-select v-model="PublicPayment.ReimbursementType" placeholder="请选择">
            <el-option
              v-for="item in ReimbursementType"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </td>
        <td align="right">结算方式：</td>
        <td align="left" colspan="5">
          <el-select v-model="PublicPayment.SettlementType" placeholder="请选择">
            <el-option
              v-for="item in SettlementType"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </td>
      </tr>
      <tr>
        <td align="right">经办人：</td>
        <td>
          <el-input disabled v-model="PublicPayment.Trustees" placeholder="经办人"></el-input>
        </td>
        <td align="right">成本中心：</td>
        <td colspan="4" align="left">
          <el-select v-model="PublicPayment.CostCenter" placeholder="请选择" size="medium">
            <el-option
              v-for="item in costCenterArr"
              :key="item.CostCenter"
              :label="item.CostCenter"
              :value="item.CostCenter"
            ></el-option>
          </el-select>
        </td>

      </tr>
      <tr>
        <td align="right">发票金额：</td>
        <td>
          <el-input
            @change="CalculateAmountInlowercase"
            v-model="PublicPayment.InvoiceValue"
            placeholder="发票金额"
          ></el-input>
        </td>
        <td align="right">币种：</td>
        <td align="left">
          <el-select
            @change="CalculateAmountInlowercase"
            v-model="PublicPayment.Currency"
            placeholder="请选择"
          >
            <el-option
              v-for="item in Currency"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </td>
        <td align="right">汇率：</td>
        <td colspan="2">
          <el-input
            @change="CalculateAmountInlowercase"
            v-model="PublicPayment.ExchangeRate"
            placeholder="汇率"
          ></el-input>
        </td>
      </tr>
      <tr>
        <td align="right">金额(小写)：</td>
        <td>
          <el-input
            disabled
            v-model="PublicPayment.AmountInlowercase"
            @change="convertMoney"
            placeholder="小写金额"
          ></el-input>
        </td>
        <td align="right">金额(大写)：</td>
        <td colspan="6">
          <el-input v-model="PublicPayment.CapitalizationAmount" disabled placeholder="大写金额"></el-input>
        </td>
      </tr>
      <tr>
        <td colspan="3" style="color:#409eff">此项报销有借款时必须要填写借款单号</td>
        <td align="right">借款单号：</td>
        <td colspan="4">
          <el-input :disabled="PublicPayment.ReimbursementType!='费用借款'" v-model="PublicPayment.LoanNumber" placeholder="借款单号"></el-input>
        </td>
      </tr>
      <tr>
        <td colspan="8" align="center" style="color:#409eff">结算方式为“汇款”或“支票”时填写</td>
      </tr>
      <tr>
        <td align="right">收款单位名称：</td>
        <td colspan="7">
          <el-input v-model="PublicPayment.CollectionUnit" placeholder="收款单位名称"></el-input>
        </td>
      </tr>
      <tr>
        <td rowspan="3" style="writing-mode:lr-tb">汇款、汇票时填写</td>
        <td align="right">开户行：</td>
        <td colspan="3">
          <el-input v-model="PublicPayment.OpeningBank" placeholder="开户行"></el-input>
        </td>
        <td align="right">账号：</td>
        <td colspan="2">
          <el-input v-model="PublicPayment.Account" placeholder="账号"></el-input>
        </td>
      </tr>
      <tr>
        <td align="right">省/直辖市：</td>
        <td colspan="3">
          <el-input v-model="PublicPayment.City" placeholder="省/直辖市"></el-input>
        </td>
        <td align="right">市/县：</td>
        <td colspan="2">
          <el-input v-model="PublicPayment.County" placeholder="市/县"></el-input>
        </td>
      </tr>
      <tr>
        <td align="right">汇款附言：</td>
        <td colspan="6">
          <el-input v-model="PublicPayment.DetailsOfPayment" placeholder="省/直辖市"></el-input>
        </td>
      </tr>
      <tr>
        <td align="right">是否有合同：</td>
        <td colspan="7" align="left">
          <el-checkbox :disabled="disabledContract===1" v-model="PublicPayment.IsContract"></el-checkbox>
        </td>
      </tr>
      <tr>
        <td align="right">合同号：</td>
        <td colspan="2" align="left">
          <el-select
            :disabled="disabledContract===1"
            @change="changeMoney()"
            v-model="PublicPayment.ContractNumber"
            filterable
            placeholder="请选择"
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
        <td colspan="4">
          <el-input disabled v-model="PublicPayment.Money" placeholder="金额"></el-input>
        </td>
      </tr>
      <tr>
        <td style="width:200px">合同名称</td>
        <td style="width:270px">供应商</td>
        <td style="width:200px">内容</td>
        <td>法人代表</td>
        <td style="width:170px">总金额</td>
        <td style="width:170px">已付款</td>
        <td style="width:170px">未付款</td>
      </tr>
      <tr v-for="(subItems,index) in  ContractList">
        <template v-for="(subItem,cindex) in subItems">
          <td>{{subItem}}</td>
        </template>
      </tr>
      <tr>
        <td align="right">已付款：</td>
        <td align="left" colspan="2">{{AccountPaid}}</td>
        <td align="right">未付款：</td>
        <td align="left" colspan="3">{{UnPaid}}</td>
      </tr>
      <tr>
        <td align="right">项目名称：</td>
        <td colspan="2">
          <el-input v-model="PublicPayment.ProjectName" placeholder="合同号"></el-input>
        </td>
        <td align="right">项目编号：</td>
        <td colspan="3">
          <el-input v-model="PublicPayment.ProjectNumber" placeholder="项目编号"></el-input>
        </td>
      </tr>
      <tr>
        <td align="right">运费专用发票：</td>
        <td align="left">
          <el-checkbox v-model="PublicPayment.IsFreightInvoice"></el-checkbox>
        </td>
        <td colspan="5" align="left">
          <el-button type="primary" @click="dialogTableVisible = true">税票清单</el-button>
          <el-button type="primary" @click="addTaxReceipt">添加税票</el-button>
          <el-button type="primary" @click="dialogTableVisible2 = true">费用分摊清单</el-button>
          <el-button type="primary" @click="dialogFormVisible2=true">添加费用分摊</el-button>
        </td>
      </tr>
      <tr>
        <td align="right">备注：</td>
        <td colspan="7">
          <el-input v-model="PublicPayment.Remark" placeholder="备注"></el-input>
        </td>
      </tr>
      <tr>
        <td align="right">费用类别：</td>
        <td align="left">
          <el-select
            @change="PublicPayment.CostAccount=''"
            v-model="PublicPayment.ExpenseCategory"
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
        <td align="right">费用科目:</td>
        <td colspan="5" align="left">
          <el-select v-model="PublicPayment.CostAccount" placeholder="请选择">
            <template v-for="item in costAccountOptions">
              <el-option
                v-if="PublicPayment.ExpenseCategory==item.Type"
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
          <el-input v-model="PublicPayment.CodeOfFixedAssets" placeholder="固定资产编码"></el-input>
        </td>
      </tr>
      <tr>
                <td align="right">特殊审批人：</td>
        <td colspan="7">
          <el-input
            v-model="PublicPayment.SpecialApprover"
            placeholder="特殊审批人"
            @change="speApprChange"
          ></el-input>
        </td>
      </tr>

      <!-- <tr>
        <td align="right">结算：</td>
        <td colspan="7" align="left">
          <el-checkbox display v-model="PublicPayment.IsSettlement"></el-checkbox>
        </td>
      </tr> -->
      <tr>
        <td colspan="8" align="right">
          <el-button type="primary" @click="onSaveOrSubmmit(buttonType.Submit)">提交</el-button>
          <el-button @click="onSaveOrSubmmit(buttonType.Save)" type="primary" plain>保存</el-button>
        </td>
      </tr>
    </table>

    <!-- 税票清单列表 -->
    <el-dialog show-summary title="税票清单" stripe :visible.sync="dialogTableVisible">
      <el-table :data="TaxReceiptList">
        <el-table-column type="index" :index="indexMethod" label="序号" width="50"></el-table-column>
        <el-table-column property="CompanyCode" label="公司代码" width="100"></el-table-column>
        <el-table-column property="InvoiceNumber" label="发票号" width="150"></el-table-column>
        <el-table-column property="Currency" label="币种"></el-table-column>
        <el-table-column property="Supplier" label="供应商"></el-table-column>
        <el-table-column property="InvoiceValue" label="发票金额"></el-table-column>
        <el-table-column property="TaxRate" label="税率"></el-table-column>
        <el-table-column property="TaxCode" label="税码"></el-table-column>
        <el-table-column label="操作" width="150">
          <template slot-scope="scope">
            <el-button size="mini" @click="onEditItem(scope.$index)">编辑</el-button>
            <el-button size="mini" type="danger" @click="del(scope.$index)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>

    <!-- 新增税票 -->
    <el-dialog title="新增税票" :visible.sync="dialogFormVisible">
      <el-form :model="TaxReceipt">
        <el-form-item label="公司代码:" :label-width="formLabelWidth" prop>
          <el-input v-model="TaxReceipt.CompanyCode"></el-input>
        </el-form-item>
        <el-form-item label="发票号:" :label-width="formLabelWidth" prop>
          <el-input v-model="TaxReceipt.InvoiceNumber"></el-input>
        </el-form-item>
        <el-form-item label="币种:" :label-width="formLabelWidth" prop>
          <el-input v-model="TaxReceipt.Currency"></el-input>
        </el-form-item>
        <el-form-item label="供应商名称:" :label-width="formLabelWidth" prop>
          <el-input v-model="TaxReceipt.Supplier"></el-input>
        </el-form-item>
        <el-form-item label="发票金额:" :label-width="formLabelWidth" prop>
          <el-input v-model="TaxReceipt.InvoiceValue"></el-input>
        </el-form-item>
        <el-form-item label="税率:" :label-width="formLabelWidth" prop>
          <el-input v-model="TaxReceipt.TaxRate"></el-input>
        </el-form-item>
        <el-form-item label="税码:" :label-width="formLabelWidth" prop>
          <el-input v-model="TaxReceipt.TaxCode"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="onCancel('item')">取 消</el-button>
        <el-button type="primary" @click="onAddItem()">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 费用清单列表 -->
    <el-dialog show-summary title="费用分摊清单" stripe :visible.sync="dialogTableVisible2">
      <table width="100%" class="duigong" style="  border-collapse: collapse;">
        <tr>
          <td>费用科目号</td>
          <td>费用名称</td>
          <td>摊出成本中心编号</td>
          <td>摊出金额</td>
          <td>项目名称</td>
          <td>项目编号</td>
          <td>摊出成本中心签批人姓名</td>
          <td>摘要</td>
          <td>操作</td>
        </tr>
        <template>
          <tr v-for="(subItems,index) in  ExpenseAllocationList">
            <template v-if="!ExpenseAllocationList[index].IsIn">
              <template v-for="(subItem,cindex) in subItems">
                <td v-if="cindex!='IsIn'">{{subItem}}</td>
              </template>
              <td>
                <el-button @click="onEditItem2(index)" size="small">编辑</el-button>
                <el-button @click="del2(index)" type="danger" size="small">删除</el-button>
              </td>
            </template>
          </tr>
        </template>
        <tr>
          <td>费用科目号</td>
          <td>费用名称</td>
          <td>摊入成本中心编号</td>
          <td>摊入金额</td>
          <td>项目名称</td>
          <td>项目编号</td>
          <td>摊入成本中心签批人姓名</td>
          <td>摘要</td>
          <td>操作</td>
        </tr>
        <template>
          <tr v-for="(subItems,index) in  ExpenseAllocationList">
            <template v-if="ExpenseAllocationList[index].IsIn">
              <template v-for="(subItem,cindex) in subItems">
                <td v-if="cindex!='IsIn'">{{subItem}}</td>
              </template>
              <td>
                <el-button @click="onEditItem2(index)" size="small">编辑</el-button>
                <el-button @click="del2(index)" type="danger" size="small">删除</el-button>
              </td>
            </template>
          </tr>
        </template>
      </table>
    </el-dialog>

    <!-- 费用清单 -->
    <el-dialog title="新增费用清单" :visible.sync="dialogFormVisible2">
      <el-form :model="ExpenseAllocation">
        <el-form-item label="费用科目号:" :label-width="formLabelWidth" prop>
          <el-input v-model="ExpenseAllocation.Title"></el-input>
        </el-form-item>
        <el-form-item label="费用名称:" :label-width="formLabelWidth" prop>
          <el-input v-model="ExpenseAllocation.Number"></el-input>
        </el-form-item>
        <el-form-item label="成本中心编号:" :label-width="formLabelWidth" prop>
          <el-input v-model="ExpenseAllocation.CostCenterNumber"></el-input>
        </el-form-item>
        <el-form-item label="摊出金额:" :label-width="formLabelWidth" prop>
          <el-input v-model="ExpenseAllocation.Money"></el-input>
        </el-form-item>
        <el-form-item label="项目名称:" :label-width="formLabelWidth" prop>
          <el-input v-model="ExpenseAllocation.ProjectName"></el-input>
        </el-form-item>
        <el-form-item label="项目编号:" :label-width="formLabelWidth" prop>
          <el-input v-model="ExpenseAllocation.ProjectNumber"></el-input>
        </el-form-item>
        <el-form-item label="成本中心签批人姓名:" :label-width="formLabelWidth" prop>
          <el-input v-model="ExpenseAllocation.CostCenterName"></el-input>
        </el-form-item>
        <el-form-item label="摘要:" :label-width="formLabelWidth" prop>
          <el-input v-model="ExpenseAllocation.Abstract"></el-input>
        </el-form-item>
        <el-form-item label="是否是摊入:" :label-width="formLabelWidth" prop>
          <el-checkbox v-model="ExpenseAllocation.IsIn"></el-checkbox>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="onCancel2('item')">取 消</el-button>
        <el-button type="primary" @click="onAddItem2()">确 定</el-button>
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
      mainListName: "PublicPayment", //对公付款
      subListName: "TaxReceipt", //税票清单
      mainListType: "SP.Data.PublicPaymentListItem", //税票清单列表类型，用于post请求
      SubInfoListType: "SP.Data.TaxReceiptListItem", //税票清单列表类型，用于post请求
      subListName2: "ExpenseAllocation",
      SubInfoListType2: "SP.Data.ExpenseAllocationListItem", //费用分摊列表类型，用于post请求
      userListName: "EmployeeList", //员工详细信息列表名称
      GpPRListName: "PurchaseRequest",
      ContractListName: "ContractList", //合同列表pushtable
      disabledContract: 0, //是否禁用合同相关选项 0是不禁用
      approverList: "ApproveNode", //审批节点列表名
      userArr: [], //用户信息数据数组
      costCenterArr: [], //成本中心数组
      companyCodeArr: [], //公司代码数组
      ContractList: [], //合同列表
      ContractNumbers: [], //所有合同号
      AccountPaid: "", //合同列表已支付金额
      UnPaid: "", //合同列表未支付金额
      expenseCategoryListName: "ExpenseCategory", //费用类别
      costAccountListName: "CostAccount", //费用科目
      SpecApproId: 0, //特殊审批人ID
      ReceiptNumbers: [], //已完成的采购申请单
      buttonType: {
        Submit: "submit",
        Save: "save"
      },
      PublicPayment: {
        ReimbursementType: "", //报销类型
        SettlementType: "", //结算方式
        Trustees: "", //经办人
        CostCenter: "", //成本中心
        Currency: "", //币种
        InvoiceValue: "", //发票金额
        ExchangeRate: "", //汇率
        AmountInlowercase: "", //金额小写
        CapitalizationAmount: "", //金额大写
        LoanNumber: "", //借款单号
        CollectionUnit: "", //收款单位名称
        OpeningBank: "", //开户行
        Account: "", //账号
        City: "", //省市
        County: "", //市县
        DetailsOfPayment: "", //汇款附言
        IsContract: false, //是否有合同
        ContractNumber: "", //合同号
        Money: "", //金额
        ProjectName: "", //项目名称
        ProjectNumber: "", //项目编号
        IsFreightInvoice: false, //运费发票
        Remark: "", //备注
        ExpenseCategory: "", //费用类别
        CostAccount: "", //费用科目
        CodeOfFixedAssets: "", //固定资产编码
        ApplicationNumber: "", //申请单号
        ReceiptNumber: "", //单据编号
        IsSettlement: false, //结算
        SpecialApprover: "" //特殊审批人
      },
      TaxReceiptList: [], //税票清单
      TaxReceipt: {
        CompanyCode: "", //公司代码
        InvoiceNumber: "", //发票号
        Currency: "", //币种
        Supplier: "", //供应商
        InvoiceValue: "", //发票金额
        TaxRate: "", //税率
        TaxCode: "" //税码
      },
      ExpenseAllocationList: [], //费用分摊列表
      ExpenseAllocation: {
        Title: "", //费用名称
        Number: "", //费用号码
        CostCenterNumber: "", //成本中心号码
        Money: "", //摊出/入金额
        ProjectName: "", //项目名称
        ProjectNumber: "", //项目号码
        CostCenterName: "", //摊出成本中心签批人姓名
        Abstract: "", //摘要
        IsIn: false //是否摊入
      }, //费用分摊
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
      Currency: [
        //币种
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
      ],
      dialogTableVisible: false, //税票清单列表
      dialogTableVisible2: false, //费用分摊列表
      dialogFormVisible: false, //添加税票清单
      dialogFormVisible2: false, //添加费用分摊
      editIndex: -1, //是否编辑
      editIndex2: -1, //是否编辑费用分摊
      formLabelWidth: "150px", //添加税票清单中的宽度
      expenseCategoryOptions: [], //费用类别
      costAccountOptions: [], //费用科目
      message: "" //消息文本
    };
  },
  methods: {
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
    CalculateAmountInlowercase() {
      if (this.PublicPayment.InvoiceValue == "") {
        this.$message(common.message("error", "请填写发票金额!"));
      } else if (isNaN(this.PublicPayment.InvoiceValue)) {
        this.$message(common.message("error", "发票金额不合法!"));
      } else if (this.PublicPayment.Currency == "") {
        this.$message(common.message("error", "请选择币种!"));
      } else if (this.PublicPayment.ExchangeRate == "") {
        this.$message(common.message("error", "请输入汇率!"));
      } else if (isNaN(this.PublicPayment.ExchangeRate)) {
        this.$message(common.message("error", "汇率不合法!"));
      } else {
        //计算
        if (this.PublicPayment.Currency == "人民币") {
          this.PublicPayment.AmountInlowercase = this.PublicPayment.InvoiceValue;
        } else {
          this.PublicPayment.AmountInlowercase =
            parseFloat(this.PublicPayment.InvoiceValue) *
            parseFloat(this.PublicPayment.ExchangeRate);
        }
              this.convertMoney()
      }
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
    search(userLoginName) {
      var trustees = this.PublicPayment.Trustees;
      if (trustees != "" || trustees != null) {
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
               var selectedCostCenter='';
              data.forEach(d => {
                // this.costCenterArr.push({
                //   CostCenter: d.CostCenter,
                //   CostCenterName: d.CostCenterName
                // });
                selectedCostCenter=d.CostCenter;
                this.companyCodeArr.push({
                  CompanyCode: d.CompanyCode
                });
              });
              this.PublicPayment.CostCenter=selectedCostCenter;
            } else {
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
      if (this.PublicPayment.ReimbursementType == "") {
        this.message = "请选择报销类型;";
      } else if (this.PublicPayment.SettlementType == "") {
        this.message = "请选择结算方式;";
      } else if (this.PublicPayment.InvoiceValue == "") {
        this.message = "请填写发票金额;";
      } else if (isNaN(this.PublicPayment.InvoiceValue)) {
        this.message = "发票金额不合法;";
      } else if (this.PublicPayment.Currency == "") {
        this.message = "请选择币种;";
      } else if (this.PublicPayment.ExchangeRate == "") {
        this.message = "请输入汇率;";
      } else if (isNaN(this.PublicPayment.ExchangeRate)) {
        this.message = "汇率不合法;";
      } else if (this.PublicPayment.AmountInlowercase == "") {
        this.message = "请输入小写金额;";
      } else if (isNaN(this.PublicPayment.AmountInlowercase)) {
        this.message = "小写金额不合法;";
      } else if (
        this.PublicPayment.LoanNumber == "" &&
        this.PublicPayment.ReimbursementType == "费用借款"
      ) {
        this.message = "请输入借款单号;";
      } else if (
        (this.PublicPayment.SettlementType == "4-汇款" ||
          this.PublicPayment.SettlementType == "3-支票") &&
        this.PublicPayment.CollectionUnit == ""
      ) {
        this.message = "请填写收款单位全称;";
      } else if (
        (this.PublicPayment.SettlementType == "4-汇款" ||
          this.PublicPayment.SettlementType == "3-支票") &&
        this.PublicPayment.OpeningBank == ""
      ) {
        this.message = "请填开户行;";
      } else if (this.PublicPayment.OpeningBank.length > 100) {
        this.message = "开户行不能大于100字符;";
      } else if (
        (this.PublicPayment.SettlementType == "4-汇款" ||
          this.PublicPayment.SettlementType == "3-支票") &&
        this.PublicPayment.City == ""
      ) {
        this.message = "请填写省市;";
      } else if (
        this.PublicPayment.City != "" &&
        this.PublicPayment.City.substr(-1) != "省" &&
        this.PublicPayment.City.substr(-1) != "市"
      ) {
        this.message = "省/直辖市必须已省或市结尾;";
      } else if (
        (this.PublicPayment.SettlementType == "4-汇款" ||
          this.PublicPayment.SettlementType == "3-支票") &&
        this.PublicPayment.County == ""
      ) {
        this.message = "请填写市/县;";
      } else if (
        (this.PublicPayment.SettlementType == "4-汇款" ||
          this.PublicPayment.SettlementType == "3-支票") &&
        this.PublicPayment.DetailsOfPayment == ""
      ) {
        this.message = "请填写汇款附言;";
      } else if (this.PublicPayment.DetailsOfPayment.length >= 300) {
        this.message = "汇款附言不得超过300字符";
      } else if (
        this.PublicPayment.IsContract &&
        this.PublicPayment.ContractNumber == ""
      ) {
        this.message = "请输入合同号;";
      } else if (
        this.PublicPayment.IsContract &&
        this.PublicPayment.Money == ""
      ) {
        this.message = "请输入金额;";
      } else if (
        this.PublicPayment.IsFreightInvoice &&
        !this.calculateMoney()
      ) {
        this.message = "税票清单和表单金额总和不一致;";
      } else {
        isSuccess = true;
      }
      return isSuccess;
    },
    itemVerification() {
      //附表校验
      var isSuccess = false;
      if (this.TaxReceipt.InvoiceNumber == "") {
        this.message = "请输入发票号码;";
      } else if (this.TaxReceipt.Currency == "") {
        this.message = "请输入币种";
      } else if (this.TaxReceipt.InvoiceValue == "") {
        this.message = "请输入发票金额;";
      } else if (isNaN(this.TaxReceipt.InvoiceValue)) {
        this.message = "发票金额不合法;";
      } else if (this.TaxReceipt.TaxRate == "") {
        this.message = "请输入税率;";
      } else if (isNaN(this.TaxReceipt.TaxRate)) {
        this.message = "税率不合法;";
      } else if (this.TaxReceipt.TaxCode == "") {
        this.message = "请输入税码;";
      } else {
        isSuccess = true;
      }
      return isSuccess;
    },
    convertMoney() {
      //转换金额change事件
      if (
        this.PublicPayment.AmountInlowercase != "" &&
        !isNaN(this.PublicPayment.AmountInlowercase)
      ) {
        var result = this.getAmountInWords(
          parseFloat(this.PublicPayment.AmountInlowercase)
        );
        this.PublicPayment.CapitalizationAmount = result;
      } else {
        this.PublicPayment.CapitalizationAmount = "";
      }
    },
    getAmountInWords(n) {
      //转换金额逻辑
      var fraction = ["角", "分"];
      var digit = ["零", "壹", "贰", "叁", "肆", "伍", "陆", "柒", "捌", "玖"];
      var unit = [["元", "万", "亿"], ["", "拾", "佰", "仟"]];
      var head = n < 0 ? "欠" : "";
      n = Math.abs(n);

      var s = "";

      for (var i = 0; i < fraction.length; i++) {
        s += (
          digit[Math.floor(n * 10 * Math.pow(10, i)) % 10] + fraction[i]
        ).replace(/零./, "");
      }
      s = s || "整";
      n = Math.floor(n);

      for (var i = 0; i < unit[0].length && n > 0; i++) {
        var p = "";
        for (var j = 0; j < unit[1].length && n > 0; j++) {
          p = digit[n % 10] + unit[1][j] + p;
          n = Math.floor(n / 10);
        }
        s = p.replace(/(零.)*零$/, "").replace(/^$/, "零") + unit[0][i] + s;
      }
      return (
        head +
        s
          .replace(/(零.)*零元/, "元")
          .replace(/(零.)+/g, "零")
          .replace(/^整$/, "零元整")
      );
    },
    addTaxReceipt() {
      //新增税票的按钮校验
      if (this.TaxReceiptList.length == 30) {
        this.$message({
          message: "已有30项税票数据",
          type: "error"
        });
      } else {
        this.dialogFormVisible = true;
      }
    },
    del(index) {
      this.TaxReceiptList.splice(index, 1);
    },
    del2(index) {
      this.ExpenseAllocationList.splice(index, 1);
    },
    onEditItem(index) {
      this.TaxReceipt = this.TaxReceiptList[index];
      this.editIndex = index;
      this.dialogFormVisible = true;
    },
    onEditItem2(index) {
      this.ExpenseAllocation = this.ExpenseAllocationList[index];
      this.editIndex2 = index;
      this.dialogFormVisible2 = true;
    },
    onCancel: function() {
      this.editIndex = -1;
      this.TaxReceipt = {
        CompanyCode: "",
        InvoiceNumber: "",
        Currency: "",
        Supplier: "",
        InvoiceValue: "",
        TaxRate: "",
        TaxCode: ""
      };
      this.dialogFormVisible = false;
    },
    onCancel2: function() {
      this.editIndex2 = -1;
      this.ExpenseAllocation = {
        Title: "", //费用名称
        Number: "", //费用号码
        CostCenterNumber: "", //成本中心号码
        Money: "", //摊出/入金额
        ProjectName: "", //项目名称
        ProjectNumber: "", //项目号码
        CostCenterName: "", //摊出成本中心签批人姓名
        Abstract: "", //摘要
        IsIn: false //是否摊入
      };
      this.dialogFormVisible2 = false;
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
          this.TaxReceiptList[this.editIndex] = this.TaxReceipt;
        } else {
          //新增
          this.TaxReceiptList.push(this.TaxReceipt);
        }
        this.TaxReceipt = {
          CompanyCode: "",
          InvoiceNumber: "",
          Currency: "",
          Supplier: "",
          InvoiceValue: "",
          TaxRate: "",
          TaxCode: ""
        };
        this.dialogFormVisible = false;
      }
    },
    onAddItem2() {
      if (false) {
        //校验不通过
        this.$message({
          message: this.message,
          type: "error"
        });
      } else {
        debugger;
        if (this.editIndex2 != -1) {
          //编辑
          this.ExpenseAllocationList[this.editIndex2] = this.ExpenseAllocation;
        } else {
          //新增
          this.ExpenseAllocationList.push(this.ExpenseAllocation);
        }
        console.log(this.ExpenseAllocation);
        this.ExpenseAllocation = {
          Title: "", //费用名称
          Number: "", //费用号码
          CostCenterNumber: "", //成本中心号码
          Money: "", //摊出/入金额
          ProjectName: "", //项目名称
          ProjectNumber: "", //项目号码
          CostCenterName: "", //摊出成本中心签批人姓名
          Abstract: "", //摘要
          IsIn: false //是否摊入
        };
        this.dialogFormVisible2 = false;
        console.log(this.ExpenseAllocationList);
      }
    },
    calculateMoney() {
      //计算金额
      var itemAmount = 0.0;
      for (let index = 0; index < this.TaxReceiptList.length; index++) {
        itemAmount += parseFloat(this.TaxReceiptList[index].InvoiceValue);
      }
      var InvoiceValue = parseFloat(this.PublicPayment.InvoiceValue);
      return itemAmount == InvoiceValue;
    },
    onSaveOrSubmmit(type) {
      if (!this.formVerification()) {
        //校验不通过;
        this.$message({
          message: this.message,
          type: "error"
        });
      } else {
        this.loading = true;
        this.createPublicPayment(type);
      }
    },
    createPublicPayment(type) {
      //创建主表数据
      var total = parseFloat(this.PublicPayment.InvoiceValue);
      var costcenter = this.PublicPayment.CostCenter;
      var parm = {
        action: "ListItems",
        type: "get",
        list: this.approverList,
        baseUrl: this.hostUrl,
        condition:
          "?$filter=CostCenter eq  '" + costcenter + "' and Type eq 'GP'"
      };
      var option = common.queryOpt(parm);
      $.when($.ajax(option)).done(r => {
        if (r.d.results.length > 0) {
          var data1 = r.d.results[0];
          var itemInfo = {
            __metadata: {
              type: this.mainListType
            },
            Title: this.ApplicationNumber,
            ReimbursementType: this.PublicPayment.ReimbursementType,
            SettlementType: this.PublicPayment.SettlementType,
            CostCenter: this.PublicPayment.CostCenter,
            Currency: this.PublicPayment.Currency,
            InvoiceValue: this.PublicPayment.InvoiceValue,
            ExchangeRate: this.PublicPayment.ExchangeRate,
            CapitalizationAmount: this.PublicPayment.CapitalizationAmount,
            AmountInlowercase: this.PublicPayment.AmountInlowercase,
            LoanNumber: this.PublicPayment.LoanNumber,
            CollectionUnit: this.PublicPayment.CollectionUnit,
            OpeningBank: this.PublicPayment.OpeningBank,
            Account: this.PublicPayment.Account,
            City: this.PublicPayment.City,
            County: this.PublicPayment.County,
            DetailsOfPayment: this.PublicPayment.DetailsOfPayment,
            IsContract: this.PublicPayment.IsContract.toString(),
            ContractNumber: this.PublicPayment.ContractNumber,
            Money: this.PublicPayment.Money,
            ProjectName: this.PublicPayment.ProjectName,
            ProjectNumber: this.PublicPayment.ProjectNumber,
            ExpenseCategory: this.PublicPayment.ExpenseCategory,
            CostAccount: this.PublicPayment.CostAccount,
            CodeOfFixedAssets: this.PublicPayment.CodeOfFixedAssets,
            ApplicationNumber: this.PublicPayment.ApplicationNumber,
            ReceiptNumber: this.PublicPayment.ReceiptNumber,
            IsSettlement: this.PublicPayment.IsSettlement.toString(),
            IsFreightInvoice: this.PublicPayment.IsFreightInvoice.toString(),
            Remark: this.PublicPayment.Remark,
            SpecialApproverTitle: this.PublicPayment.SpecialApprover,
            Trustees: this.PublicPayment.Trustees
          };
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
            itemInfo.Status = "Submitted";
          }
          parm = {
            type: "post",
            action: "AddInList",
            baseUrl: this.hostUrl,
            list: this.mainListName,
            item: itemInfo,
            digest: this.requestDigest
          };
          option = common.queryOpt(parm);
          $.when($.ajax(option))
            .done(req => {
              if (this.PublicPayment.IsFreightInvoice) {
                console.log("调用新增税票清单");
              }
              this.createTaxReceipt();
              this.createExpenseAllocation();
              this.$message(common.message("success", "对公付款添加成功!"));
              this.loading = false;
              this.$router.push("/home");
            })
            .catch(err => {
              this.$message(common.message("error", "对公付款添加失败!"));
            });
        }
      });
    },
    createTaxReceipt() {
      //添加附表数据
      console.log(this.TaxReceiptList);
      this.TaxReceiptList.forEach(item => {
        console.log(item);
        var itemInfo = {
          __metadata: {
            type: this.SubInfoListType
          },
          Title: this.PublicPayment.ApplicationNumber,
          PublicPaymentGUID: this.PublicPayment.ApplicationNumber,
          CompanyCode: item.CompanyCode, //公司代码
          InvoiceNumber: item.InvoiceNumber, //发票号
          Currency: item.Currency, //币种
          Supplier: item.Supplier, //供应商
          InvoiceValue: item.InvoiceValue, //发票金额
          TaxRate: item.TaxRate, //税率
          TaxCode: item.TaxCode //税码
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
            this.$message(common.message("success", "税票清单已添加成功!"));
          })
          .catch(err => {
            this.$message(common.message("error", "税票清单添加失败!"));
          });
      });
    },
    createExpenseAllocation() {
      //添加附表数
      console.log(this.ExpenseAllocationList);
      this.ExpenseAllocationList.forEach(item => {
        console.log(item);
        var itemInfo = {
          __metadata: {
            type: this.SubInfoListType2
          },
          PublicPaymentGUID: this.PublicPayment.ApplicationNumber,
          Title: item.Title,
          Number: item.Number,
          CostCenterNumber: item.CostCenterNumber,
          Money: item.Money,
          ProjectName: item.ProjectName,
          ProjectNumber: item.ProjectNumber,
          CostCenterName: item.CostCenterName,
          Abstract: item.Abstract,
          IsIn: item.IsIn.toString()
        };
        var parm = {
          type: "post",
          action: "AddInList",
          baseUrl: this.hostUrl,
          list: this.subListName2,
          item: itemInfo,
          digest: this.requestDigest
        };
        var options = common.queryOpt(parm);
        $.when($.ajax(options))
          .done(req => {
            this.$message(common.message("success", "费用分摊已添加成功!"));
          })
          .catch(err => {
            this.$message(common.message("error", "费用分摊添加失败!"));
          });
      });
    },
    indexMethod(index) {
      return index + 1;
    },
    speApprChange: function() {
      this.loading = true;
      this.SpecApproId = 0;
      this.checkIsSpecAppro = false;
      var speApproverName = this.PublicPayment.SpecialApprover;
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
                  this.PublicPayment.SpecialApprover = "";
                  this.$message(
                    common.message(
                      "error",
                      "通过员工列表EmployeeID加载特殊审批用户出错!"
                    )
                  );
                });
            } else {
              this.loading = false;
              this.PublicPayment.SpecialApprover = "";
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
          this.PublicPayment.Trustees = c.d.Title;
          this.search(loginName);
        })
        .catch(err => {
          this.$message(common.message("error", "加载当前用户出错!"));
        });
    },
    getGPPRNumber() {
      var that = this;
      //获取申请单号
      var parm = {
        action: "ListItems",
        type: "get",
        list: this.GpPRListName,
        baseUrl: this.hostUrl,
        condition: "?$filter= Status eq 'Approved'"
      }; //Completed 已完成
      var option = common.queryOpt(parm);
      $.when($.ajax(option))
        .done(req => {
          var data = req.d.results;
          if (data.length > 0) {
            data.forEach(item => {
              that.ReceiptNumbers.push({
                label: item.ApplicationNumber,
                value: item.ApplicationNumber,
                contractNumber: item.ContractNumber
              });
            });
          } else {
            this.$message(common.message("error", "没有可选的单据！"));
          }
        })
        .catch(err => {
          this.$message(common.message("error", "获取单号编号失败!"));
        });
    },
    isHaveContract() {
      //获取合同
      var that = this;
      that.ContractList = []; //还原
      this.ReceiptNumbers.forEach(item => {
        if (item.value == that.PublicPayment.ReceiptNumber) {
          var number = item.contractNumber;
          console.log(number);
          //没有合同号
          if (number == null || number == "") {
            that.disabledContract = 0;
            that.PublicPayment.IsContract = false;
            that.PublicPayment.ContractNumber = "";
            that.PublicPayment.Money = "";
            that.AccountPaid = "";
            that.UnPaid = "";
          } else {
            that.PublicPayment.ContractNumber = number;
            that.changeMoney();

            that.disabledContract = 1;
          }
        }
      });
    },
    //获取合同号
    getContractNumber() {
      var that = this;
      var parm = {
        action: "ListItems",
        type: "get",
        list: this.ContractListName,
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
      var that = this;
      that.ContractList = []; //还原
      //获取合同列表
      var parm = {
        action: "ListItems",
        type: "get",
        list: this.ContractListName,
        baseUrl: this.hostUrl,
        condition:
          "?$filter=Number eq '" + this.PublicPayment.ContractNumber + "' "
      }; //Completed 已完成
      var option = common.queryOpt(parm);
      $.when($.ajax(option))
        .done(req => {
          var data = req.d.results;
          if (data.length > 0) {
            var accountPaid = 0;
            data.forEach(item => {
              //push 合同列表
              that.ContractList.push({
                Name: item.Name,
                Supplier: item.Suppler,
                Contents: item.Contents,
                LegalPerson: item.LegalPerson,
                Money: item.Money,
                AccountPaid: item.AccountPaid,
                UnPaid: item.UnPaid
              });
              //累加
              accountPaid += parseFloat(item.AccountPaid);
            });
            //合计
            that.AccountPaid = accountPaid;
            that.UnPaid = parseFloat(that.ContractList[0].Money) - accountPaid;
            that.PublicPayment.Money = that.ContractList[0].Money;
            that.PublicPayment.IsContract = true;
            //that.PublicPayment.ContractNumber = number;
          }
        })
        .catch(err => {
          this.$message(common.message("error", "获取申请单号失败!"));
        });
    }
  },
  mounted: function() {
    //onload
    this.loading = true;
    this.PublicPayment.ApplicationNumber = common.generateUUID();
    this.requestDigest = common.getRequestDigest();
    this.getCostCenter();
    this.getExpenseCategory();
    this.getCostAccount();
    this.getCurrentUser();
    this.getContractNumber();
    this.getGPPRNumber();
    this.loading = false;
  },
  components: {}
};
</script>

<style>
.duigong {
  min-height: 25px;
  line-height: 25px;
  text-align: center;

  color: gray;
  padding: 2px;
}
.duigong tr td {
  border: 1px solid #cfcfcf;
  padding: 5px;
}
.duigong tr:nth-child(15) {
  background-color: #409eff;
  font-weight: bold;
  color: white;
  border: 0px;
}
</style>