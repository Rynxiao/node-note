(function() {
    var upload = $('#upload');
    var fList = $('#fList');

    var currentDom = null;

    var liTemplate = `<li class="list-item" data-name="{{name}}">
                        <div class="text clearfix">
                            <span class="file-name">{{name}}</span> 
                            <div class="pull-right">
                                <span class="p-text">0%</span>
                                <span class="p-flag" style="margin-left:5px;">正在上传</span>
                                <span class="btn btn-link ts hidden">开始转换</span>
                                <span class="btn btn-link download hidden">下载表格</span>
                                <span class="btn btn-link delete hidden">删除</span>
                            </div>
                        </div>
                        <div class="f-progress"></div>
                    </li>`;

    function showToast(text, icon = 'error') {
        $.toast({
            text,
            position: 'top-left',
            showHideTransition: 'slide',
            icon,
            hideAfter: 5000
        });
    }

    /**
     * 是否是Excel文件
     * @param  {[type]}  name [description]
     * @return {Boolean}      [description]
     */
    function isExcel(name) {
        var fileext = name.substring(name.lastIndexOf("."), name.length);
        var isExcel = true;

        fileext = fileext.toLowerCase();

        if (fileext !== '.xls' && fileext !== '.xlsx') {
            isExcel = false;
        }

        return isExcel;
    }

    /**
     * 更新上传列表
     * @param  {[type]} file [description]
     * @return {[type]}      [description]
     */
    function updateUploadList(file) {
        var name = file.name;
        var template = liTemplate.replace(/\{\{name\}\}/g, name);
        currentDom = $(template);
        fList.append(currentDom);
    }

    /**
     * 动态创建表单
     * @param  {Function} cb [description]
     * @return {[type]}      [description]
     */
    function createForm(cb) {
        var file;
        var formData = new FormData();
        var input = document.createElement('input');
        input.setAttribute('type', 'file');
        input.setAttribute('name', 'files');
        input.click();
        input.onchange = function () {
            file = input.files[0];

            if (!isExcel(file.name)) {
                showToast('你是不是有毛病，不是说好的传表格么？');
                return;
            }

            formData.append('files', file);

            updateUploadList(file);
            cb(formData);
        }
    }

    /**
     * 上传表单
     * @param  {[type]} formData [description]
     * @return {[type]}          [description]
     */
    function uploadEvent(formData) {
        $.ajax({  
            url: '/upload' ,  
            type: 'POST',  
            data: formData,  
            cache: false,  
            contentType: false,  
            processData: false, 
            xhr: function() {
                var xhr = new window.XMLHttpRequest();

                //Upload progress
                xhr.upload.addEventListener("progress", function(evt){
                    if (evt.lengthComputable) {
                        var percentComplete = evt.loaded / evt.total;
                        var pText = currentDom.find('.p-text');
                        var fProgress = currentDom.find('.f-progress');
                        var ts = currentDom.find('.ts');
                        var deleteEle = currentDom.find('.delete');
                        var pFlag = currentDom.find('.p-flag');
                        //Do something with upload progress
                        
                        percentComplete = parseFloat(percentComplete * 100).toFixed(0);
                        pText.text(percentComplete + '%');
                        fProgress.css('width', percentComplete + '%');
                        setTimeout(function() {
                            fProgress.css('opacity', 0);
                            pFlag.addClass('hidden');
                            pText.addClass('hidden');
                        }, 2000);

                        if (+percentComplete === 100) {
                            pFlag.text('上传成功');
                            ts.removeClass('hidden');
                            deleteEle.removeClass('hidden');
                        }
                    }
                }, false);

                //Download progress
                // xhr.addEventListener("progress", function(evt){
                //     if (evt.lengthComputable) {
                //         var percentComplete = evt.loaded / evt.total;
                //         console.log(percentComplete);
                //     }
                // }, false);
                
                return xhr;
            },
            success: function (returndata) { 
                if (!returndata.success && returndata.code === 403) {
                    currentDom.remove();
                    showToast('文件已经上传或者转换过，如果内容不相同，你能换个名字么？');
                    return;
                }
                var fileUrl = returndata.data.fileUrl;
                currentDom.attr('data-path', fileUrl);
            },  
            error: function (returndata) {  
                pFlag.text('上传失败');
                fProgress.css({ width: '100%', 'background-color': 'rgba(255, 0, 0, 0.2)' });
            }  
        });
    }

    // 上传
    upload[0].addEventListener('click', function() {
        createForm(uploadEvent);
    });

    // 转换
    $('#fList').on('click', '.ts', function() {
        var $listItem = $(this).closest('.list-item');
        var path = $listItem.attr('data-path');
        $.ajax({
            url: '/transform',
            type: 'get',
            data: { path },
            success(res) {
                if (res.success && res.code === 200) {
                    var name = 'ts-' + path.replace(/\w+<<(.*?)/, '');
                    var fileName = $listItem.find('.file-name');
                    var ts = $listItem.find('.ts');
                    var download = $listItem.find('.download');
                    $listItem.attr('data-path', res.data.path);
                    showToast('Excel转换成功啦，去下载吧!!!', 'info');
                    console.log(name)
                    fileName.text(name);
                    ts.addClass('hidden');
                    download.removeClass('hidden');
                }
            },
            error(err) {
                console.log(err);
            }
        });
    })

    // 删除
    $('#fList').on('click', '.delete', function() {
        var $listItem = $(this).closest('.list-item');
        var path = $listItem.attr('data-path');
        $.ajax({
            url: '/delete',
            type: 'get',
            data: { path },
            success(res) {
                if (res.code === 200) {
                    showToast(res.message, 'info');
                    $listItem.remove();
                } else {
                    showToast(res.message);
                }
            },
            error(err) {
                console.log(err);
            }
        });
    });

})();




