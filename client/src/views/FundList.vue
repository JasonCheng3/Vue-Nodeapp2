<template>
  <div class="fillConatiner">
    <div>
      <el-form :inline="true" ref="add_data" :model="search_data">
        <!-- 篩選 -->
        <el-form-item label="按照時間篩選:">
          <el-date-picker v-model="search_data.startTime" type="datetime" placeholder="选择開始时间"></el-date-picker>--
          <el-date-picker v-model="search_data.endTime" type="datetime" placeholder="选择結束时间"></el-date-picker>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" size="small" icon="search" @click="handleSearch()">新增</el-button>
        </el-form-item>
        <el-form-item class="btnRight">
          <el-button
            type="primary"
            size="small"
            icon="view"
            @click="handleAdd()"
            v-if="user.identity == 'manager'"
          >新增</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="table_container">
      <el-table
        v-if="tableData.length > 0"
        :data="tableData"
        max-height="450"
        border
        :default-sort="{prop: 'date', order: 'descending'}"
        style="width: 100%"
      >
        <el-table-column type="index" label="序号" align="center" width="70"></el-table-column>
        <el-table-column prop="date" label="创建时间" align="center" width="250" sortable>
          <template slot-scope="scope">
            <el-icon name="time"></el-icon>
            <span style="margin-left: 10px">{{ scope.row.date }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="type" label="收支类型" align="center" width="150"></el-table-column>
        <el-table-column prop="describe" label="收支描述" align="center" width="180"></el-table-column>
        <el-table-column prop="income" label="收入" align="center" width="170">
          <template slot-scope="scope">
            <span style="color:#00d053">+ {{ scope.row.income }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="expend" label="支出" align="center" width="170">
          <template slot-scope="scope">
            <span style="color:#f56767">- {{ scope.row.expend }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="cash" label="账户现金" align="center" width="170">
          <template slot-scope="scope">
            <span style="color:#4db3ff">{{ scope.row.cash }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="remark" label="备注" align="center" width="220"></el-table-column>
        <el-table-column prop="operation" align="center" label="操作" fixed="right" width="180">
          <template slot-scope="scope">
            <el-button type="warning" icon="edit" size="small" @click="onEditMoney(scope.row)">编辑</el-button>
            <el-button
              type="danger"
              icon="delete"
              size="small"
              @click="onDeleteMoney(scope.row,scope.$index)"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <el-row>
        <el-col :span="24">
          <div class="pagination">
            <el-pagination
              v-if="paginations.total > 0"
              :page-sizes="paginations.page_sizes"
              :page-size="paginations.page_size"
              :layout="paginations.layout"
              :total="paginations.total"
              :current-page.sync="paginations.page_index"
              @current-change="handleCurrentChange"
              @size-change="handleSizeChange"
            ></el-pagination>
          </div>
        </el-col>
      </el-row>
    </div>
    <Dialog :dialog="dialog" :formData="formData" @update="getProfile"></Dialog>
  </div>
</template>

<script>
import Dialog from "../components/Dialog";
export default {
  name: "fundList",
  data() {
    return {
      search_data: {
        startTime: "",
        endTime: ""
      },
      filterTableData: [],
      paginations: {
        page_index: 1, // 當前位於哪頁
        total: 0, // 總數
        page_size: 5, // 一頁顯示多少條
        page_sizes: [5, 10, 15, 20], //每頁顯示多少條
        layout: "total, sizes,prev,pager,next,jumper" //翻頁屬性
      },
      tableData: [],
      alltableData: [],
      formData: {
        type: "",
        describe: "",
        income: "",
        expend: "",
        cash: "",
        remark: "",
        id: ""
      },
      dialog: {
        show: false,
        title: "",
        option: "edit"
      }
    };
  },
  computed: {
    user() {
      return this.$store.getters.user;
    }
  },
  created() {
    this.getProfile();
  },
  methods: {
    // 獲取表格數據
    getProfile() {
      this.$axios
        .get("/api/profile")
        .then(res => {
          console.log(res);
          this.alltableData = res.data;
          this.filterTableData = res.data;
          // 設置分頁數據
          this.setPaginations();
        })
        .catch(err => console.log(err));
    },
    handleEdit(index, row) {
      // 編輯
      console.log(this.dialog);
      this.dialog = {
        show: true,
        title: "修改資金訊息",
        option: "edit"
      };
      this.formData = {
        type: row.type,
        describe: row.describe,
        income: row.income,
        expend: row.expend,
        cash: row.cash,
        remark: row.remark,
        id: row._id
      };
    },
    handleDelete(index, row) {
      console.log(456);
      var ii = `${row._id}`;
      console.log(ii);
      console.log(`/api/profile/delete/${row._id}`);
      this.$axios.delete(`/api/profile/delete/${row._id}`).then(res => {
        this.$message("删除成功");
        this.getProfile();
      });
    },
    handleAdd() {
      this.dialog = {
        show: true,
        title: "新增資金訊息",
        option: "add"
      };
      this.formData = {
        type: "",
        describe: "",
        income: "",
        expend: "",
        cash: "",
        remark: "",
        id: ""
      };
      this.dialog.show = true;
    },
    handleSizeChange(page_size) {
      // 切換size
      this.paginations.page_index = 1;
      this.paginations.page_size = page_size;
      this.tableData = this.alltableData.filter((item, index) => {
        return index < page_size;
      });
    },
    handleCurrentChange(page) {
      // 獲取當前頁面
      let index = this.paginations.page_size * (page - 1);
      // 數據的總數
      let nums = this.paginations.page_size * page;
      // 容器
      let tables = [];

      for (let i = index; i < nums; i++) {
        if (this.alltableData[i]) {
          tables.push(this.alltableData[i]);
        }
        this.tableData = tables;
      }
    },
    setPaginations() {
      // 分頁屬性設置
      this.paginations.total = this.alltableData.length;
      this.paginations.page_index = 1;
      this.paginations.page_size = 5;
      // 設置默認的分頁數據
      this.tableData = this.alltableData.filter((item, index) => {
        return index < this.paginations.page_size;
      });
    },
    handleSearch() {
      //篩選
      if (!this.search_data.startTime || !this.search_data.endTime) {
        this.$message({
          type: "warning",
          message: "請選擇時間區間"
        });
        this.getProfile();
        return;
      }

      const sTime = this.search_data.startTime.getTime();
      const eTime = this.search_data.endTime.getTime();

      this.alltableData = this.filterTableData.filter(item => {
        // console.log(item);
        let date = new Date(item.date);
        let time = date.getTime();
        return time >= sTime && time <= eTime;
      });

      // 分頁數據
      this.setPaginations();
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

.pagination {
  text-align: right;
  margin-top: 10px;
}
</style>
