const checksum_lib = require('./paytm/checksum/checksum')
const configDetails = require('./config')

const PORT = 5000;

module.exports = (app) => {
    app.get('/payment', (req, res) => {
        let params = {}

        params['MID'] = configDetails.merchant_id;
        params['WEBSITE'] = configDetails.website;
        params['CHANNEL_ID'] = configDetails.channel_id;
        params['INDUSTRY_TYPE_ID'] = configDetails.industry_type_id;
        params['ORDER_ID'] = configDetails.order_id;
        params['CUST_ID'] = configDetails.cust_id;
        params['TXN_AMOUNT'] = '100';
        params['CALLBACK_URL'] = configDetails.callback_url;
        params['EMAIL'] = configDetails.email;
        params['MOBILE_NO'] = configDetails.mobile_no;

        checksum_lib.genchecksum(params, configDetails.merchant_key, function(err, checksum){
            var url = "https://securegw-stage.paytm.in/order/process";

            res.writeHead(200, {'Content-Type': 'text/html'});
            res.write('<html>');
            res.write('<head>');
            res.write('<title>Merchant Checkout Page</title>');
            res.write('</head>');
            res.write('<body>');
            res.write('<center><h1>Please do not refresh this page...</h1></center>');
            res.write('<form method="post" action="' + url + '" name="paytm_form">');
            for(var x in params){
                res.write('<input type="hidden" name="' + x + '" value="' + params[x] + '">');
            }
            res.write('<input type="hidden" name="CHECKSUMHASH" value="' + checksum + '">');
            res.write('</form>');
            res.write('<script type="text/javascript">');
            res.write('document.paytm_form.submit();');
            res.write('</script>');
            res.write('</body>');
            res.write('</html>');
            res.end();
        })


    })
}