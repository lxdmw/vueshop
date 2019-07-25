<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
    <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
    <el-breadcrumb-item>商品管理</el-breadcrumb-item>
    <el-breadcrumb-item>分类参数</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片区域 -->
    <el-card>
      <el-alert title="注意:只允许为第三级分类设置相关参数" :closable="false" type="warning" show-icon></el-alert>
      <!-- 选择商品分类 -->
      <el-row class="cat_opt">
        <el-col>
          <span>选择商品分类</span>
          <el-cascader
            v-model="selectCatKeys"
            :options="cateList"
            :props="cateProps"
            :show-all-levels="false"
            @change="handleChange"
            >
          </el-cascader>
        </el-col>
      </el-row>

        <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane label="动态参数" name="many">
            <el-button type="primary" size="mini" :disabled="isBtnDisabled" @click="showDialog">添加参数</el-button>
            <el-table :data="manyTableData" border stripe>
              <!-- 展开行 -->
              <el-table-column type="expand">
                <template slot-scope="scope">
                  <!-- 循环渲染tag标签 -->
                  <el-tag v-for="(item, i) in scope.row.attr_vals" :key="i" closable @close="handleClose(i,scope.row)">
                    {{item}}
                  </el-tag>
                  <!-- 渲染输入框 -->
                  <el-input
                    class="input-new-tag"
                    v-if="scope.row.inputVisible"
                    v-model="scope.row.inputValue"
                    ref="saveTagInput"
                    size="small"
                    @keyup.enter.native="handleInputConfirm(scope.row)"
                    @blur="handleInputConfirm(scope.row)"
                  >
                  </el-input>
                  <!-- 添加按钮 -->
                  <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>

                </template>
              </el-table-column>
              <!-- 索引列 -->
              <el-table-column type="index"></el-table-column>
              <el-table-column label="参数名称" prop="attr_name"></el-table-column>
              <el-table-column label="操作">
                <template slot-scope="scope">
                    <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditForm(scope.row.attr_id)">编辑</el-button>
                    <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeParams(scope.row.attr_id)">删除</el-button>

                </template>
              </el-table-column>            
              </el-table>
          </el-tab-pane>
          <el-tab-pane label="静态属性" name="only">
            <el-button type="primary" size="mini" :disabled="isBtnDisabled" @click="showDialog">添加属性</el-button>
            <el-table :data="onlyTableData" border stripe>
              <!-- 展开行 -->
              <el-table-column type="expand">
                <template slot-scope="scope">
                  <el-tag v-for="(item, i) in scope.row.attr_vals" :key="i" closable @close="handleClose(i,scope.row)" >
                    {{item}}
                  </el-tag>
                  <!-- 渲染输入框 -->
                  <el-input
                    class="input-new-tag"
                    v-if="scope.row.inputVisible"
                    v-model="scope.row.inputValue"
                    ref="saveTagInput"
                    size="small"
                    @keyup.enter.native="handleInputConfirm(scope.row)"
                    @blur="handleInputConfirm(scope.row)"
                  >
                  </el-input>
                  <!-- 添加按钮 -->
                  <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>

                </template>
              </el-table-column>
              <!-- 索引列 -->
              <el-table-column type="index"></el-table-column>
              <el-table-column label="参数名称" prop="attr_name"></el-table-column>
              <el-table-column label="操作">
                <template slot-scope="scope">
                    <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditForm(scope.row.attr_id)">编辑</el-button>
                    <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeParams(scope.row.attr_id)">删除</el-button>

                </template>
              </el-table-column>            
              </el-table>
          </el-tab-pane>
        </el-tabs>
    </el-card>


    <!-- 添加参数的对话框 -->
    <el-dialog
      :title="'添加' + titleText"
      :visible.sync="dialogVisible"
      width="50%"  @close="addDialogClosed">
      <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="100px" >
        <el-form-item :label="titleText" prop="attr_name">
          <el-input v-model="addForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addParams()">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 修改参数的对话框 -->
    <el-dialog
      :title="'修改' + titleText"
      :visible.sync="editDialogVisible"
      width="50%" 
      @close="editDialogClosed">
      <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="100px" >
        <el-form-item :label="titleText" prop="attr_name">
          <el-input v-model="editForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editParams()">确 定</el-button>
      </span>
    </el-dialog>

  </div>
</template>
<script>
import { async } from 'q';

export default {
  created() {
    this.getCateList()
  },
  data () {
    return {
      cateList:[],
      cateProps:{
        value:'cat_id',
        label:'cat_name',
        children:'children',
        expandTrigger: 'hover'
      },
      // 级联选择框双向绑定到的数组
      selectCatKeys:[],
      // 被激活的页签的名称
      activeName:'many',
      // 动态参数的数据
      manyTableData:[],
      // 静态属性的数据
      onlyTableData:[],
      // 控制添加/修改对话框的显示与隐藏
      dialogVisible:false,
      editDialogVisible:false,
      // 添加/修改参数的表单数据对象
      addForm:{},
      editForm:{},
      // 添加表单的验证规则对象
      addFormRules:{
        attr_name:[{required:true,message:'请输入参数名称',trigger:'blur'}]
      },
      editFormRules:{
        attr_name:[{required:true,message:'请输入参数名称',trigger:'blur'}]
      },
      // 控制文本框和按钮的显示隐藏
      inputVisible:false,
      inputValue:'',
    };
  },
  methods:{
    async getCateList() {
      const {data:res} = await this.$http.get('categories')
      
      if(res.meta.status != 200) {
        return this.$message.error('找不到数据...')
      }
      this.cateList = res.data
      
      
    },
    
    async getParamsData(){
      
        if (this.selectCatKeys.length !== 3) {
        this.selectCatKeys = []
        this.manyTableData=[]
        this.onlyTableData = []
        return
      }
      const{data:res} = await this.$http.get(`categories/${this.cateId}/attributes`,{params:{sel:this.activeName}})

      if(res.meta.status != 200) {
        return this.$message.error('获取数据列表参数失败')
      }
      
      res.data.forEach(item => {
        item.attr_vals = item.attr_vals ?  item.attr_vals.split(' ') : []
        item.inputVisible = false
        item.inputValue=''
      })
      console.log(res);
      
      if (this.activeName == 'many') {
        this.manyTableData = res.data
      }else{
        this.onlyTableData = res.data
      }
      
    },
    handleClick(){
      console.log(this.activeName);
      this.getParamsData()
    },
    handleChange(){
      this.getParamsData()
    },
    showDialog(){
      this.dialogVisible = true
    },
    addDialogClosed(){
      // console.log(this.$refs);
      
      this.$refs.addFormRef.resetFields()
    },
    editDialogClosed(){
      this.$refs.editFormRef.resetFields()
    },
    addParams(){


    
      this.$refs.addFormRef.validate(async valid=>{
        if(!valid)return
        const {data:res} = await this.$http.post(`categories/${this.cateId}/attributes`,{
          attr_name:this.addForm.attr_name,
          attr_sel:this.activeName
        })
        if(res.meta.status != 201) return this.$message.error('添加参数失败')

        this.$message.success('添加参数成功')
        this.dialogVisible = false
        this.getParamsData()

      })
    },
    editParams(){
        this.$refs.editFormRef.validate(async valid=>{
        if(!valid)return
        const {data:res} = await this.$http.put(`categories/${this.cateId}/attributes/${this.editForm.attr_id}`,{
          attr_name:this.editForm.attr_name,
          attr_sel:this.activeName
        })
        if(res.meta.status != 200) return this.$message.error('修改参数失败')

        this.$message.success('修改参数成功')
        this.editDialogVisible = false
        this.getParamsData()

      })
    },
     async showEditForm(attr_id){
      const {data:res} = await this.$http.get(`categories/${this.cateId}/attributes/${attr_id}`,{params:{attr_sel:this.activeName}})
      if(res.meta.status != 200) return this.$message.error('修改参数失败')

      this.editForm = res.data
      this.editDialogVisible=true
    },
    async removeParams(attr_id){
      const confirmResult = await this.$confirm('此操作将永久删除该参数,是否继续?', '提示', {confirmButtonText:'确定',cancelButtonText:'取消',type:'warning'}).catch(err=>err)

      // 用户取消了删除的操作
      if(confirmResult != 'confirm') {
        return this.$message.info('已取消删除')
      }

      // 删除的业务逻辑
      const {data:res} = await this.$http.delete(`categories/${this.cateId}/attributes/${attr_id}`)

      if(res.meta.status != 200) {
        return this.$message.error('删除参数失败')
      }
      this.$message.success('删除参数成功')
      this.getParamsData()
    },
    async handleInputConfirm(row){
      if (row.inputValue.trim().length === 0) {
        row.inputValue = ''
        row.inputVisible = false
        return
      }
      // 如果没有return,则证明输入的内容,需要做后续处理
      row.attr_vals.push(row.inputValue.trim())
      row.inputValue = ''
      row.inputVisible = false
      this.saveAttrVals(row)
     
    },
    async saveAttrVals(row){
       const {data:res} = await this.$http.put(`categories/${this.cateId}/attributes/${row.attr_id}`,{
          attr_name:row.attr_name,
          attr_sel:row.attr_sel,
          attr_vals:row.attr_vals.join(' ')
        })
        if(res.meta.status != 200) return this.$message.error('修改参数失败')
        
    },

    showInput(row){
      row.inputVisible = true
      this.$nextTick(_=>{
          this.$refs.saveTagInput.$refs.input.focus()
      })
    },
    handleClose(i,row) {
      row.attr_vals.splice(i,1)
      this.saveAttrVals(row)

    }
  },
  computed:{
    isBtnDisabled(){
      if(this.selectCatKeys.length > 2) {
        return false
      }else{
        return true
      }
    },
    cateId: function(){
      if (this.selectCatKeys.length === 3) {
        return this.selectCatKeys[2]
      }
      return null
    },
    titleText() {
      if(this.activeName === 'many') {
        return '动态参数'
      }
      return '静态属性'
    },

  }
}
</script>
<style lang='less' scoped>
  .cat_opt{
    margin: 15px 0;
  }
  .el-cascader{
    margin-left: 15px
  }
  .input-new-tag{
    width: 120px;
    margin: 10px;
  }
  .el-tag{
    margin: 10px
  }
</style>