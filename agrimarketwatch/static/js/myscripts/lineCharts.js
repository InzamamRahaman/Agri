var data = null;
var data_loaded = false;
var xhr = new XMLHttpRequest()
xhr.onreadystatechange = function()
{
    if(xhr.readyState == 4 && xhr.status == 200)
    {
        data = xhr.responseText;
        data_loaded = true;
        console.log(data)
    }
}

xhr.open('GET', 'http://127.0.0.1:5000/crops/monthly/all')
xhr.send()