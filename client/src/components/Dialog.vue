<template>
  <div class="dialog">
    <el-dialog
      title="添加資金訊息"
      :visible.sync="dialog.show"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :modal-append-to-body="false"
    >
      <div class="form">
        <el-form
          ref="form"
          :model="formData"
          :rules="form_rules"
          label-width="120px"
          style="margin:10px; with:auto;"
        >
          <el-form-item label="收支類型:">
            <el-select v-model="formData.type" placeholder="收支類型">
              <el-option
                v-for="(formtype, index) in format_type_list"
                :key="index"
                :label="formtype"
                :value="formtype"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="describe" label="收支描述:">
              <el-input type="describe" v-model="formData.describe"></el-input>
          </el-form-item>
          <el-form-item prop="income" label="收入:">
              <el-input type="income" v-model="formData.income"></el-input>
          </el-form-item>
          <el-form-item prop="expend" label="支出:">
              <el-input type="expend" v-model="formData.expend"></el-input>
          </el-form-item>
          <el-form-item prop="cash" label="帳戶現金:">
              <el-input type="cash" v-model="formData.cash"></el-input>
          </el-form-item>

          <el-form-item label="備註:">
              <el-input type="textarea" v-model="formData.remark"></el-input>
          </el-form-item>

          <el-form-item class="text_right">
              <el-button @click="dialog.show = false">取消</el-button>
              <el-button type="primary" @click="onSubmit('form')">提交</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "dialog",
  data() {
    return {
      formData: {
        type: "",
        describe: "",
        income: "",
        expend: "",
        cash: "",
        remark: "",
        id: ""
      },
      format_type_list: [
        "提現",
        "提線手續費",
        "衝值",
        "優惠卷",
        "充值禮卷",
        "轉帳"
      ],
      form_rules:{
          describe:[
              {required: true, message: '收支描述不能為空', trigger: 'blur'}
          ],
          income:[
              {required: true, message: '收入不能為空', trigger: 'blur'}
          ],
          expend:[
              {required: true, message: '支出不能為空', trigger: 'blur'}
          ],
          cash:[
              {required: true, message: '現金不能為空', trigger: 'blur'}
          ],
      }
    };
  },
  props: {
    dialog: Object
  },
  methods:{
      onSubmit(form){
          this.$refs[form].validate(valid =>{
              if(valid) {
                //   console.log(this.formData);
                this.$axios.post('/api/profiles/add', this.formData)
                .then(res => {
                    //添加成功
                    this.$message({
                        message: '數據添加成功',
                        type: 'success'
                    })

                    // 隱藏dialog
                    this.dialog.show = false;
                    this.$emit('update');
                })
              }
          })
      }
  }
};
</script>


<style scoped>
</style>
