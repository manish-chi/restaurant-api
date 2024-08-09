const catchAsync = require('../utils/catchAsync');
const appError = require('../utils/appError');
let Stripe = require('stripe');


exports.createSessionUrl = catchAsync(async(req,res,next) => {
   var items = req.body.items;
   console.log(items);

   stripe = new Stripe(process.env.STRIPE_PRIVATE_KEY);

   let session = await stripe.checkout.sessions.create({
    payment_method_types : ['card'],
    mode : 'payment',
    line_items : items.map(item => {return{
        price_data : {
            currency : 'usd',
            product_data : {
                name : item.Name
            },
            unit_amount : 10000
        },
        quantity : item.Quantity
    }}),
    success_url : 'https://035a-2406-b400-b9-42cf-8b9-14a5-d4-f973.ngrok-free.app/api/notify',
    cancel_url: 'http://localhost:3001/main'
   });

   return res.status(200).json({
        status : 'success',
        data : session.url
   });
});