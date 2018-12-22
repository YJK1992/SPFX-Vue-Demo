<template>
  <div id="yuangong">
    <table class="yuangong" style="  border-collapse: collapse;">
      <tr>
        <td colspan="8">
          <span style="font-size:30px;color:#409eff;">员工报销</span>
        </td>
      </tr>
      <tr>
        <td>报销单号：</td>
        <td colspan="7">
          <el-input placeholder="报销单号"></el-input>
        </td>
      </tr>
      <tr>
        <td align="right">员工：</td>
        <td>
          <el-input placeholder="员工"></el-input>
        </td>
        <td align="right">账户号：</td>
        <td>
          <el-input placeholder="账户号"></el-input>
        </td>
        <td align="right">成本中心：</td>
        <td>
          <el-input placeholder="成本中心"></el-input>
        </td>
        <td align="right">公司代码：</td>
        <td>
          <el-input placeholder="公司代码"></el-input>
        </td>
      </tr>
      <tr>
        <td align="right">订单号：</td>
        <td>
          <el-input placeholder="订单号"></el-input>
        </td>
        <td align="right">费用日期：</td>
        <td>
          <el-input placeholder="费用日期"></el-input>
        </td>
        <td align="right">费用类型：</td>
        <td>
          <el-input placeholder="费用类型"></el-input>
        </td>
        <td align="right">费用科目：</td>
        <td>
          <el-input placeholder="费用科目"></el-input>
        </td>
      </tr>
      <tr>
        <td align="right">数量：</td>
        <td>
          <el-input placeholder="数量"></el-input>
        </td>
        <td align="right">单位金额:</td>
        <td>
          <el-input placeholder="单位金额"></el-input>
        </td>
        <td align="right">净税金额：</td>
        <td colspan="3">
          <el-input placeholder="净税金额"></el-input>
        </td>
      </tr>
      <tr>
        <td align="right">币种：</td>
        <td>
          <el-input placeholder="币种"></el-input>
        </td>
        <td align="right">汇率:</td>
        <td>
          <el-input placeholder="汇率"></el-input>
        </td>
        <td align="right">转换金额：</td>
        <td colspan="3">
          <el-input placeholder="转换金额"></el-input>
        </td>
      </tr>
      <tr>
        <td align="right">是否启用税：</td>
        <td colspan="7" align="left">
          <el-checkbox></el-checkbox>
        </td>
      </tr>
      <tr>
        <td align="right">VAT：</td>
        <td>
          <el-input placeholder="VAT"></el-input>
        </td>
        <td align="right">税额：</td>
        <td>
          <el-input placeholder="税额"></el-input>
        </td>
        <td align="right">总金额：</td>
        <td colspan="3">
          <el-input placeholder="净税金额"></el-input>
        </td>
      </tr>
      <tr>
        <td>参考号：</td>
        <td colspan="7">
          <el-input placeholder="参考号"></el-input>
        </td>
      </tr>
      <tr>
        <td>特殊审批人：</td>
        <td colspan="7">
          <el-input placeholder="特殊审批人"></el-input>
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
    return {};
  },
  methods: {
    save() {
      //    this.Message.error('错了哦，这是一条错误消息');
      this.$message({
        showClose: true,
        message: "错了哦，这是一条错误消息",
        type: "error"
      });
    }
  },
  components: {}
};
</script>

<style>
.yuangong {
  min-height: 25px;
  line-height: 25px;
  text-align: center;
  border-collapse: collapse;
  color: gray;
  padding: 2px;
}
.yuangong tr td {
  border: 1px solid #cfcfcf;
  padding: 5px;
}
</style>