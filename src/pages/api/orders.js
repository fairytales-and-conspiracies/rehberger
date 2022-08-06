import mongoose from 'mongoose';

import dbConnect from '@lib/dbConnect';
import sendMail from '@lib/sendMail';
import Frame from '@models/Frame';
import Order from '@models/Order';
import ErrorTypes from '@static-data/errors';

const updateOrderForClaimedNFTs = async (orderNumber) => {
  const order = await Order.findByIdAndUpdate(
    mongoose.Types.ObjectId(orderNumber),
    {
      claimed: true,
    },
    {
      lean: true,
    }
  );
  order.claimed = true;
  return order;
};

export default async function handler(req, res) {
  const { method } = req;

  await dbConnect();

  switch (method) {
    case 'GET':
      try {
        const orders = await Order.find({});
        res.status(200).json({ success: true, data: orders });
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;
    case 'POST':
      try {
        let order;
        const {
          answer,
          claimed,
          frames,
          orderNumber,
          question,
          securityVerification,
          transactionStatus,
        } = req.body;

        // This is when a customer that has paid by card wants to
        // claim their NFT
        if (claimed) {
          try {
            order = await Order.findById(orderNumber);
          } catch (err) {
            console.log('Error: ', err);

            // If order does not exist
            if (!!err.name && err.name === 'CastError') {
              res.status(400).json({
                success: false,
                error: {
                  type: ErrorTypes.NO_ORDER_FOUND,
                  message: 'Incorrect order number.',
                },
              });
            }

            // If there is another unexpected error
            else {
              res.status(400).json({
                success: false,
                error: {
                  type: ErrorTypes.GENERIC_ERROR,
                  message: 'There has been an error.',
                },
              });
            }
            return;
          }

          // After submitting security question and answer form
          if (securityVerification) {
            if (order.question === question && order.answer === answer) {
              order = await updateOrderForClaimedNFTs(orderNumber);
              sendMail(true, order).catch(console.error);
            } else {
              res.status(400).json({
                success: false,
                error: {
                  type: ErrorTypes.INCORRECT_SECURITY_QUESTION_ANSWER,
                  message: 'Incorrect answer. Please try a different one.',
                },
              });
              return;
            }
          }

          // After submitting the order verificatio form,
          // before submitting the security question and answer form
          else {
            if (order.noSecurityQuestion) {
              order = await updateOrderForClaimedNFTs(orderNumber);
              sendMail(true, order).catch(console.error);
            }

            // In case there is a security question, do not send the whole
            // order, since the question and ansewr can potentially be seen
            // on the frontend
            else {
              const { noSecurityQuestion, question } = order;
              res.status(201).json({
                success: true,
                data: {
                  noSecurityQuestion,
                  question,
                },
              });
              return;
            }
          }
        }

        // This is when a card order is being created, but has not
        // been processed through a wallet or the Stripe
        // payment platform yet
        else if (transactionStatus === 'PENDING') {
          const body = {
            ...req.body,
            frames,
          };
          order = await Order.create(body);
        }

        // This is when an order has been successfully created, either
        // when we have received a successful response from a wallet
        // or from Stripe
        else if (transactionStatus === 'SUCCESS') {
          order = await Order.findByIdAndUpdate(
            mongoose.Types.ObjectId(req.body._id),
            {
              transactionStatus,
            },
            {
              lean: true,
            }
          );

          const filter = { _id: { $in: [] } };
          order.frames.forEach((frame) =>
            filter['_id']['$in'].push(frame['_id'])
          );
          Frame.updateMany(filter, { sold: true });
          order.claimed = false;
          sendMail(true, order).catch(console.error);
        }

        res.status(201).json({ success: true, data: order });
      } catch (err) {
        // sendMail(false, err).catch(console.error);
        res.status(400).json({ success: false, err });
      }
      break;
    default:
      res.status(400).json({ success: false });
      break;
  }
}
