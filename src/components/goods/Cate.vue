<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
    <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
    <el-breadcrumb-item>商品管理</el-breadcrumb-item>
    <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <!-- 分类添加区域 -->
      <el-row>
        <el-col>
          <el-button type="primary" @click="showAddCateDialog">添加分类</el-button>
          
        </el-col>
      </el-row>

      <!-- 分类列表区域 -->
      <tree-table 
        :data="goodList" 
        :columns="columns"
        :expand-type='false'
        :selection-type='false'
        show-index
        index-text="#"
        border
        :show-row-hover="false">
        <!-- 是否有效 -->
        <template slot="isOk" slot-scope="scope">
          <i 
          class="el-icon-success" 
          v-if="scope.row.cat_deleted==false"
          style="color:lightgreen;">
          </i>
          <i class="el-icon-error" v-else style="color:red;">
          </i>
        </template>
        <!-- 排序 -->
        <template slot="order" slot-scope="scope">
          <el-tag type="danger" v-if="scope.row.cat_level==0">一级</el-tag>
          <el-tag type="succcess" v-else-if="scope.row.cat_level==1">二级</el-tag>
          <el-tag type="warning" v-else>三级</el-tag>

        </template>
        <!-- 操作 -->
        <template slot="opt" >
          <el-button type="primary" size="mini" icon="el-icon-edit" >编辑</el-button>
          <el-button type="danger" size="mini" icon="el-icon-delete" >删除</el-button>
        </template>
      </tree-table>
      
      <!-- 添加分类对话框 -->
      <el-dialog
        title="添加分类"
        :visible.sync="addCateDialogVisible"
        width="30%"
        @close="addCateDialogClosed"

        >
        <!-- 添加分类的表单 -->
        <el-form :model="addCateForm"
        :rules="addCateFormRules"
        ref="addCateFormRef"
        label-width="100px">
          <el-form-item label="分类名称" prop="cat_name">
            <el-input v-model="addCateForm.cat_name"></el-input>
          </el-form-item>
          <el-form-item label="父级分类:" >

            <el-cascader 
              
              :options="parentCateList"
              v-model="selectedKeys"
              @change="parentCateChanged"
              :props="cascaderProps"
              clearable
              style="height:30px">

            </el-cascader>
          </el-form-item>

        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="addCateDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addCate">确 定</el-button>
        </span>
      </el-dialog>

            
      
      <!-- 分页区域 -->
      <el-pagination 
        
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[3, 5, 10, 15]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>


    </el-card>
  </div>
</template>
<script>
export default {
  created() {
    // 获取商品分类列表
    this.getGoodsList()
  },
  data () {
    return {
      // 显示隐藏添加分类对话框
      addCateDialogVisible:false,
      // 查询条件
      queryInfo:{
        type:3,
        pagenum:1,
        pagesize:5
      },

      // 商品分类的数据列表,默认为空
      goodList:[],
      // 表的分列数据
      total: 0,
      columns:[
        {
          label:'分类名称',
          prop:'cat_name',
        },{
          label:'是否有效',
          // 表示将当前列定义为模板列
          type:'template',
          // 表示当前这一列使用模板的名称
          template:'isOk'
        },{
          label:'排序',
          // 表示将当前列定义为模板列
          type:'template',
          // 表示当前这一列使用模板的名称
          template:'order'
        },{
          label:'操作',
          type:'template',
          template:'opt'
        }],
        addCateForm:{
          // 将要添加的分类的名称
          cat_name:'',
          cat_pid: 0,
          cat_level: 0,
        },
        addCateFormRules:{
          cat_name:[
            {required:true,message:'请输入分类名称', trigger:'blur'}
          ]
        },
        parentCateList:[],
        // 指定级联选择器的配置对象
        cascaderProps:{
          value:'cat_id',
          label:'cat_name',
          children:'children',
          checkStrictly: true,
          expandTrigger:"hover"
        },
        // 选中的父级分类的id数组
        selectedKeys:[],



    };
  },
  methods:{
    // 获取商品分类列表
    async getGoodsList(){
      const {data:res} = await this.$http.get('categories', {params: this.queryInfo})
      if(res.meta.status != 200) return this.$message.error('获取商品分类列表失败')

      this.$message.success('获取商品分类列表数据success!!!oye')
      console.log(res.data.result);
      
      // 把数据列表 赋值给goodList
      this.goodList = res.data.result

      //为总条数赋值
      this.total = res.data.total
    },
    // 监听pagesize改变
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize
      this.getGoodsList()
    },
    // 监听pagenum改变
    handleCurrentChange(newPage){
      this.queryInfo.pagenum = newPage
      this.getGoodsList()
    },
    // 点击添加分类按钮展示对话框
    showAddCateDialog(){
      this.getParentCateList()
      this.addCateDialogVisible=true
    },
    // 获取父类的数据列表
    async getParentCateList(){
      const {data:res} = await this.$http.get('categories',{params:{type:2}})
      if(res.meta.status != 200) return this.$message.error('获取父级分类数据失败')

      this.parentCateList = res.data
      
      
    },
    // 监听选择父级的变换
    parentCateChanged(){
      // 如果selectedKeys>0说明点选了父级
      if(this.selectedKeys.length > 0) {
        // 取最后一个id值作为父级的id
        this.addCateForm.cat_pid = this.selectedKeys[this.selectedKeys.length - 1]
        // 数组长度正好等于父级的层级
        this.selectedKeys.cat_level = this.selectedKeys.length
        return
      }else{
        // 否则清零id和层级
        this.addCateForm.cat_pid = 0
        this.selectedKeys.cat_level = 0
      }
    },
    //点击确定提交添加分类表单
    addCate(){
      this.$refs.addCateFormRef.validate(async valid=>{
        if (!valid) return 
        const {data:res} = await this.$http.post('categories',this.addCateForm)
        if(res.meta.status != 201) {
          return this.$message.error('添加分类失败')
        }
        this.$message.success('添加分类成功')
        this.getGoodsList()
        this.addCateDialogVisible  = false


      })
    },
    // 监听添加分类对话框的关闭事件
    addCateDialogClosed(){
      this.$refs.addCateFormRef.resetFields()
      this.selectedKeys =[]
      this.addCateForm.cat_level = 0
      this.addCateForm.cat_pid = 0
    },
    
    
  }
}
</script>
<style lang='less' scoped>
  .el-button {
    margin-bottom: 15px;
  }


  
</style>