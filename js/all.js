
const api_path ='biggo';
const url = 'https://vue3-course-api.hexschool.io/v2'

VeeValidate.defineRule('email', VeeValidateRules['email']);
VeeValidate.defineRule('required', VeeValidateRules['required']);

// 讀取外部的資源
VeeValidateI18n.loadLocaleFromURL('./zh_TW.json');

// Activate the locale
VeeValidate.configure({
  generateMessage: VeeValidateI18n.localize('zh_TW'),
  validateOnInput: true, // 調整為：輸入文字時，就立即進行驗證
});



const app = Vue.createApp({
    data() {
        return {
          products:{},
          cart:{
            carts:'',
          },
        }
    },
    methods:{
      getPorduct(){
        axios.get(`${url}/api/${api_path}/products`)
           .then((res)=>{
            this.products = res.data.products;
            })
          .catch((error)=>{
            console.log(error);
            })
      },
      getMoreProductsData(data){
        //傳給modal資料
        this.$refs.modal.openMyModal(data);

      },
      addToCart(id,qty=1){
        const data = {
          "data": {
            "product_id": id,
            "qty": 1,
          }
        }
        axios.post(`${url}/api/${api_path}/cart`,data)
           .then((res)=>{
            if(res.data.data.qty>1){
              alert("商品增加數量");
            }
            this.getCartData();
            })
          .catch((error)=>{
            console.log(error);
            })
      },
      getCartData(){
        axios.get(`${url}/api/${api_path}/cart`)
           .then((res)=>{
            this.cart = res.data.data;
            })
          .catch((error)=>{
            console.log(error);
            })
      },
      changeItemQty(item){
        const {id,qty,product_id} = item;
        const data = {
          "data": {
            "product_id": product_id,
            "qty": qty
          }
        };
        axios.put(`${url}/api/${api_path}/cart/${id}`,data)
           .then((res)=>{
              this.getCartData();
              alert("更新數量")
            })
          .catch((error)=>{
            console.log(error);
            })
      },
      deleteCart(id){
        axios.delete(`${url}/api/${api_path}/cart/${id}`)
        .then((res)=>{
          this.getCartData();
          alert("刪除產品");

         })
       .catch((error)=>{
         console.log(error);
         })
      },
      deleteAllCart(){
        axios.delete(`${url}/api/${api_path}/carts`)
        .then((res)=>{
          this.getCartData();
          alert("已刪除全部購物車清單");
         })
       .catch((error)=>{
         console.log(error);
         })
      },
      //表單驗證電話
      isPhone(value) {
        const phoneNumber = /^(09)[0-9]{8}$/
        return phoneNumber.test(value) ? true : '需要正確的電話號碼'
      },
      onSubmit() {
        
      },
    },
    mounted(){
      this.getPorduct();
      this.getCartData();
      
    }
})

app.component('productModal' , {
  data(){
    return {
      alertData:null,
      myModal:null,
      qty:1,
      cart:null,
    }
  },
  methods:{
    openMyModal(data){
      this.alertData = data;
      this.myModal.show();
    },
    closeModal(){
      this.myModal.hide();
    },
    addToCart(alertData,qty=1){
      const data = {
        "data": {
          "product_id": alertData.id,
          "qty": this.qty,
        }
      }
      
      axios.post(`${url}/api/${api_path}/cart`,data)
         .then((res)=>{
          console.log(res);
          this.closeModal();
          //更新購物車
          this.$emit('updateCartData');
          //預設變為一
          this.qty = 1;
          })
        .catch((error)=>{
          console.log(error);
          })
    },
    
  },
  mounted() {
    // console.log(this.$refs.modal);
    this.myModal = new bootstrap.Modal(this.$refs.modal);
  },
  template: '#userProductModal'
})


app.component('VForm', VeeValidate.Form);
app.component('VField', VeeValidate.Field);
app.component('ErrorMessage', VeeValidate.ErrorMessage);



app.mount('#app');
