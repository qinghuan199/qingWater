
export default{
    isLogin:function(_this){
        if(!_this.$store.getters.getLoginValue){
            return _this.$router.push("Login")
        }
    }
}
