<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
    <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
    <el-breadcrumb-item>商品管理</el-breadcrumb-item>
    <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
  
    <!-- 卡片视图区域 -->
    <el-card>
      <el-row :gutter="20">
        <!-- 搜索框 -->
        <el-col :span="8">
          <el-input placeholder="请输入内容" 
            v-model="queryInfo.query" 
            clearable 
            @clear="getGoodsList"
            @keyup.enter.native="getGoodsList()"
            >
    
            <el-button slot="append" icon="el-icon-search" @click="getGoodsList"></el-button>
          </el-input>
        </el-col>
        <!-- 添加商品按钮 -->
        <el-col :span="4">
          <el-button type="primary" @click="goAddPage">添加商品</el-button>
        </el-col>
      </el-row>

      <!-- table表格区域 -->
      <el-table 
      :data="goodsList" 
      border 
      stripe 
      style="width: 100%">

        <!-- 第一列index -->
        <el-table-column
          type="index"
          width="50">
        </el-table-column>
        <!-- 第二列商品名称 -->
         <el-table-column
          property="goods_name"
          label="商品名称"
          >
        </el-table-column>
        <!-- 第三列商品价格 -->
         <el-table-column
          property="goods_price"
          label="商品价格(元)"
          width="120px"
          >
        </el-table-column>
        <!-- 第四列商品重量 -->
         <el-table-column
          property="goods_weight"
          label="商品重量"
          width="95px"
          >
        </el-table-column>

        <!-- 第五列创建时间 -->
        <el-table-column
          property="add_time"
          label="创建时间"
          width="180px"
          >
          <template slot-scope="scope">
            {{scope.row.add_time | dateFormat}}
          </template>
        </el-table-column>

        <!-- 第六列操作 -->
         <el-table-column
          label="操作"
          width="130px"
          >
          <template slot-scope="scope">
            <!-- 修改按钮 -->
            <el-button size="mini" type="primary" icon="el-icon-edit"></el-button>
            <!-- 删除按钮 -->
            <el-button size="mini" type="danger" icon="el-icon-delete" @click="removeById(scope.row.goods_id)"></el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页功能 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[5 ,10 ,15,20]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>

    </el-card>
  </div>
</template>
<script>
export default {
  created(){
    // 获取商品列表数据
    this.getGoodsList()
  },
  data () {
    return {
      // 查询参数对象
      queryInfo:{
        query:'',
        pagenum:1,
        pagesize:10
      },
      // 商品列表
      goodsList:[],
      // 总数据条数
      total:0
    };
  },
  methods:{

    // 根据分页获取商品列表数据
    async getGoodsList() {
      const {data:res} = await this.$http.get('goods',{params:this.queryInfo})
      if(res.meta.status !== 200) return this.$message.error('获取商品列表数据失败')

      console.log('获取商品列表数据成功!');
      console.log(res.data);
      this.goodsList = res.data.goods
      this.total = res.data.total
      
    },

    // 每页存放的数据和页码更改时
    handleSizeChange(newSize){
      this.queryInfo.pagesize = newSize
      this.getGoodsList()
    },
    handleCurrentChange(newpage){
      this.queryInfo.pagenum = newpage
      this.getGoodsList()
    },
    // 根据id删除商品
    async removeById(id){
      const confirmResult  = await this.$confirm(
        '此操作将永久删除该商品',
        '提示',{
          confirmButtonText:'确定',
          cancelButtonText:'取消',
          type:'warning'
        }
      ).catch(err => err)

      if (confirmResult !== 'confirm') {
        return this.$message.info('已经取消删除')
      }

      const {data:res} = await this.$http.delete(`goods/${id}`)
      if (res.meta.status != 200) {
        return this.$message.error('删除商品失败')
      }
      this.$message.success('删除商品成功')
      this.getGoodsList()
    

    },
    // 跳转到添加商品页面
    goAddPage(){
      this.$router.push('/goods/add')
    }
  }

}
</script>
<style lang='less' scoped>
  .el-table{
    margin-top: 20px
  }
</style>