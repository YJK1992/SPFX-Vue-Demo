<template>
  <div id="duigongId">
    <table class="duigong" style="border-collapse: collapse;">
      <tr>
        <td colspan="8">
          <span style="font-size:30px;color:#409eff;">对公付款模板</span>
        </td>
      </tr>
      <tr>
        <td align='right'>报销类型：</td>
        <td colspan="7" align='left'>
          <el-select v-model="value" placeholder="请选择">
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
        <td align='right'>结算方式：</td>
        <td>
          <el-select v-model="value" placeholder="请选择">
            <el-option
              v-for="item in jsfs"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </td>
        <td align='right'>经办人：</td>
        <td>
          <el-input placeholder="经办人"></el-input>
        </td>
        <td align='right'>成本中心：</td>
        <td>
          <el-input placeholder="成本中心"></el-input>
        </td>
        <td align='right'>币种：</td>
        <td>
          <el-select v-model="value" placeholder="请选择">
            <el-option v-for="item in bz" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </td>
      </tr>
      <tr>
        <td align='right'> 金额(小写)：</td>
        <td colspan="2">
          <el-input placeholder="小写金额"></el-input>
        </td>
        <td align='right'>金额(大写)：</td>
        <td colspan="4">
          <el-input disabled placeholder="大写金额"></el-input>
        </td>
      </tr>
      <tr>
        <td colspan="3" style="color:#409eff">此项报销有借款时必须要填写借款单号</td>
        <td align='right'>借款单号：</td>
        <td colspan="4">
          <el-input placeholder="借款单号"></el-input>
        </td>
      </tr>
      <tr>
        <td colspan="8" align="center" style="color:#409eff">结算方式为“汇款”或“支票”时填写</td>
      </tr>
      <tr>
        <td align='right'>收款单位名称：</td>
        <td colspan="7">
          <el-input placeholder="收款单位名称"></el-input>
        </td>
      </tr>
      <tr>
        <td rowspan="3" style="writing-mode:lr-tb">汇款、汇票时填写</td>
        <td align='right'>开户行：</td>
        <td colspan="3">
          <el-input placeholder="开户行"></el-input>
        </td>
        <td align='right'>账号：</td>
        <td colspan="2">
          <el-input placeholder="账号"></el-input>
        </td>
      </tr>
      <tr>
        <td align='right'>省/直辖市：</td>
        <td colspan="3">
          <el-input placeholder="省/直辖市"></el-input>
        </td>
        <td align='right'>市/县：</td>
        <td colspan="2">
          <el-input placeholder="市/县"></el-input>
        </td>
      </tr>
      <tr>
        <td align='right'>汇款附言：</td>
        <td colspan="6">
          <el-input placeholder="省/直辖市"></el-input>
        </td>
      </tr>
      <tr>
        <td align='right'>是否有合同：</td>
        <td colspan="7" align='left'>
          <el-checkbox></el-checkbox>
        </td>
      </tr>
      <tr>
        <td align='right'>合同号：</td>
        <td colspan="2">
          <el-input placeholder="合同号"></el-input>
        </td>
        <td align='right'>金额:</td>
        <td colspan="4">
          <el-input placeholder="金额"></el-input>
        </td>
      </tr>
      <tr>
        <td align='right'>项目名称：</td>
        <td colspan="4">
          <el-input placeholder="合同号"></el-input>
        </td>
        <td align='right'>项目编号:</td>
        <td colspan="2">
          <el-input placeholder="项目编号"></el-input>
        </td>
      </tr>
      <tr>
        <td align='right'>运费专用发票：</td>
        <td colspan="7">
          <el-input placeholder="运费专用发票"></el-input>
        </td>
      </tr>
      <tr>
        <td align='right'>备注：</td>
        <td colspan="7">
          <el-input placeholder="备注"></el-input>
        </td>
      </tr>
      <tr>
        <td align='right'>费用类别：</td>
        <td colspan="3">
          <el-input placeholder="费用类别"></el-input>
        </td>
        <td align='right'>费用科目:</td>
        <td colspan="3">
          <el-input placeholder="费用科目"></el-input>
        </td>
      </tr>

      <tr>
        <td align='right'>固定资产编码：</td>
        <td colspan="7">
          <el-input placeholder="固定资产编码"></el-input>
        </td>
      </tr>
      <tr>
        <td align='right'>申请单号：</td>
        <td colspan="7">
          <el-input placeholder="申请单号"></el-input>
        </td>
      </tr>
      <tr>
        <td align='right'>单据编号：</td>
        <td colspan="7">
          <el-input placeholder="单据编号"></el-input>
        </td>
      </tr>
      <tr>
        <td align='right'>结算：</td>
        <td colspan="7">
          <el-input placeholder="结算"></el-input>
        </td>
      </tr>
      <tr>
        <td colspan="8" align="right">
          <el-button type="primary" @click="save()">保存</el-button>
        </td>
      </tr>
    </table>
  </div>
</template>
<script>
export default {
  data() {
    return {
      bxlx: [
        {
          value: "0",
          label: "费用借款"
        },
        {
          value: "1",
          label: "对公付款"
        },
        {
          value: "2",
          label: "资产对公付款"
        },
        {
          value: "3",
          label: "其他"
        }
      ],
      jsfs: [
        {
          value: "0",
          label: "7-清帐"
        },
        {
          value: "1",
          label: "3-支票"
        },
        {
          value: "2",
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
      ]
    };
  },
  methods: {},
  components: {}
};
</script>

<style>
.duigong {
  min-height: 25px;
  line-height: 25px;
  text-align: center;
  color:gray;
  padding: 2px;
}
.duigong tr td {
  border: 1px solid #cfcfcf;
  padding: 5px;
}
h1 {
  text-align: center;
  color: #909399;
}
</style>