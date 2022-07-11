let _Vue = null
class VueRouter {
  static install(Vue) {
    // 1.判断当前插件是否已经被安装，如果插件已经安装直接返回
    if (VueRouter.install.installed) return
    VueRouter.install.installed = true
    // 2.把vue构造函数记录到全局变量
    _Vue = Vue
    // 3.把创建Vue实例时候的 router 对象注入到 Vue 实例上
    // 3.1 通过混入的方式处理
    // 3.2 判断 router 对象是否已经挂载了 Vue 实例上
    _Vue.mixin({
      beforeCreate() {
        if (this.$options.router) {
          _Vue.prototype.$router = this.$options.router
          this.$options.router.init()
        }
      }
    })
  }
  constructor(options) {
    // 接收传入的对象
    this.options = options
    // 判断当前路由模式history/hash
    this.mode = options.mode || 'hash'
    // 用于存储路径与对应的组件，属性：路径，属性值：组件
    this.routerMap = {}
    this.data = _Vue.observable({
      current: '/'
    })
  }
  init() {
    this.createRouteMap()
    this.initComponents()
    this.initEvent()
  }
  createRouteMap() {
    this.options.routes.forEach(route => {
      return this.routerMap[route.path] = route.component
    })
  }
  isHash (mode) {
    return mode === 'hash'
  }
  initComponents() {
    const _this = this
    _Vue.component('router-link', {
      props: {
        to: String
      },
      render(h) {
        return h('a', {
          attrs: {
            href: _this.isHash(_this.mode) ? '/#'+ this.to : this.to
          },
          on: {
            click: this.clickHandle
          }
        }, [this.$slots.default])
      },
      methods: {
        clickHandle(e) {
          if (_this.isHash(_this.mode)){
            this.$router.data.current = this.to
          } else {
            //切换路由
            this.$router.data.current = this.to
            history.pushState({}, '', this.to)
            e.preventDefault()
          }
        }
      }
    })
    _Vue.component('router-view', {
      render(h) {
        // 找到路由对应的组件,进行渲染
        const component = _this.routerMap[_this.data.current]
        return h(component)
      }
    })
  }
  initEvent() {
    if (this.isHash(this.mode)) {
      window.addEventListener('hashchange',()=>{
        this.data.current = window.location.hash.slice(1)
      })
    } else {
      window.addEventListener('popstate', () => {
        this.data.current = window.location.pathname
      })
    }
  }
}

export default VueRouter