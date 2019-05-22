<template>
  <div class="fillConatiner">
    <div>
      <el-form :inline="true" ref="add_data">
        <el-form-item class="btnRight">
          <el-button type="primary" size="small" icon="view" @click="handleAdd()">新增</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="table_container">
      <el-table
        v-if="tableData.length > 0"
        :data="tableData"
        max-height="450"
        border
        style="width: 100%"
      >
        <el-table-column prop="date" label="創建時間" align="center" width="250" sortable>
          <template slot-scope="scope">
            <el-icon name="time"></el-icon>
            <span style="margin-left: 10px">{{ scope.row.date }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="type" label="收支類型" align="center" width="150"></el-table-column>
        <el-table-column prop="describe" label="收支描述" align="center" width="180"></el-table-column>
        <el-table-column prop="income" label="收入" align="center" width="170">
          <template slot-scope="scope">
            <span style="color: #00d053">{{ scope.row.income }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="expend" label="支出" align="center" width="170">
          <template slot-scope="scope">
            <span style="color: #f56767">{{ scope.row.expend }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="cash" label="帳戶現金" align="center" width="170">
          <template slot-scope="scope">
            <span style="color: #4db3ff">{{ scope.row.cash }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="remark" label="備註" align="center" width="220"></el-table-column>
        <el-table-column prop="operation" align="center" fixed="right" width="320" label="操作">
          <template slot-scope="scope">
            <el-button
              type="warning"
              size="small"
              icon="edit"
              @click="handleEdit(scope.$index, scope.row)"
            >编辑</el-button>
            <el-button
              size="small"
              type="danger"
              icon="delete"
              @click="handleDelete(scope.$index, scope.row)"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <Dialog :dialog="dialog"></Dialog>
  </div>
</template>

<script>
import Dialog from "../components/Dialog";
export default {
  name: "fundList",
  data() {
    return {
      tableData: [],
      dialog: {
        show: false
      }
    };
  },
  created() {
    this.getProfile();
  },
  methods: {
    // 獲取表格數據
    getProfile() {
      this.$axios
        .get("/api/profiles")
        .then(res => {
          console.log(res);
          this.tableData = res.data;
        })
        .catch(err => console.log(err));
    },
    handleEdit(index, row) {
      console.log(123);
    },
    handleDelete(index, row) {
      console.log(456);
    },
    handleAdd() {
      this.dialog.show = true;
    }
  },
  components: {
    Dialog
  }
};
</script>

<style scoped>
.fillContainer {
  width: 100%;
  height: 100%;
  padding: 16px;
  box-sizing: border-box;
}
.btnRight {
  float: right;
}
</style>
