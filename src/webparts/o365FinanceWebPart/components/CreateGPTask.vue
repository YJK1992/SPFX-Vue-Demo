<template>
  <div>
    <el-container>
      <el-header>
        <h1>采购申请模板</h1>
      </el-header>
      <el-main>
        <table class="caigou" style="border-collapse: separate;">
          <tr>
            <td>标题：</td>
            <td colspan="6">
              <el-input placeholder="标题"></el-input>
            </td>
          </tr>
          <tr>
            <td>委托/经办人：</td>
            <td>
              <el-input placeholder="委托/经办人"></el-input>
            </td>
            <td>成本中心：</td>
            <td>
              <el-input placeholder="成本中心"></el-input>
            </td>
            <td>公司代码：</td>
            <td colspan="2">
              <el-input placeholder="公司代码"></el-input>
            </td>
          </tr>
          <tr>
            <td>交货地址：</td>
            <td colspan="6">
              <el-input placeholder="交货地址"></el-input>
            </td>
          </tr>
        </table>
        <el-table :data="tableData" stripe class="listData">
          <el-table-column align="center" prop="date" label="供应商" width="180"></el-table-column>
          <el-table-column align="center" prop="name" label="供应商部件" width="180"></el-table-column>
          <el-table-column align="center" prop="address" label="数量"></el-table-column>
          <el-table-column align="center" prop="address" label="单价"></el-table-column>
          <el-table-column align="center" prop="address" label="净额"></el-table-column>
          <el-table-column align="center" prop="address" label="税款"></el-table-column>
          <el-table-column align="center" prop="address" label="金额"></el-table-column>
        </el-table>

        <table class="caigou" style="border-collapse: separate;">
          <tr>
            <td>是否有合同：</td>
            <td colspan="6">
              <el-checkbox></el-checkbox>
            </td>
          </tr>
          <tr>
            <td>合同号：</td>
            <td>
              <el-input placeholder="合同号"></el-input>
            </td>
            <td>金额：</td>
            <td colspan="3">
              <el-input placeholder="金额"></el-input>
            </td>
          </tr>
          <tr>
            <td>申请类型：</td>
            <td>
              <el-select v-model="value" placeholder="请选择">
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </td>
            <td>费用类别：</td>
            <td>
              <el-input placeholder="金额"></el-input>
            </td>
            <td>费用科目：</td>
            <td colspan="2">
              <el-input placeholder="公司代码"></el-input>
            </td>
          </tr>
          <tr>
            <td>交货地址：</td>
            <td colspan="6">
              <el-input placeholder="交货地址"></el-input>
            </td>
          </tr>
          <tr>
            <td>固定资产编码：</td>
            <td colspan="6">
              <el-input placeholder="固定资产编码"></el-input>
            </td>
          </tr>
          <tr>
            <td>申请单号：</td>
            <td colspan="6">
              <el-input placeholder="申请单号"></el-input>
            </td>
          </tr>
        </table>
        <div class="bottom">
          <el-button type="primary" @click="save()">保存</el-button>
        </div>
      </el-main>
    </el-container>
  </div>
</template>
<script>
export default {
  data() {
    return {
      msg: "CreateGPTask",
      options: [
        {
          value: "选项1",
          label: "黄金糕"
        },
        {
          value: "选项2",
          label: "双皮奶"
        },
        {
          value: "选项3",
          label: "蚵仔煎"
        },
        {
          value: "选项4",
          label: "龙须面"
        },
        {
          value: "选项5",
          label: "北京烤鸭"
        }
      ],
      value: "",
      tableData: [
        {
          date: "2016-05-02",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄"
        },
        {
          date: "2016-05-02",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄"
        }
      ]
    };
  }
};
</script>

<style>
.caigou {
  width: 100%;
  min-height: 25px;
  line-height: 25px;
  border-spacing: 10px;
  color: #909399;
  margin: 10px 0px;
}
.caigou td:nth-child(even) {
  text-align: left;
}
.caigou td:nth-child(odd) {
  text-align: right;
}

h1 {
  text-align: center;
  color: #909399;
}
.listData {
  width: 100%;
  text-align: center;
}
.bottom {
  text-align: right;
  margin-top: 10px;
}
</style>
