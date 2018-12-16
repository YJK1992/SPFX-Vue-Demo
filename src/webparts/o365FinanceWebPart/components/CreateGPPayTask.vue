<template>
  <div>
    <table class="duigong" style="  border-collapse: collapse;">
      <tr>
        <td colspan="8">
          <span style="font-size:30px;color:#409eff;">对公付款模板</span>
        </td>
      </tr>
      <tr>
        <td align="right">报销类型：</td>
        <td colspan="7" align="left">
          <el-select v-model="formData.bxlx" placeholder="请选择">
            <el-option
              v-for="item in bxlx"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </td>
      </tr>
      <tr>
        <td align="right">结算方式：</td>
        <td>
          <el-select v-model="formData.jsfs" placeholder="请选择">
            <el-option
              v-for="item in jsfs"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </td>
        <td align="right">经办人：</td>
        <td>
          <el-input v-model="formData.jbr" placeholder="经办人">
            <el-button @click="serach()" slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </td>
        <td align="right">成本中心：</td>
        <td colspan="2" align="left">
          <el-select v-model="formData.cbzx" placeholder="请选择" size="medium">
            <!-- <el-option
               v-for="item in costCenterArr"
              :key="item.CostCenter"
              :label="item.CostCenter"
              :value="item.CostCenter">
            </el-option>-->
          </el-select>
        </td>
      </tr>
      <tr>
        <td align="right">发票金额：</td>
        <td>
          <el-input v-model="formData.fpje" placeholder="发票金额"></el-input>
        </td>
        <td align="right">币种：</td>
        <td align="left">
          <el-select v-model="formData.bz" placeholder="请选择">
            <el-option v-for="item in bz" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </td>
        <td align="right">汇率：</td>
        <td colspan="2">
          <el-input v-model="formData.hl" placeholder="汇率"></el-input>
        </td>
      </tr>
      <tr>
        <td align="right">金额(小写)：</td>
        <td>
          <el-input v-model="formData.jexx" @change="convertMoney" placeholder="小写金额"></el-input>
        </td>
        <td align="right">金额(大写)：</td>
        <td colspan="6">
          <el-input v-model="formData.jedx" disabled placeholder="大写金额"></el-input>
        </td>
      </tr>
      <tr>
        <td colspan="3" style="color:#409eff">此项报销有借款时必须要填写借款单号</td>
        <td align="right">借款单号：</td>
        <td colspan="4">
          <el-input v-model="formData.jkdh" placeholder="借款单号"></el-input>
        </td>
      </tr>
      <tr>
        <td colspan="8" align="center" style="color:#409eff">结算方式为“汇款”或“支票”时填写</td>
      </tr>
      <tr>
        <td align="right">收款单位名称：</td>
        <td colspan="7">
          <el-input v-model="formData.skdw" placeholder="收款单位名称"></el-input>
        </td>
      </tr>
      <tr>
        <td rowspan="3" style="writing-mode:lr-tb">汇款、汇票时填写</td>
        <td align="right">开户行：</td>
        <td colspan="3">
          <el-input v-model="formData.khh" placeholder="开户行"></el-input>
        </td>
        <td align="right">账号：</td>
        <td colspan="2">
          <el-input v-model="formData.zh" placeholder="账号"></el-input>
        </td>
      </tr>
      <tr>
        <td align="right">省/直辖市：</td>
        <td colspan="3">
          <el-input v-model="formData.ss" placeholder="省/直辖市"></el-input>
        </td>
        <td align="right">市/县：</td>
        <td colspan="2">
          <el-input v-model="formData.sx" placeholder="市/县"></el-input>
        </td>
      </tr>
      <tr>
        <td align="right">汇款附言：</td>
        <td colspan="6">
          <el-input v-model="formData.hkfy" placeholder="省/直辖市"></el-input>
        </td>
      </tr>
      <tr>
        <td align="right">是否有合同：</td>
        <td colspan="7" align="left">
          <el-checkbox v-model="formData.sfht"></el-checkbox>
        </td>
      </tr>
      <tr>
        <td align="right">合同号：</td>
        <td colspan="2">
          <el-input v-model="formData.hth" placeholder="合同号"></el-input>
        </td>
        <td align="right">金额:</td>
        <td colspan="4">
          <el-input v-model="formData.je" placeholder="金额"></el-input>
        </td>
      </tr>
      <tr>
        <td align="right">项目名称：</td>
        <td colspan="4">
          <el-input v-model="formData.xmmc" placeholder="合同号"></el-input>
        </td>
        <td align="right">项目编号:</td>
        <td colspan="2">
          <el-input v-model="formData.xmbh" placeholder="项目编号"></el-input>
        </td>
      </tr>
      <tr>
        <td align="right">运费专用发票：</td>
        <td align="left">
          <el-checkbox v-model="formData.yffp"></el-checkbox>
        </td>
        <td colspan="5" align="left">
          <el-button type="primary" @click="dialogTableVisible = true">税票清单</el-button>
          <el-button type="primary" @click="addTaxReceipt">添加税票</el-button>
        </td>
      </tr>
      <tr>
        <td align="right">备注：</td>
        <td colspan="7">
          <el-input v-model="formData.bz" placeholder="备注"></el-input>
        </td>
      </tr>
      <tr>
        <td align="right">费用类别：</td>
        <td align="left">
          <!-- <el-select
            @change="purchaseRequestData.CostAccount=''"
            v-model="formData.fylb"
            placeholder="请选择"
          >
            <el-option
              v-for="item in expenseCategoryOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>-->
        </td>
        <td align="right">费用科目:</td>
        <td colspan="5" align="left">
          <el-select v-model="formData.fykm" placeholder="请选择">
            <!-- <template v-for="item in costAccountOptions">
              <el-option
                v-if="purchaseRequestData.ExpenseCategory==item.Type"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </template>-->
          </el-select>
        </td>
      </tr>

      <tr>
        <td align="right">固定资产编码：</td>
        <td colspan="7">
          <el-input v-model="formData.gdzc" placeholder="固定资产编码"></el-input>
        </td>
      </tr>
      <tr>
        <td align="right">申请单号：</td>
        <td colspan="7">
          <el-input disabled v-model="formData.sqdh" placeholder="申请单号"></el-input>
        </td>
      </tr>
      <tr>
        <td align="right">单据编号：</td>
        <td colspan="7">
          <el-input v-model="formData.djbh" placeholder="单据编号"></el-input>
        </td>
      </tr>
      <tr>
        <td align="right">结算：</td>
        <td colspan="7" align="left">
          <el-checkbox v-model="formData.js"></el-checkbox>
        </td>
      </tr>
      <tr>
        <td colspan="8" align="right">
          <el-button type="primary" @click="save()">保存</el-button>
        </td>
      </tr>
    </table>

    <!-- 税票清单列表 -->
    <el-dialog show-summary title="税票清单" stripe :visible.sync="dialogTableVisible">
      <el-table :data="spqd">
        <el-table-column type="index" :index="indexMethod" label="序号" width="50"></el-table-column>
        <el-table-column property="gsdm" label="公司代码" width="100"></el-table-column>
        <el-table-column property="fph" label="发票号" width="150"></el-table-column>
        <el-table-column property="bz" label="币种"></el-table-column>
        <el-table-column property="gysmc" label="供应商"></el-table-column>
        <el-table-column property="fpje" label="发票金额"></el-table-column>
        <el-table-column property="sl" label="税率"></el-table-column>
        <el-table-column property="sm" label="税码"></el-table-column>
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
      <el-form :model="spform">
        <el-form-item label="公司代码:" :label-width="formLabelWidth" prop="gsdm">
          <el-input v-model="spform.gsdm"></el-input>
        </el-form-item>
        <el-form-item label="发票号:" :label-width="formLabelWidth" prop="gsdm">
          <el-input v-model="spform.fph"></el-input>
        </el-form-item>
        <el-form-item label="币种:" :label-width="formLabelWidth" prop="gsdm">
          <el-input v-model="spform.bz"></el-input>
        </el-form-item>
        <el-form-item label="供应商名称:" :label-width="formLabelWidth" prop="gsdm">
          <el-input v-model="spform.gysmc"></el-input>
        </el-form-item>
        <el-form-item label="发票金额:" :label-width="formLabelWidth" prop="gsdm">
          <el-input v-model="spform.fpje"></el-input>
        </el-form-item>
        <el-form-item label="税率:" :label-width="formLabelWidth" prop="gsdm">
          <el-input v-model="spform.sl"></el-input>
        </el-form-item>
        <el-form-item label="税码:" :label-width="formLabelWidth" prop="gsdm">
          <el-input v-model="spform.sm"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
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
      formData: {
        bxlx: "", //报销类型
        jsfs: "", //结算方式
        jbr: "", //经办人
        cbzx: "", //成本中心
        bz: "", //币种
        fpje: "", //发票金额
        hl: "", //汇率
        jexx: "", //金额小写
        jedx: "", //金额大写
        jkdh: "", //借款单号
        skdw: "", //收款单位名称
        khh: "", //开户行
        zh: "", //账号
        ss: "", //省市
        sx: "", //市县
        hkfy: "", //汇款附言
        sfht: false, //是否有合同
        hth: "", //合同号
        je: "", //金额
        xmmc: "", //项目名称
        xmbh: "", //项目编号
        yffp: false, //运费发票
        bz: "", //备注
        fylb: "", //费用类别
        fykm: "", //费用科目
        gdzc: "", //固定资产编码
        sqdh: "", //申请单号
        djbh: "", //单据编号
        js: "" //结算
      },
      spqd: [],
      spform: {
        gsdm: "",
        fph: "",
        bz: "",
        gysmc: "",
        fpje: "",
        sl: "",
        sm: ""
      },
      bxlx: [
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
      jsfs: [
        {
          value: "0",
          label: "7-清帐"
        },
        {
          value: "3-支票",
          label: "3-支票"
        },
        {
          value: "4-汇款",
          label: "4-汇款"
        },
        {
          value: "3",
          label: "6-信用证"
        },
        {
          value: "4",
          label: "5-汇票"
        }
      ],
      bz: [
        {
          value: "0",
          label: "1-人民币"
        },
        {
          value: "1",
          label: "2-美元"
        },
        {
          value: "2",
          label: "3-港币"
        },
        {
          value: "3",
          label: "4-欧元"
        },
        {
          value: "4",
          label: "5-日元"
        },
        {
          value: "5",
          label: "6-英镑"
        },
        {
          value: "6",
          label: "7-格里夫那"
        },
        {
          value: "7",
          label: "9-其他"
        }
      ],
      dialogTableVisible: false,
      dialogFormVisible: false,
      editIndex: -1, //是否编辑
      formLabelWidth: "150px",
      expenseCategoryOptions: [], //费用类别
      costAccountOptions: [], //费用科目
      message: "" //消息文本
    };
  },
  methods: {
    formVerification() {
      //主表校验
      var isSuccess = false;
      if (this.formData.bxlx == "") {
        this.message = "请选择报销类型;";
      } else if (this.formData.jsfs == "") {
        this.message = "请选择结算方式;";
      } else if (isNaN(this.formData.fpje)) {
        this.message = "发票金额不合法;";
      } else if (this.formData.bz == "") {
        this.message = "请选择币种;";
      } else if (this.formData.hl == "") {
        this.message = "请输入汇率;";
      } else if (isNaN(this.formData.hl)) {
        this.message = "汇率不合法;";
      } else if (this.formData.jexx == "") {
        this.message = "请输入小写金额;";
      } else if (isNaN(this.formData.jexx)) {
        this.message = "小写金额不合法;";
      } else if (this.formData.jkdh == "" && this.formData.bxlx == "费用借款") {
        this.message = "请输入借款单号;";
      } else if (
        (this.formData.jsfs == "4-汇款" || this.formData.jsfs == "3-支票") &&
        this.formData.skdw == ""
      ) {
        this.message = "请填写收款单位全称;";
      } else if (
        (this.formData.jsfs == "4-汇款" || this.formData.jsfs == "3-支票") &&
        this.formData.khh == ""
      ) {
        this.message = "请填开户行;";
      } else if (this.formData.khh.length > 100) {
        this.message = "开户行不能大于100字符;";
      } else if (
        (this.formData.jsfs == "4-汇款" || this.formData.jsfs == "3-支票") &&
        this.formData.ss == ""
      ) {
        this.message = "请填写省市;";
      } else if (this.formData.ss) {
        this.message = "省/直辖市必须已省或市结尾;";
      } else if (
        (this.formData.jsfs == "4-汇款" || this.formData.jsfs == "3-支票") &&
        this.formData.sx == ""
      ) {
        this.message = "请填写市/县;";
      } else if (
        (this.formData.jsfs == "4-汇款" || this.formData.jsfs == "3-支票") &&
        this.formData.hkfy == ""
      ) {
        this.message = "请填写汇款附言;";
      } else if (this.formData.hkfy.length >= 300) {
        this.message = "汇款附言不得超过300字符";
      } else if (this.formData.sfht && this.formData.hth == "") {
        this.message = "请输入合同号;";
      } else if (this.formData.sfht && this.formData.je == "") {
        this.message = "请输入金额;";
      } else if (this.formData.yffp && this.calculateMoney()) {
        alert(this.formData.yffp && this.calculateMoney());
        this.message = "税票清单和表单金额总和不一致;";
      } else {
        isSuccess = true;
      }
      return isSuccess;
    },
    itemVerification() {
      //附表校验
      var isSuccess = false;
      if (this.spform.fph == "") {
        this.message = "请输入发票号码;";
      } else if (this.spform.bz == "") {
        this.message = "请输入币种";
      } else if (this.spform.fpje == "") {
        this.message = "请输入发票金额;";
      } else if (isNaN(this.spform.fpje)) {
        this.message = "发票金额不合法;";
      } else if (this.spform.sl == "") {
        this.message = "请输入税率;";
      } else if (isNaN(this.spform.sl)) {
        this.message = "税率不合法;";
      } else if (this.spform.sm == "") {
        this.message = "请输入税码;";
      } else {
        isSuccess = true;
      }
      return isSuccess;
    },
    convertMoney() {
      //转换金额change事件
      if (this.formData.jexx != "" && !isNaN(this.formData.jexx)) {
        var result = this.getAmountInWords(parseFloat(this.formData.jexx));
        this.formData.jedx = result;
      } else {
        this.formData.jedx = "";
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
      if (this.spqd.length == 30) {
        this.$message({
          message: "已有30项税票数据",
          type: "error"
        });
      } else {
        this.dialogFormVisible = true;
      }
    },
    del(index) {
      this.spqd.splice(index, 1);
    },
    onEditItem(index) {
      this.spform = this.spqd[index];
      this.editIndex = index;
      this.dialogFormVisible = true;
    },

    onCancel: function() {
      this.editIndex = -1;
      this.spform = {
        gsdm: "",
        fph: "",
        bz: "",
        gysmc: "",
        fpje: "",
        sl: "",
        sm: ""
      };
      this.dialogFormVisible = false;
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
          this.spqd[this.editIndex] = this.spform;
        } else {
          //新增
          this.spqd.push(this.spform);
        }
        this.spform = {
          gsdm: "",
          fph: "",
          bz: "",
          gysmc: "",
          fpje: "",
          sl: "",
          sm: ""
        };
        this.dialogFormVisible = false;
      }
    },
    calculateMoney() {
      //计算金额
      var itemAmount = 0.0;
      for (let index = 0; index < this.spqd.length; index++) {
        itemAmount += parseFloat(this.spqd[index].fpje);
      }
      debugger;
      var formAmount = 0.0;
      formAmount =
        parseFloat(this.formData.fpje) +
        parseFloat(this.formData.jexx) +
        parseFloat(this.formData.je);
      return itemAmount == formAmount;
    },
    save() {
      if (!this.formVerification()) {
        //校验不通过;
        this.$message({
          message: this.message,
          type: "error"
        });
        //this.$message(common.message("error", this.message));
      } else {
        // alert(this.formData.yffp);
        // alert(this.calculateMoney())
        this.$message({
          message: "校验通过",
          type: "success"
        });
      }
    },
    indexMethod(index) {
      return index + 1;
    }
  },
  mounted: function() {
    for (let index = 1; index <= 29; index++) {
      this.spqd.push({
        gsdm: "123",
        fph: "112312312312312323",
        bz: "123",
        gysmc: "123",
        fpje: "123",
        sl: "123",
        sm: "123"
      });
    }
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
</style>