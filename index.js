var tar = require('tar-stream');
var fs = require('fs');
var exec = require('child_process').exec;

module.exports = function (options, modified, total, callback) {
    // 简单判断打包文件
    if (!total.length) {
        return false;
    }

    // 文件打包
    // todo 添加打包日志
    var pack = tar.pack();
    total.forEach(function (file) {
        if ((file.rExt === '.html' &&     // 过滤非 page 路径下的 html 模板
            !(/\/page\//.test(file.id))) ||
            (file.rExt === '.handlebars')
        ) {
            return;
        }

        var filepath = file.getHashRelease().substring(1);

        pack.entry({
            name: filepath
        }, file.getContent());

        fis.log.debug('file [' + file.id + '] packed');
    });

    // 输出 output.tar
    var path = fis.project.getProjectPath() + '/output.tar';
    var target = fs.createWriteStream(path);
    pack.pipe(target);

    // 发布到测试环境
    var params = {
        file: path,
        user: 'front',
        host: '112.74.195.60',
        path: '~'
    };

    var command = [
        'scp -r -P 22',
        '-o "ControlMaster no"',
        params.file,
        params.user + '@' + params.host + ':' + params.path
    ];

    exec(command.join(' '), function (err, stdout, stderr) {
        if (err) {
            console.log(err);
        }
        else {
            console.log('All files transferred.');
        }
    });
};
