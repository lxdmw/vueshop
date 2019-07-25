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
              <el-table-column type="expand"></el-table-column>
              <!-- 索引列 -->
              <el-table-column type="index"></el-table-column>
              <el-table-column label="参数名称" prop="attr_name"></el-table-column>
              <el-table-column label="操作">
                <template >
                    <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditForm">编辑</el-button>
                    <el-button type="danger" icon="el-icon-delete" size="mini">删除</el-button>

                </template>
              </el-table-column>            
              </el-table>
          </el-tab-pane>
          <el-tab-pane label="静态属性" name="only">
            <el-button type="primary" size="mini" :disabled="isBtnDisabled" @click="showDialog">添加属性</el-button>
            <el-table :data="onlyTableData" border stripe>
              <!-- 展开行 -->
              <el-table-column type="expand"></el-table-column>
              <!-- 索引列 -->
              <el-table-column type="index"></el-table-column>
              <el-table-column label="参数名称" prop="attr_name"></el-table-column>
              <el-table-column label="操作">
                <template >
                    <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditForm">编辑</el-button>
                    <el-button type="danger" icon="el-icon-delete" size="mini">删除</el-button>

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
      width="50%" >
      <el-form :model="editForm" :rules="addFormRules" ref="editFormRef" label-width="100px" >
        <el-form-item :label="titleText" prop="attr_name">
          <el-input v-model="editForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editDialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>

  </div>
</template>
<script>

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
       
      const{data:res} = await this.$http.get(`categories/${this.cateId}/attributes`,{params:{sel:this.activeName}})

      if(res.meta.status != 200) {
        return this.$message.error('获取数据列表参数失败')
      }
      
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
    showEditForm(){
      editDialogVisible:true
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
</style>