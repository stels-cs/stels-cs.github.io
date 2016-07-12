export function getJSON(url, success, error) {
    'use strict';
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                success(JSON.parse(xhr.responseText));
            } else {
                try {
                    error(JSON.parse(xhr.responseText));
                } catch (e) {
                    error({'error':'Server error', 'server':true});
                }
            }
        }
    };
    xhr.open('GET', url);
    xhr.send();
}

/**
 * @return {string}
 */
function EncodeQueryData(data)
{
    var ret = [];
    for (var d in data)
        ret.push(encodeURIComponent(d) + "=" + encodeURIComponent(data[d]));
    return ret.join("&");
}

export function api(method, params, success, error) {
    let path = '/api/v1/'+method+'?'+EncodeQueryData(params);
    getJSON(path, success, error);
}