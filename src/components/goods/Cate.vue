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
          <el-button type="primary">添加分类</el-button>
          
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
          style="color:lightgreen;"></i>
          <i class="el-icon-error" v-else style="color:red;"></i>

        </template>
        <!-- 排序 -->
        <template slot="order" slot-scope="scope">
          <el-tag type="danger" v-if="scope.row.cat_level==0">一级</el-tag>
          <el-tag type="succcess" v-else-if="scope.row.cat_level==1">二级</el-tag>
          <el-tag type="warning" v-else>三级</el-tag>

        </template>
        <!-- 操作 -->
        <template slot="opt" slot-scope="scope">
          <el-button type="primary" size="mini" icon="el-icon-edit" >编辑</el-button>
          <el-button type="danger" size="mini" icon="el-icon-delete" >删除</el-button>
        </template>
      </tree-table>
        

      
      
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
        }]
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
  }
}
</script>
<style lang='less' scoped>
  .el-button {
    margin-bottom: 15px;
  }
  
</style>