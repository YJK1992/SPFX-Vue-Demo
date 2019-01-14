<template>
  <div>
    <table class="view_duigong" style="  border-collapse: collapse;">
      <tr>
        <td colspan="8">
          <span style="font-size:30px;color:#409eff;">对公付款</span>
          <div style="float:right">
            <el-button :disabled="!IsDisable" type="primary" @click="printDeal">打印</el-button>
          </div>
        </td>
      </tr>
      <tr>
        <td align="right">申请单号：</td>
        <td colspan="2">
          <el-input disabled v-model="PublicPayment.ApplicationNumber" placeholder="申请单号"></el-input>
        </td>
        <td align="right">联系电话：</td>
        <td colspan="3">
          <el-input disabled v-model="PublicPayment.PhoneNumber" placeholder="联系电话"></el-input>
        </td>
      </tr>
      <tr>
        <td align="right">单据编号：</td>
        <td align="left">
          <el-select disabled v-model="PublicPayment.ReceiptNumber" filterable placeholder="请选择"></el-select>
        </td>
        <td align="right">报销类型：</td>
        <td align="left">
          <el-select v-model="PublicPayment.ReimbursementType" placeholder="请选择" disabled>
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
          <el-select disabled v-model="PublicPayment.SettlementType" placeholder="请选择"></el-select>
        </td>
      </tr>
      <tr>
        <td align="right">经办人：</td>
        <td>
          <el-input disabled v-model="PublicPayment.Trustees" placeholder="经办人"></el-input>
        </td>
        <td align="right">成本中心：</td>
        <td align="left">
          <el-select disabled v-model="PublicPayment.CostCenter" placeholder="请选择" size="medium"></el-select>
        </td>
        <td align="right">公司代码 ：</td>
        <td align="left" colspan="2">
          <el-select disabled v-model="PublicPayment.CompanyCode" placeholder="请选择" size="medium"></el-select>
        </td>
      </tr>
      <tr>
        <td align="right">发票金额：</td>
        <td>
          <el-input disabled v-model="PublicPayment.InvoiceValue" placeholder="发票金额"></el-input>
        </td>
        <td align="right">币种：</td>
        <td colspan="4" align="left">
          <el-select disabled v-model="PublicPayment.Currency" placeholder="请选择"></el-select>
        </td>
      </tr>
      <tr>

        <td align="right">金额(大写)：</td>
        <td colspan="8">
          <el-input v-model="PublicPayment.CapitalizationAmount" disabled placeholder="大写金额"></el-input>
        </td>
      </tr>
      <tr>
        <td colspan="3" style="color:#409eff">此项报销有借款时必须要填写借款单号</td>
        <td align="right">借款单号：</td>
        <td colspan="4">
          <el-input disabled v-model="PublicPayment.LoanNumber" placeholder="借款单号"></el-input>
        </td>
      </tr>
      <tr>
        <td colspan="8" align="center" style="color:#409eff">结算方式为“汇款”或“支票”时填写</td>
      </tr>
      <tr>
        <td align="right">收款单位名称：</td>
        <td colspan="7">
          <el-input disabled v-model="PublicPayment.CollectionUnit" placeholder="收款单位名称"></el-input>
        </td>
      </tr>
      <tr>
        <td rowspan="3" style="writing-mode:lr-tb">汇款、汇票时填写</td>
        <td align="right">开户行：</td>
        <td colspan="3">
          <el-input disabled v-model="PublicPayment.OpeningBank" placeholder="开户行"></el-input>
        </td>
        <td align="right">账号：</td>
        <td colspan="2">
          <el-input disabled v-model="PublicPayment.Account" placeholder="账号"></el-input>
        </td>
      </tr>
      <tr>
        <td align="right">省/直辖市：</td>
        <td colspan="3">
          <el-input disabled v-model="PublicPayment.City" placeholder="省/直辖市"></el-input>
        </td>
        <td align="right">市/县：</td>
        <td colspan="2">
          <el-input disabled v-model="PublicPayment.County" placeholder="市/县"></el-input>
        </td>
      </tr>
      <tr>
        <td align="right">汇款附言：</td>
        <td colspan="6">
          <el-input disabled v-model="PublicPayment.DetailsOfPayment" placeholder="省/直辖市"></el-input>
        </td>
      </tr>
      <tr>
        <td align="right">是否有合同：</td>
        <td colspan="7" align="left">
          <el-checkbox disabled v-model="PublicPayment.IsContract"></el-checkbox>
        </td>
      </tr>
      <tr>
        <td align="right">合同号：</td>
        <td colspan="2" align="left">
          <el-select disabled v-model="PublicPayment.ContractNumber" filterable placeholder="请选择"></el-select>
        </td>
        <td align="right">金额：</td>
        <td colspan="4">
          <el-input disabled v-model="PublicPayment.Money" placeholder="金额"></el-input>
        </td>
      </tr>
      <tr id="viewPart">
        <td style="width:200px">合同名称</td>
        <td style="width:270px">供应商</td>
        <td style="width:200px">内容</td>
        <td>法人代表</td>
        <td style="width:170px">币种</td>
        <td style="width:170px">总金额</td>
        <td style="width:170px">已付款</td>
      </tr>
      <tr v-for="(subItems,index) in  ContractList">
        <template v-for="(subItem,cindex) in subItems">
          <td v-if="cindex =='AccountPaid'" colspan="2">{{subItem}}</td>
          <td v-else>{{subItem}}</td>
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
          <el-input disabled v-model="PublicPayment.ProjectName" placeholder="合同号"></el-input>
        </td>
        <td align="right">项目编号：</td>
        <td colspan="3">
          <el-input disabled v-model="PublicPayment.ProjectNumber" placeholder="项目编号"></el-input>
        </td>
      </tr>
      <tr>
        <td align="right">增值税/运费专用发票</td>
        <td align="left">
          <el-checkbox disabled v-model="PublicPayment.IsFreightInvoice"></el-checkbox>
        </td>
        <td colspan="5" align="left">
          <el-button type="primary" @click="dialogTableVisible = true">税票清单</el-button>
        </td>
      </tr>
      <tr>
        <td align="right">费用分摊</td>
        <td align="left">
          <el-checkbox disabled v-model="PublicPayment.IsExpenseAllocation"></el-checkbox>
        </td>
        <td colspan="5" align="left">
          <el-button type="primary" @click="dialogTableVisible2 = true">费用分摊清单</el-button>
        </td>
      </tr>
      <tr>
        <td align="right">备注：</td>
        <td colspan="7">
          <el-input disabled v-model="PublicPayment.Remark" placeholder="备注"></el-input>
        </td>
      </tr>
      <tr>
        <td align="right">费用类别：</td>
        <td align="left">
          <el-select disabled v-model="PublicPayment.ExpenseCategory" placeholder="请选择"></el-select>
        </td>
        <td align="right">费用科目:</td>
        <td colspan="5" align="left">
          <el-select disabled v-model="PublicPayment.CostAccount" placeholder="请选择"></el-select>
        </td>
      </tr>

      <tr>
        <td align="right">固定资产编码：</td>
        <td colspan="7">
          <el-input disabled v-model="PublicPayment.CodeOfFixedAssets" placeholder="固定资产编码"></el-input>
        </td>
      </tr>
      <tr>
        <td align="right">特殊审批人：</td>
        <td colspan="7">
          <el-input v-model="PublicPayment.SpecialApprover" placeholder="特殊审批人" disabled></el-input>
        </td>
      </tr>

      <!-- <tr>
        <td align="right">结算：</td>
        <td colspan="7" align="left">
          <el-checkbox display v-model="PublicPayment.IsSettlement"></el-checkbox>
        </td>
      </tr>-->
    </table>

    <!-- 税票清单列表 -->
    <el-dialog show-summary title="税票清单" stripe :visible.sync="dialogTableVisible">
      <el-table :data="TaxReceiptList">
        <el-table-column property="CompanyCode" label="公司代码" width="100"></el-table-column>
        <el-table-column property="InvoiceNumber" label="发票号" width="150"></el-table-column>
        <el-table-column property="Currency" label="币种"></el-table-column>
        <el-table-column property="Supplier" label="供应商"></el-table-column>
        <el-table-column property="InvoiceValue" label="发票金额"></el-table-column>
        <el-table-column property="TaxRate" label="税率"></el-table-column>
        <el-table-column property="TaxCode" label="税码"></el-table-column>
        <el-table-column property="CodeOfFixedAssets" label="固定资产编码"></el-table-column>
        <el-table-column property="Amount" label="数量"></el-table-column>
      </el-table>
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
        </tr>
        <template>
          <tr v-for="(subItems,index) in  ExpenseAllocationList">
            <template v-if="!ExpenseAllocationList[index].IsIn">
              <template v-for="(subItem,cindex) in subItems">
                <td v-if="cindex!='IsIn'">{{subItem}}</td>
              </template>
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
        </tr>
        <template>
          <tr v-for="(subItems,index) in  ExpenseAllocationList">
            <template v-if="ExpenseAllocationList[index].IsIn">
              <template v-for="(subItem,cindex) in subItems">
                <td v-if="cindex!='IsIn'">{{subItem}}</td>
              </template>
            </template>
          </tr>
        </template>
      </table>
    </el-dialog>

    <!-- 打印模板 -->
    <!-- 打印模板 -->
    <div style="display:none" id="printBox">
      <div style="margin-top:20px;" id="myPrintArea">
        <!--startprint1-->
        <table
          style=" width:100%; min-height:25px; line-height: 25px;text-align: left;  border-collapse: collapse;  color: gray;  padding: 2px;"
        >
          <tr>
            <td
              style=" border: 1px solid #cfcfcf; padding: 5px; font-weight: bold;font-size: 20px; color: #405ca1; text-align: center;"
              colspan="4"
            >联想（北京）有限公司（0 0 0 1）</td>
          </tr>
          <tr>
            <td
              style=" border: 1px solid #cfcfcf; padding: 5px;font-weight: bold;font-size: 20px; color: #405ca1; text-align: center;"
              colspan="4"
            >{{this.PublicPayment.ReimbursementType}}</td>
          </tr>
          <tr :hidden="ExpenseAllocationList.length==0">
            <td
              style=" border: 1px solid #cfcfcf; padding: 5px;font-weight: bold;"
              colspan="4"
            >是否含分摊：{{this.PublicPayment.IsExpenseAllocation?'是':'否'}}</td>
          </tr>
          <tr>
            <td
              style=" border: 1px solid #cfcfcf; padding: 5px;background-color: #b2e6fc; font-weight: bold;"
            >单据编号:</td>
            <td
              style=" border: 1px solid #cfcfcf; padding: 5px;background-color: #b2e6fc; font-weight: bold;"
            >经办人:</td>
            <td
              style=" border: 1px solid #cfcfcf; padding: 5px;background-color: #b2e6fc; font-weight: bold;"
            >联系电话:</td>
            <td
              style=" border: 1px solid #cfcfcf; padding: 5px;background-color: #b2e6fc; font-weight: bold;"
            >单据提交时间:</td>
          </tr>
          <tr>
            <td
              style=" border: 1px solid #cfcfcf; padding: 5px;"
            >{{this.PublicPayment.ApplicationNumber}}</td>
            <td style=" border: 1px solid #cfcfcf; padding: 5px;">{{this.PublicPayment.Trustees}}</td>
            <td style=" border: 1px solid #cfcfcf; padding: 5px;">{{this.PublicPayment.PhoneNumber}}</td>
            <td style=" border: 1px solid #cfcfcf; padding: 5px;">{{this.PublicPayment.Created}}</td>
          </tr>
          <tr>
            <td
              colspan="4"
              style=" border: 1px solid #cfcfcf; padding: 5px;"
            >公司名称：联想（北京）有限公司（0 0 0 1）</td>
          </tr>
          <tr>
            <td
              style=" border: 1px solid #cfcfcf; padding: 5px;"
              colspan="2"
            >成本中心：{{this.PublicPayment.CostCenter}}</td>
            <td
              style=" border: 1px solid #cfcfcf; padding: 5px;"
              colspan="2"
            >结算方式：{{this.PublicPayment.SettlementType}}</td>
          </tr>
          <tr>
            <td
              style=" border: 1px solid #cfcfcf; padding: 5px;"
              colspan="2"
            >发票金额：{{this.PublicPayment.InvoiceValue}}</td>
            <td
              style=" border: 1px solid #cfcfcf; padding: 5px;"
              colspan="2"
            >借款单号：{{this.PublicPayment.LoanNumber}}</td>
          </tr>
          <tr>
            <td
              style=" border: 1px solid #cfcfcf; padding: 5px;"
              colspan="4"
            >币种：{{this.PublicPayment.Currency}}</td>
            <!-- <td
              style=" border: 1px solid #cfcfcf; padding: 5px;"
              colspan="2"
            >汇率：{{this.PublicPayment.ExchangeRate}}</td> -->
          </tr>
          <tr>
            <!-- <td
              style=" border: 1px solid #cfcfcf; padding: 5px;"
              colspan="2"
            >金额（小写）:{{this.PublicPayment.AmountInlowercase}}</td> -->
            <td
              style=" border: 1px solid #cfcfcf; padding: 5px;"
              colspan="4"
            >金额（大写）:{{this.PublicPayment. CapitalizationAmount}}</td>
          </tr>
          <tr>
            <td style=" border: 1px solid #cfcfcf; padding: 5px;" colspan="2">借款金额：</td>
            <td style=" border: 1px solid #cfcfcf; padding: 5px;" colspan="2">差额：</td>
          </tr>
          <tr>
            <td
              style=" border: 1px solid #cfcfcf; padding: 5px;"
              colspan="2"
            >收款单位名称：{{this.PublicPayment.CollectionUnit}}</td>
            <td
              style=" border: 1px solid #cfcfcf; padding: 5px;"
              colspan="2"
            >省/直辖市：{{this.PublicPayment.City}}</td>
          </tr>
          <tr>
            <td
              style=" border: 1px solid #cfcfcf; padding: 5px;"
              colspan="2"
            >市/县：{{this.PublicPayment.County}}</td>
            <td
              style=" border: 1px solid #cfcfcf; padding: 5px;"
              colspan="2"
            >开户行：{{this.PublicPayment.OpeningBank}}</td>
          </tr>
          <tr>
            <td
              style=" border: 1px solid #cfcfcf; padding: 5px;"
              colspan="2"
            >账号：{{this.PublicPayment.Account}}</td>
            <td
              style=" border: 1px solid #cfcfcf; padding: 5px;"
              colspan="2"
            >汇款附言：{{this.PublicPayment.DetailsOfPayment}}</td>
          </tr>
          <tr>
            <td
              style=" border: 1px solid #cfcfcf; padding: 5px;"
              colspan="2"
            >项目名称：{{this.PublicPayment.ProjectName}}</td>
            <td
              style=" border: 1px solid #cfcfcf; padding: 5px;"
              colspan="2"
            >项目编码：{{this.PublicPayment.ProjectNumber}}</td>
          </tr>
          <tr>
            <td style=" border: 1px solid #cfcfcf; padding: 5px;" colspan="2">
              合同编号：
              <span style="color: aqua">{{this.PublicPayment.ContractNumber}}</span>
            </td>
            <td
              style=" border: 1px solid #cfcfcf; padding: 5px;"
              colspan="2"
            >合同币种：{{this.PublicPayment.Currency}}</td>
          </tr>
          <tr>
            <td
              style="border: 1px solid #cfcfcf; padding: 5px;"
              colspan="4"
            >合同总金额：{{this.PublicPayment.Money}}</td>
          </tr>
          <tr>
            <td
              colspan="4"
              style=" border: 1px solid #cfcfcf; padding: 5px;"
            >签批人/签批时间：{{this.PublicPayment.AuthorizedPersonITCode+" / "+ this.PublicPayment.SettlingTime}}</td>
          </tr>
          <tr>
            <td
              style=" border: 1px solid #cfcfcf; padding: 5px;"
              colspan="4"
            >备注：{{this.PublicPayment.Remark}}</td>
          </tr>
          <tr v-if="PublicPayment.AuthorizedPersonITCode!=null">
            <td
              style=" border: 1px solid #cfcfcf; padding: 5px; font-weight: bold;  font-size: 14px;background-color: #cfcfcf;"
              colspan="4"
            >Approver/Approved Time: {{this.Approver}}</td>
          </tr>
          <!-- <tr>
            <td
              style=" border: 1px solid #cfcfcf; padding: 5px;"
              colspan="2"
            >Total amount:{{this.PublicPayment.Money}}</td>
            <td
              style=" border: 1px solid #cfcfcf; padding: 5px;"
              colspan="2"
            >Percentage of Finished and Paid Amount:{{this.AccountPaid==""?0:this.AccountPaid}}</td>
          </tr>

          <tr>
            <td
              style=" border: 1px solid #cfcfcf; padding: 5px; font-weight: bold;  font-size: 14px;background-color: #cfcfcf;"
              colspan="4"
            >Approver/Approved Time: {{this.Approver}}</td>
          </tr>
          <tr>
            <td
              style=" border: 1px solid #cfcfcf; padding: 5px;font-weight: bold;  font-size: 14px;background-color: #cfcfcf;"
              colspan="4"
            >Notes(Usage/Others) Time:{{this.PublicPayment.Remark}}</td>
          </tr>-->
        </table>
        <div :hidden="ExpenseAllocationList.length==0" style="margin-top:10px">
          <table
            style="width:100%; min-height:25px; line-height: 25px;text-align: left;  border-collapse: collapse;  color: gray;  padding: 2px;"
          >
            <tr>
              <td style=" border: 1px solid #cfcfcf; padding: 5px;">费用科目号</td>
              <td style=" border: 1px solid #cfcfcf; padding: 5px;">费用名称</td>
              <td style=" border: 1px solid #cfcfcf; padding: 5px;">摊出成本中心编号</td>
              <td style=" border: 1px solid #cfcfcf; padding: 5px;">摊出金额</td>
              <td style=" border: 1px solid #cfcfcf; padding: 5px;">项目名称</td>
              <td style=" border: 1px solid #cfcfcf; padding: 5px;">项目编号.</td>
              <td style=" border: 1px solid #cfcfcf; padding: 5px;">摊出成本中心签批人姓名</td>
              <td style=" border: 1px solid #cfcfcf; padding: 5px;">摘要</td>
            </tr>

            <template>
              <tr v-for="(subItems,index) in  ExpenseAllocationList">
                <template v-if="!ExpenseAllocationList[index].IsIn">
                  <template v-for="(subItem,cindex) in subItems">
                    <td
                      style=" border: 1px solid #cfcfcf; padding: 5px;"
                      v-if="cindex!='IsIn'"
                    >{{subItem}}</td>
                  </template>
                </template>
              </tr>
            </template>

            <tr>
              <td style=" border: 1px solid #cfcfcf; padding: 5px;">费用科目号</td>
              <td style=" border: 1px solid #cfcfcf; padding: 5px;">费用名称</td>
              <td style=" border: 1px solid #cfcfcf; padding: 5px;">摊入成本中心编号/td></td>
              <td style=" border: 1px solid #cfcfcf; padding: 5px;">摊入金额</td>
              <td style=" border: 1px solid #cfcfcf; padding: 5px;">项目名称</td>
              <td style=" border: 1px solid #cfcfcf; padding: 5px;">项目编号</td>
              <td style=" border: 1px solid #cfcfcf; padding: 5px;">摊入成本中心签批人姓名</td>
              <td style=" border: 1px solid #cfcfcf; padding: 5px;">摘要</td>
            </tr>

            <template>
              <tr v-for="(subItems,index) in  ExpenseAllocationList">
                <template v-if="ExpenseAllocationList[index].IsIn">
                  <template v-for="(subItem,cindex) in subItems">
                    <td
                      style=" border: 1px solid #cfcfcf; padding: 5px;"
                      v-if="cindex!='IsIn'"
                    >{{subItem}}</td>
                  </template>
                </template>
              </tr>
            </template>
          </table>
        </div>
        <div v-if="PublicPayment.AuthorizedPersonITCode!=null">
          <template v-for="(item,index) in ApproverArr">
            <p>
              {{item.substring(0,item.indexOf(','))}} Manager-Senior Manager
              <span
                style="color:red"
              >（手动输入）</span>
            </p>
          </template>
        </div>
      </div>
    </div>
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
      subListName2: "ExpenseAllocation",
      ContractListName: "ContractList", //合同列表pushtable
      ContractList: [], //合同列表
      dialogTableVisible: false, //税票清单列表
      dialogTableVisible2: false, //费用分摊列表
      ExpenseAllocationList: [], //费用分摊列表
      TaxReceiptList: [], //税票清单
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
        SpecialApprover: "", //特殊审批人
        IsExpenseAllocation: false, //是否有费用分摊
        CompanyCode: "", //公司代码
        EmployeeCode: "", //人员编号
        Created: "",
        SettlingTime: "",
        AuthorizedPersonITCode: "",
        PhoneNumber: ""
      }, //主表
      AccountPaid: "", //合同列表已支付金额
      UnPaid: "", //合同列表未支付金额
      ApprovalHistory: "", //审批历史
      Approver: "",
      ApproverArr: [],
      IsDisable: false
    };
  },
  methods: {
    printDeal() {
      var printBox = document.getElementById("printBox");
      //拿到打印的区域的html内容
      var newContent = printBox.innerHTML;
      //将旧的页面储存起来，当打印完成后返给给页面。
      var oldContent = document.body.innerHTML;
      //赋值给body
      document.body.innerHTML = newContent;
      //执行window.print打印功能
      window.print();
      // 重新加载页面，以刷新数据。以防打印完之后，页面不能操作的问题
      window.location.reload();
      document.body.innerHTML = oldContent;
      return false;
    },
    print() {
      common.print("#myPrintArea");
    },
    changeMoney() {
      var that = this;
      that.ContractList = []; //还原
      that.AccountPaid = ""; //还原
      that.UnPaid = ""; //还原
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
            var data = req.d.results;
            console.log("changeMoney");
            console.log(data);
            if (data.length > 0) {
              //这里肯定会找到合同的
              this.GetPublicPaymentHistory(data);
            }
          }
        })
        .catch(err => {
          this.$message(common.message("error", "获取申请单号失败!"));
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
    loadExpenseAllocationData: function(guid) {
      var parm = {
        type: "get",
        action: "ListItems",
        list: this.subListName2,
        baseUrl: this.hostUrl,
        condition: "?$filter=PublicPaymentGUID  eq '" + guid + "'"
      };
      var opt = common.queryOpt(parm);
      return common.service(opt);
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
    Loadhistory() {
      if (this.ApprovalHistory != "" && this.ApprovalHistory != null) {
        console.log(1);
        var history = JSON.parse(this.ApprovalHistory);
        var historyString = "";
        var historyKV = Object.keys(history);

        historyKV.forEach(element => {
          historyString += " " + history[element].replace(",", "/") + "，";
        });
        console.log(historyString);
        this.Approver = historyString;
        this.ApproverArr = history;
      }
    },
    GetPublicPaymentHistory(mainItem) {
      console.log("GetPublicPaymentHistory");
      console.log(mainItem);
      var that = this;
      that.PublicPayment.Money = mainItem[0].Money;
      var parm = {
        action: "ListItems",
        type: "get",
        list: this.mainListName,
        baseUrl: this.hostUrl,
        condition:
          "?$filter=ContractNumber eq '" +
          this.PublicPayment.ContractNumber +
          "' and Status eq 'Approved'"
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
              that.ContractList.push({
                Name: mainItem[0].Name,
                Supplier: mainItem[0].Supplier,
                Contents: mainItem[0].Contents,
                LegalPerson: mainItem[0].LegalPerson,
                Currency: mainItem[0].Currency,
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

            that.PublicPayment.IsContract = true;
          }
        })
        .catch(err => {
          this.$message(common.message("error", "获取申请单号失败!"));
        });
    }
  },
  mounted: function() {
    var applicantNumber = common.GetParameterValues("ApplicantNumber");
    var getMainListData = this.loadMainListData(applicantNumber);
    var getExpenseAllocationData = this.loadExpenseAllocationData(
      applicantNumber
    );
    getMainListData
      .done(req => {
        var data = req.d.results;
        console.log("!1111111111");
        console.log(data);
        if (data.length > 0) {
          //获取主表
          (this.IsDisable =
            data[0].PaymentApproval["Description"] == "Approver5" ||
            data[0].PaymentApproval["Description"] == "Approver6" ||
            (data[0].PaymentApproval["Description"] == "End" &&
              data[0].Status == "Approved")),
            (this.ApprovalHistory = data[0].ApproverHistory),
            (this.PublicPayment.AuthorizedPersonITCode =
              data[0].AuthorizedPersonITCode),
            (this.PublicPayment.PhoneNumber = data[0].PhoneNumber),
            (this.PublicPayment.SettlingTime = data[0].SettlingTime.split(
              "T"
            )[0]),
            (this.PublicPayment.ReimbursementType = data[0].ReimbursementType), //报销类型
            (this.PublicPayment.SettlementType = data[0].SettlementType), //结算方式
            (this.PublicPayment.Trustees = data[0].Trustees), //经办人
            (this.PublicPayment.CostCenter = data[0].CostCenter), //成本中心
            (this.PublicPayment.Currency = data[0].Currency), //币种
            (this.PublicPayment.InvoiceValue = data[0].InvoiceValue), //发票金额
            (this.PublicPayment.ExchangeRate = data[0].ExchangeRate), //汇率
            (this.PublicPayment.AmountInlowercase = data[0].AmountInlowercase), //金额小写
            (this.PublicPayment.CapitalizationAmount =
              data[0].CapitalizationAmount), //金额大写
            (this.PublicPayment.LoanNumber =
              data[0].LoanNumber == null ? "" : data[0].LoanNumber), //借款单号
            (this.PublicPayment.CollectionUnit =
              data[0].CollectionUnit == null ? "" : data[0].CollectionUnit), //收款单位名称
            (this.PublicPayment.OpeningBank =
              data[0].OpeningBank == null ? "" : data[0].OpeningBank), //开户行
            (this.PublicPayment.Account =
              data[0].Account == null ? "" : data[0].Account), //账号
            (this.PublicPayment.City =
              data[0].City == null ? "" : data[0].City), //省市
            (this.PublicPayment.County =
              data[0].County == null ? "" : data[0].County), //市县
            (this.PublicPayment.DetailsOfPayment =
              data[0].DetailsOfPayment == null ? "" : data[0].DetailsOfPayment), //汇款附言
            (this.PublicPayment.IsContract =
              data[0].IsContract == "true" ? true : false), //是否有合同
            (this.PublicPayment.ContractNumber =
              data[0].ContractNumber == null ? "" : data[0].ContractNumber), //合同号
            (this.PublicPayment.Money =
              data[0].Money == null ? "" : data[0].Money), //金额
            (this.PublicPayment.ProjectName =
              data[0].ProjectName == null ? "" : data[0].ProjectName), //项目名称
            (this.PublicPayment.ProjectNumber =
              data[0].ProjectNumber == null ? "" : data[0].ProjectNumber), //项目编号
            (this.PublicPayment.IsFreightInvoice =
              data[0].IsFreightInvoice == "true" ? true : false), //运费发票
            (this.PublicPayment.Remark =
              data[0].Remark == null ? "" : data[0].Remark), //备注
            (this.PublicPayment.ExpenseCategory =
              data[0].ExpenseCategory == null ? "" : data[0].ExpenseCategory), //费用类别
            (this.PublicPayment.CostAccount =
              data[0].CostAccount == null ? "" : data[0].CostAccount), //费用科目
            (this.PublicPayment.CodeOfFixedAssets = data[0].CodeOfFixedAssets), //固定资产编码
            (this.PublicPayment.ApplicationNumber = data[0].ApplicationNumber), //申请单号
            (this.PublicPayment.ReceiptNumber = data[0].ReceiptNumber), //单据编号
            (this.PublicPayment.IsSettlement =
              data[0].IsSettlement == "true" ? true : false), //结算
            (this.PublicPayment.SpecialApprover = data[0].SpecialApprover); //特殊审批人
          this.PublicPayment.IsExpenseAllocation =
            data[0].IsExpenseAllocation == "true" ? true : false; //是否有费用分摊
          this.PublicPayment.CompanyCode = data[0].CompanyCode; //是否有费用分摊
          this.currentItemId = data[0].Id;
          this.PublicPayment.Created = data[0].Created.substring(
            0,
            data[0].Created.indexOf("T")
          );
          this.PublicPayment.AuthorizedPersonITCode =
            data[0].AuthorizedPersonITCode;
          console.log("!22222222222222");
          console.log(this.IsDisable);
          console.log(this.PublicPayment);
          console.log("解析税票子表");
          var subItems =
            data[0].TaxFileJsonString == "{}"
              ? { d: [] }
              : JSON.parse(data[0].TaxFileJsonString);

          if (subItems.d.length > 0) {
            subItems.d.forEach(element => {
              this.TaxReceiptList.push({
                CompanyCode: element.CompanyCode,
                InvoiceNumber: element.InvoiceNumber, //发票号
                Currency: element.Currency, //币种
                Supplier: element.Supplier, //供应商
                InvoiceValue: element.InvoiceValue, //发票金额
                TaxRate: element.TaxRate, //税率
                TaxCode: element.TaxCode, //税码
                CodeOfFixedAssets: element.CodeOfFixedAssets, //固定资产编码
                Amount: element.Amount //固定资产编码
              });
            });
          }
          console.log("解析费用分摊");
          var subExpenseItems =
            data[0].ExpenseFileJsonString == "{}"
              ? {
                  d2: [],
                  d1: []
                }
              : JSON.parse(data[0].ExpenseFileJsonString);
          console.log("加载摊入");
          if (subExpenseItems.d2.length > 0) {
            subExpenseItems.d2.forEach(element => {
              this.ExpenseAllocationList.push({
                Title: element.Title, //费用名称
                Number: element.Number, //费用号码
                CostCenterNumber: element.CostCenterNumber, //成本中心号码
                Money: element.Money, //摊出/入金额
                ProjectName: element.ProjectName, //项目名称
                ProjectNumber: element.ProjectNumber, //项目号码
                CostCenterName: element.CostCenterName, //摊出成本中心签批人姓名
                Abstract: element.Abstract, //摘要
                IsIn: element.IsIn
              });
            });
          }
          console.log("加载摊出");
          if (subExpenseItems.d1.length > 0) {
            subExpenseItems.d1.forEach(element => {
              this.ExpenseAllocationList.push({
                Title: element.Title, //费用名称
                Number: element.Number, //费用号码
                CostCenterNumber: element.CostCenterNumber, //成本中心号码
                Money: element.Money, //摊出/入金额
                ProjectName: element.ProjectName, //项目名称
                ProjectNumber: element.ProjectNumber, //项目号码
                CostCenterName: element.CostCenterName, //摊出成本中心签批人姓名
                Abstract: element.Abstract, //摘要
                IsIn: element.IsIn
              });
            });
          }
          this.Loadhistory();
          this.changeMoney();
        } else {
          this.$message(
            common.message("error", "对公付款列表中不存在该申请单号")
          );
        }
      })
      .catch(err => {
        this.$message(common.message("error", "加载对公付款列表数据失败"));
      });

    this.loading = false;
    this.convertMoney();
  }
};
</script>

<style>
.view_duigong {
  min-height: 25px;
  line-height: 25px;
  text-align: center;

  color: gray;
  padding: 2px;
}
.view_duigong tr td {
  border: 1px solid #cfcfcf;
  padding: 5px;
}
#viewPart {
  background-color: #409eff;
  font-weight: bold;
  color: white;
  border: 0px;
}
</style>
