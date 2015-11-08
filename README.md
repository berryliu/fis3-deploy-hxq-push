# fis3-deploy-hxq-push

好学区编译部署组件，fis3 组件

# 使用方式

在 `fis-config.js` 文件里配置

```
fis.match('*', {
    deploy: [
        fis.plugin('hxq-push')
    ]
});
```

