<template>
  <div id="Form">
    <div>
      <!--item -->
      <table class="top" style="  border-collapse: collapse;">
        <tr>
          <td colspan="10">
            <span style="font-size:30px;color:#409eff;">资产领用模板</span>
          </td>
        </tr>
        <tr>
          <td>申请人 ：</td>
          <td colspan="2">{{ECCTaskForm.userId}}</td>
          <td>成本中心 ：</td>
          <td colspan="2">{{ECCTaskForm.costcenter}}</td>
          <td>公司代码 ：</td>
          <td align="left" colspan="4">{{ECCTaskForm.companycode}}</td>
        </tr>
        <tr>
          <td>申请单号 ：</td>
          <td colspan="2">{{ECCTaskForm.applicantNumber}}</td>
          <td>申请类别 ：</td>
          <td colspan="2">{{ECCTaskForm.applicantType}}</td>
          <td>产品类型 ：</td>
          <td colspan="3" align="left">{{ECCTaskForm.productType}}</td>
        </tr>
        <tr>
          <td>总金额 ：</td>
          <td colspan="9" style="text-align:left;"></td>
        </tr>
        <tr>
          <td>收件人及地址 ：</td>
          <td colspan="9" style="text-align:left;"></td>
        </tr>

        <tr>
          <td colspan="10" style="text-align:right;"></td>
        </tr>
        <tr>
          <td>物料</td>
          <td width="200x">物料描述</td>
          <td>数量</td>
          <td>单价</td>
          <td>总金额</td>
          <td>是否选择</td>
          <td>申请类型</td>
          <td width="200px">固定资产编码</td>
          <td>费用条目</td>
        </tr>
        <tr v-for="(items,index) in subListData">
          <template v-for="(item,cindex) in items">
            <td v-if="cindex == 'gdzc' && subListData[index].sqlx=='资产' ">
              <el-input v-model="subListData[index].gdzc" placeholder="请输入固定资产编码"></el-input>
            </td>
            <td v-else-if="cindex == 'fytm' && subListData[index].sqlx=='费用' ">
              <el-input v-model="subListData[index].fytm" placeholder="请输入费用条目"></el-input>
            </td>
            <td v-else>{{item}}</td>
          </template>
        </tr>
        <tr></tr>
        <tr>
          <td colspan="10" align="right">
            <el-button type="primary" @click="save()">保存</el-button>
          </td>
        </tr>
      </table>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      ECCTaskForm: {
        applicant: "1",
        costcenter: "1",
        companycode: "1",
        applicantNumber: "1",
        applicantType: "1",
        productType: "1",
        consigneeDetail: "1",
        userId: "1"
      }, //ECC主表
      subListData: [
        {
          wl: "1", //物料
          ms: "1", //描述
          sl: "1", //数量
          dj: "1", //单价
          zje: "1", //总金额
          sfxz: "1", //是否选择
          sqlx: "资产", //申请类型
          gdzc: "", //固定资产编码
          fytm: "" //费用条目
        },
        {
          wl: "2", //物料
          ms: "2", //描述
          sl: "2", //数量
          dj: "2", //单价
          zje: "2", //总金额
          sfxz: "2", //是否选择
          sqlx: "费用", //申请类型
          gdzc: "", //固定资产编码
          fytm: "" //费用条目
        }
      ] // ECC物料副表
    };
  },
  methods: {
    save() {
      this.$confirm("确定保存所填项", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$message({
            type: "success",
            message: "保存成功!"
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消"
          });
        });
    }
  }
};
</script>

<style>
.top {
  min-height: 25px;
  line-height: 25px;
  text-align: center;
  border-collapse: collapse;
  color: gray;
  padding: 2px;
}
.top tr td {
  border: 1px solid #cfcfcf;
  padding: 5px;
}

/* .top tr:nth-child(7) {
  background-color: #409eff;
  font-weight: bold;
  color: white;
  border: 0px; 
}*/
</style>
